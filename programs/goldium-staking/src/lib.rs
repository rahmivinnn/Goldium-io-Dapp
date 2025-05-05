use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use std::mem::size_of;

declare_id!("GStKMmGZ5fJJLBD7Z6YZXGXKjMU14xLnQvzHVtF1pH9m");

#[program]
pub mod goldium_staking {
    use super::*;

    // Initialize a new staking account for a user
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        staking_account.owner = ctx.accounts.user.key();
        staking_account.staked_amount = 0;
        staking_account.rewards = 0;
        staking_account.last_update_time = Clock::get()?.unix_timestamp;
        Ok(())
    }

    // Stake tokens
    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        // Transfer tokens from user to vault
        let transfer_instruction = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.staking_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );

        token::transfer(cpi_ctx, amount)?;

        // Update staking account
        let staking_account = &mut ctx.accounts.staking_account;
        
        // Calculate and update rewards before adding new stake
        update_rewards(staking_account)?;
        
        // Add new stake
        staking_account.staked_amount = staking_account.staked_amount.checked_add(amount).unwrap();
        staking_account.last_update_time = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // Unstake tokens
    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        
        // Calculate and update rewards before unstaking
        update_rewards(staking_account)?;
        
        // Get amount to unstake
        let amount = staking_account.staked_amount;
        if amount == 0 {
            return Err(ErrorCode::NoStakedTokens.into());
        }
        
        // Reset staked amount
        staking_account.staked_amount = 0;
        staking_account.last_update_time = Clock::get()?.unix_timestamp;
        
        // Transfer tokens from vault to user
        let seeds = &[
            b"vault".as_ref(),
            &[*ctx.bumps.get("staking_vault").unwrap()],
        ];
        let signer = &[&seeds[..]];
        
        let transfer_instruction = Transfer {
            from: ctx.accounts.staking_vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.staking_vault.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            signer,
        );
        
        token::transfer(cpi_ctx, amount)?;
        
        Ok(())
    }

    // Claim rewards
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        
        // Calculate and update rewards
        update_rewards(staking_account)?;
        
        // Get rewards amount
        let rewards_amount = staking_account.rewards;
        if rewards_amount == 0 {
            return Err(ErrorCode::NoRewards.into());
        }
        
        // Reset rewards
        staking_account.rewards = 0;
        staking_account.last_update_time = Clock::get()?.unix_timestamp;
        
        // Transfer rewards from vault to user
        let seeds = &[
            b"vault".as_ref(),
            &[*ctx.bumps.get("staking_vault").unwrap()],
        ];
        let signer = &[&seeds[..]];
        
        let transfer_instruction = Transfer {
            from: ctx.accounts.staking_vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.staking_vault.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            signer,
        );
        
        token::transfer(cpi_ctx, rewards_amount)?;
        
        Ok(())
    }
}

// Helper function to update rewards
fn update_rewards(staking_account: &mut Account<StakingAccount>) -> Result<()> {
    let current_time = Clock::get()?.unix_timestamp;
    let time_passed = current_time.checked_sub(staking_account.last_update_time).unwrap() as u64;
    
    if time_passed > 0 && staking_account.staked_amount > 0 {
        // Calculate rewards: APR is 18.5%
        // Daily rate = APR / 365 = 0.185 / 365 = 0.000506849315
        // Per second rate = Daily rate / 86400 = 0.000506849315 / 86400 = 0.00000000586632
        // For precision, we multiply by 10^9 and then divide by 10^9 later
        // Rate per second * 10^9 = 5866.32
        const RATE_PER_SECOND: u64 = 5866;
        
        let reward = staking_account
            .staked_amount
            .checked_mul(RATE_PER_SECOND).unwrap()
            .checked_mul(time_passed).unwrap()
            .checked_div(1_000_000_000).unwrap();
        
        staking_account.rewards = staking_account.rewards.checked_add(reward).unwrap();
    }
    
    staking_account.last_update_time = current_time;
    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = 8 + size_of::<StakingAccount>(),
        seeds = [b"staking", user.key().as_ref()],
        bump
    )]
    pub staking_account: Account<'info, StakingAccount>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"staking", user.key().as_ref()],
        bump,
        has_one = owner @ ErrorCode::InvalidOwner,
    )]
    pub staking_account: Account<'info, StakingAccount>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub staking_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"staking", user.key().as_ref()],
        bump,
        has_one = owner @ ErrorCode::InvalidOwner,
    )]
    pub staking_account: Account<'info, StakingAccount>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub staking_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"staking", user.key().as_ref()],
        bump,
        has_one = owner @ ErrorCode::InvalidOwner,
    )]
    pub staking_account: Account<'info, StakingAccount>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub staking_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct StakingAccount {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub rewards: u64,
    pub last_update_time: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid owner")]
    InvalidOwner,
    #[msg("No staked tokens")]
    NoStakedTokens,
    #[msg("No rewards to claim")]
    NoRewards,
}
