interface LogoProps {
  className?: string;
}

// Same mark as public/favicon.svg, but colored by the theme's accent token.
export const Logo = ({ className = 'w-10 h-10' }: LogoProps) => (
  <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="8" className="fill-accent" />
    <g
      fill="none"
      className="stroke-accent-fg"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 22l5.5-6 4 3.5L25 10" />
      <path d="M19.5 10H25v5.5" />
    </g>
  </svg>
);
