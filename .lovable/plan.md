## Changes

### 1. New transparent verified badge
- Replace `VerifiedBadge` in `src/components/Avatar.tsx` with the new scalloped SVG path the user provided (single green path, fill `rgb(3,162,3)`, viewBox `0 0 1024 1024`, transparent background — no white circle behind it so it blends on any bg).
- Keep size prop; default size unchanged so it still matches ₹ glyph on the ticket page.

### 2. Active ticket access from booking page
- In `src/routes/book.tsx`: read `ticket` from `useTicket()`. If a non-expired ticket exists, render an "Active Ticket" card at the top of the form area (above the form card) showing:
  - From → To
  - Remaining time (live, using `secondsLeft` + `formatTimer`)
  - A "View Ticket" button → `nav({ to: "/ticket" })`
- Card styling matches existing white rounded card aesthetic (border-radius 16, subtle shadow, teal accent for the button).
- If ticket is expired or absent, card is not rendered.
- No changes to ticket creation, QR page, or timer logic.

### Files touched
- `src/components/Avatar.tsx` — swap VerifiedBadge SVG.
- `src/routes/book.tsx` — add active-ticket card + navigation.
