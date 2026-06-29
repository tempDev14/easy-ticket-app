export function BoyAvatar({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="avatarClip"><circle cx="32" cy="32" r="32" /></clipPath>
      </defs>
      <g clipPath="url(#avatarClip)">
        <rect width="64" height="64" fill="#EDEDED" />
        {/* shoulders / brown shirt */}
        <path d="M8 64c2-9 11-14 24-14s22 5 24 14v4H8v-4z" fill="#A8694A" />
        {/* neck */}
        <path d="M27 46h10v8H27z" fill="#E8B391" />
        {/* face */}
        <ellipse cx="32" cy="34" rx="13" ry="14" fill="#F2C19A" />
        {/* ears */}
        <ellipse cx="19" cy="36" rx="2.2" ry="3" fill="#E8B391" />
        <ellipse cx="45" cy="36" rx="2.2" ry="3" fill="#E8B391" />
        {/* hair main */}
        <path d="M19 30c0-9 6-16 13-16 8 0 14 6 14 14 0 3-0.5 5-1.5 7-2-5-5-7-10-8-2 4-6 6-12 6-2 0-3-1-3.5-3z" fill="#1F3B7A" />
        {/* hair front swoosh */}
        <path d="M22 24c3-5 8-8 13-7 4 1 7 4 8 8-3-2-7-3-11-2-3 1-6 2-10 1z" fill="#15296B" />
        {/* cheeks */}
        <circle cx="23.5" cy="40" r="2.4" fill="#F4A6A6" opacity="0.75" />
        <circle cx="40.5" cy="40" r="2.4" fill="#F4A6A6" opacity="0.75" />
        {/* eyes */}
        <ellipse cx="27" cy="36" rx="1.4" ry="2" fill="#1A1A1A" />
        <ellipse cx="37" cy="36" rx="1.4" ry="2" fill="#1A1A1A" />
        {/* smile */}
        <path d="M28 43c1.2 1.6 2.5 2.4 4 2.4s2.8-0.8 4-2.4" stroke="#6B3A1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function VerifiedBadge({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12.8" fill="#16B857" />
      <circle cx="11.5" cy="10.5" r="2.5" fill="#39D978" opacity="0.55" />
      <path d="M10.2 16.4l3.8 3.8 7.8-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}