export function PlayGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4.6c0-.86.95-1.38 1.68-.9l12.3 7.4c.68.41.68 1.4 0 1.8l-12.3 7.4c-.73.48-1.68-.04-1.68-.9V4.6Z" fill="currentColor" />
    </svg>
  );
}

export function StopGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" />
    </svg>
  );
}

export function SpinnerGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="spin-icon">
      <path d="M21 12a9 9 0 1 1-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function WindowsGlyph() {
  return (
    <svg className="hero-platform-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Windows">
      <path d="M3 5.5 10 4.4V11.4H3V5.5ZM11 4.3 21 3V11.3H11V4.3ZM3 12.4H10V19.5L3 18.4V12.4ZM11 12.4H21V20.9L11 19.6V12.4Z" fill="currentColor" />
    </svg>
  );
}
