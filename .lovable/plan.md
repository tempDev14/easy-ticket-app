# Plan: Booking page tweaks

## 1. Move "Additional info" toggle to the gray footer text
- In `src/routes/book.tsx`, remove the blue `Additional info` button (Info icon + text + ChevronDown) that currently sits above the expanded panel.
- Keep the `moreOpen` state and the collapsible panel content (BUS TYPE, FARE AMOUNT, TICKET VALIDITY) exactly as-is.
- Make the existing gray footer row — "All bus tickets will be valid for 3 hours post booking" — clickable to toggle `moreOpen`.
- Remove the `Clock` icon from that footer row so only the gray text remains.
- Keep the text color gray (`#9CA3AF`) in both collapsed and expanded states; no color change on click.
- Use a `button` or `div` with `type="button"` and pointer cursor, preserving the current layout/centering.

## 2. Deduplicate Recent Orders
- When a new ticket is booked, before prepending to `recent`, remove any existing RecentOrder entry that has the same `from`, `to`, and `adults`.
- Then prepend the new order and keep the existing 5-item limit.
- Persist the deduped list to `localStorage` as before.
- This prevents the same route from appearing multiple times at the top of the Recent Orders list.
