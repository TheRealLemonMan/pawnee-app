export function Sello({ className = "sello" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="40" cy="40" r="31.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 58.5v-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M40 46 27 56h26L40 46z" fill="currentColor" />
      <path d="M40 36 25.5 49h29L40 36z" fill="currentColor" />
      <path d="M40 26 28 40h24L40 26z" fill="currentColor" />
      <circle cx="40" cy="22" r="1.7" fill="currentColor" />
    </svg>
  );
}
