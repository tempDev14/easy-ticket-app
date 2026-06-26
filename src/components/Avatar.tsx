export function BoyAvatar({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#E3F2FD" />
      {/* face */}
      <path d="M20 36c0-7 5.5-12 12-12s12 5 12 12v4c0 6-5 11-12 11s-12-5-12-11v-4z" fill="#FFD8B5" />
      {/* hair */}
      <path d="M18 30c0-9 7-16 14-16s14 6 14 15c0 2-1 4-2 5-2-5-6-8-12-8s-10 3-12 8c-1-1-2-2-2-4z" fill="#1F4FB6" />
      <path d="M19 28c2-4 7-7 13-7s11 3 13 7c-3-2-7-3-13-3s-10 1-13 3z" fill="#163E94" />
      {/* eyes */}
      <ellipse cx="27" cy="37" rx="1.6" ry="2.2" fill="#1A1A1A" />
      <ellipse cx="37" cy="37" rx="1.6" ry="2.2" fill="#1A1A1A" />
      {/* smile */}
      <path d="M27 44c1.5 2 3 3 5 3s3.5-1 5-3" stroke="#7A4A2E" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* neck/shoulders peek */}
      <path d="M16 60c2-5 8-8 16-8s14 3 16 8v4H16v-4z" fill="#1F4FB6" />
    </svg>
  );
}

export function VerifiedBadge({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 2l2.6 2.4 3.5-.6 1.4 3.3 3.3 1.4-.6 3.5L28.6 14.6 27 17.2l1 3.4-3 1.9-.9 3.4-3.5.2-2.1 2.8L16 27.4l-2.5 1.5-2.1-2.8-3.5-.2-.9-3.4-3-1.9 1-3.4-1.6-2.6 2.4-2.6-.6-3.5 3.3-1.4L9.9 3.8l3.5.6L16 2z"
        fill="#4CAF50"
      />
      <path d="M10.5 16.5l3.8 3.8 7.5-7.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}