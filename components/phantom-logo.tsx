interface PhantomLogoProps {
  size?: number
  className?: string
}

export function PhantomLogo({ size = 24, className = "" }: PhantomLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" rx="64" fill="#AB9FF2" />
      <path
        d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8354 41.3057 14.4118 64.0583C13.9708 87.8583 33.8294 108 57.8848 108H63.6229C84.0192 108 108.343 91.1666 110.557 71.2457C110.827 68.1385 110.584 64.9142 110.584 64.9142Z"
        fill="white"
      />
      <path
        d="M77.9436 64.9142H89.3853C89.3853 41.7651 70.4164 23 47.0158 23C23.9046 23 5.07873 41.3057 4.65514 64.0583C4.21416 87.8583 24.0728 108 48.1282 108H53.8663C74.2626 108 98.5864 91.1666 100.8 71.2457C101.071 68.1385 77.9436 64.9142 77.9436 64.9142Z"
        fill="url(#paint0_linear_1064_606)"
      />
      <path
        d="M77.8635 64.9142H89.3052C89.3052 41.7651 70.3364 23 46.9357 23C23.8245 23 4.99863 41.3057 4.57504 64.0583C4.13406 87.8583 23.9927 108 48.0481 108H53.7862C74.1825 108 98.5063 91.1666 100.72 71.2457C100.99 68.1385 77.8635 64.9142 77.8635 64.9142Z"
        fill="url(#paint1_linear_1064_606)"
      />
      <path
        d="M53.8395 82.8219C55.7536 82.8219 57.3524 81.0961 57.3524 78.9731C57.3524 76.8501 55.7536 75.1243 53.8395 75.1243C51.9254 75.1243 50.3267 76.8501 50.3267 78.9731C50.3267 81.0961 51.9254 82.8219 53.8395 82.8219Z"
        fill="#4E44CE"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1064_606"
          x1="52.7233"
          y1="23"
          x2="52.7233"
          y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#534BB1" />
          <stop offset="1" stopColor="#551BF9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1064_606"
          x1="52.6432"
          y1="23"
          x2="52.6432"
          y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#534BB1" />
          <stop offset="1" stopColor="#551BF9" />
        </linearGradient>
      </defs>
    </svg>
  )
}
