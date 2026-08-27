# Fix Active Ticket card + "Scan at bus stop" icon

First step: revert the last change (thin inset yellow rule + shrunken scan icon). It made both spots worse.

## What is wrong right now

**1. Yellow bottom bar (image 1 vs reference image 3)**

- Current: a thin 3px yellow pill floating inside the card with white padding on the left, right, and below it, so it reads as a stray underline instead of part of the ticket.
- Reference: the yellow rule sits flush at the very bottom edge of the card, spanning the full width and following the card's bottom rounded corners, with no white strip under it.

**2. Notches are invisible**

- The perforation notches use a light grey fill (`#F5F5F5`) but the page background is white, so on the real screen the ticket has no side cut-outs at all. The reference clearly shows a bite taken out of both edges on the divider line.

**3. QR block proportion**

- Current QR reads oversized next to the route text and "Tap to View" drifts down to the second row. In the reference the QR is smaller, sits aligned with the top of the route block, and "Tap to View" sits directly centred beneath it.

**4. "Scan at bus stop" icon (image 2 vs reference image 4)**

- Current: shrunk to 17px with a heavy 10px stroke, so the four modules bleed into a solid blue blob with no visible inner shape.
- Reference: four clearly separated rounded squares — three with a dot inside, the fourth corner made of broken corner ticks — thin stroke, soft teal, roughly 22px, with the label sitting a little lower and slightly wider.  
- and the Icon and the scan ant the bus stop have  som espacing issue loos at thr efece image it fits perfctly ane look at ours it look way off

## The fix

`src/routes/book.tsx` only, presentation values:

- Yellow bar back to a full-bleed 4px strip at the card bottom with `borderBottomLeftRadius`/`borderBottomRightRadius` matching the card (18px), no side padding.
- Notch circles filled with the page background white plus the card border colour, so the cut-outs actually show; keep them centred on the divider row.
- QR thumbnail reduced slightly and its "Tap to View" label centred under it, both top-aligned with the route block.
- `ScanQrIcon` restored to ~22px with a thin (7px on the 128 viewBox) stroke in soft teal so the four modules stay separated; label back to 9.5px in the lighter blue with a touch more spacing under it.

No logic, routing, or ticket-state changes.