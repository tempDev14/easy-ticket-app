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
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M16 2.8C17.2 2.8 17.8 4 18.8 4.4C19.9 4.8 21.2 4.3 22.2 4.9C23.2 5.5 23.4 6.9 24.2 7.7C25.1 8.5 26.5 8.6 27.1 9.6C27.7 10.6 27.2 11.9 27.6 13C28 14.1 29.2 14.8 29.2 16C29.2 17.2 28 17.9 27.6 19C27.2 20.1 27.7 21.4 27.1 22.4C26.5 23.4 25.1 23.5 24.2 24.3C23.4 25.1 23.2 26.5 22.2 27.1C21.2 27.7 19.9 27.2 18.8 27.6C17.8 28 17.2 29.2 16 29.2C14.8 29.2 14.2 28 13.2 27.6C12.1 27.2 10.8 27.7 9.8 27.1C8.8 26.5 8.6 25.1 7.8 24.3C6.9 23.5 5.5 23.4 4.9 22.4C4.3 21.4 4.8 20.1 4.4 19C4 17.9 2.8 17.2 2.8 16C2.8 14.8 4 14.1 4.4 13C4.8 11.9 4.3 10.6 4.9 9.6C5.5 8.6 6.9 8.5 7.8 7.7C8.6 6.9 8.8 5.5 9.8 4.9C10.8 4.3 12.1 4.8 13.2 4.4C14.2 4 14.8 2.8 16 2.8Z"
        fill="#03A203"
      />
      <path
        d="M10.6 16.3L14.2 20L21.5 12.6"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}