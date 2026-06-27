## Changes

**Ticket page (`src/routes/ticket.tsx`)**
- Replace avatar SVG with new uploaded `image-24.png` (upload via `lovable-assets`, overwrite `src/assets/avatar.svg.asset.json` → new `avatar.png.asset.json`).
- Enlarge `VerifiedBadge` next to ₹ amount from 22 → 28px so it matches the rupee text size.
- Add more vertical margin around the issued date line (top + bottom ~10–12px).
- Increase spacing between the inner white timer card and the Expected Arrivals card (marginBottom 16 → 24).
- Floating nav: swap the `Gift` lucide icon for the uploaded Cashback logo (image-28). Upload it via `lovable-assets`, render with a white CSS filter (`filter: brightness(0) invert(1)`) so the navy logo appears white on the dark pill.

**QR page (`src/routes/qr.tsx`)**
- Add top/bottom margin between header and the From → To row (currently 6px → ~16px top, 10px bottom).
- Add more vertical breathing room around "Scan this QR at Entry & Exit Points" (padding 10/4 → 14/12).
- Add a bit more top margin above the QR image block.

**Assets**
- Upload new avatar PNG → `src/assets/avatar.png.asset.json`, delete old `avatar.svg.asset.json`.
- Upload cashback logo → `src/assets/cashback.png.asset.json`.

No logic / business changes. Pure presentational spacing + asset swaps.
