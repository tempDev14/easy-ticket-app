# Polish Active Ticket card + Login page tweaks

Four targeted fixes, verified against the two reference images (reference vs current build).

## 1. Yellow bottom bar on Active Ticket card (`src/routes/book.tsx`)

- Current: a 4px bar inside the card with `borderBottomLeftRadius/Right: 18` on the bar itself — on a 4px-tall strip that makes the whole bar pill-shaped, so it reads as a rounded floating pill that stops short of the card edges with white space at the corners.
- Reference: a thicker amber strip flush with the card's very bottom edge, spanning the full width edge-to-edge, with only the outer bottom corners rounded to match the card.
- Fix: position the bar absolutely at `bottom: -1px; left: -1px; right: -1px` (covering the card's bottom border), height ~6px, with bottom corner radius 18px only. Full-bleed, no side gaps, no pill shape.

## 2. Straight connector line between the route dots

- Current: the line uses `marginLeft: 7` with a 1.5px `borderLeft`, but the dot is 15px wide — its center is 7.5px while the line's center lands at ~7.75px, so the line is visibly off-axis and doesn't meet the dots cleanly.
- Fix: wrap both dots and the line in a fixed 15px-wide column and absolutely center the line inside it (`left: 50%; transform: translateX(-50%)`), running vertically between the two dots as one straight, unbroken 1.5px line in `#DCDFE3`. Dots themselves stay unchanged.

## 3. Clock icon before "Ticket will expire at"

- Current: lucide `Clock` outline icon in amber.
- Reference: a small solid filled clock — amber/orange filled face with white hands and a thin ring.
- Fix (my call): replace the lucide outline with a tiny inline SVG clock — filled `#F59E0B` circle, white hour/minute hands, subtle darker-amber ring so it reads as "filled" exactly like the reference. Same 15px size.

## 4. Login page (`src/routes/index.tsx`)

- Remove the "Username" label above the input.
- Placeholder becomes `Hridayam will always be ....`
- Login button text becomes `Go`.

No logic, routing, or ticket-state changes — presentation only.
