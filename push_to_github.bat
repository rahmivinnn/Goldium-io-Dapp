@echo off
echo Initializing Git repository...
git init

echo Adding all files to Git...
git add .

echo Committing changes...
git commit -m "Initial commit of Goldium.io dApp"

echo Adding remote repository...
git remote add origin https://github.com/rahmivinnn/Goldium-io-Dapp.git

echo Pushing to GitHub...
git push -u origin master

echo Done!
pause