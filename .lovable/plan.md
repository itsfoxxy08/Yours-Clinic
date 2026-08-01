## Goal
Use the uploaded official "Yours Clinic" logo (butterfly + heart/hands mark with the Yours Clinic wordmark) as the clinic's logo across the site.

## Notes on the uploaded file
The upload is a 3D presentation mockup: the artwork sits on a dark rounded plaque with a drop shadow on white. Using it raw would show that grey card in the header. So it gets prepped first.

## Steps

1. **Prep the artwork**
   - Crop the plaque out and lift the logo art onto a transparent background (image edit pass), producing a clean transparent PNG of the full logo lockup.
   - Also produce a square icon-only crop (butterfly + heart-in-hands mark) for the favicon and the small circular header badge.

2. **Header** (`src/components/SiteHeader.tsx`)
   - Replace the current circular logo image with the new mark.
   - Since the new logo is a full-colour lockup that already contains the words "Yours Clinic", switch the header to show the horizontal lockup and drop the separate serif "Yours Clinic" text, keeping the gold hairline treatment around it so it still fits the emerald/gold editorial look.
   - Keep it height-capped (~40px) and crisp on both light and dark themes.

3. **Footer** (`src/components/SiteFooter.tsx`)
   - Use the same lockup in the footer brand block.

4. **Favicon** (`public/` + `src/routes/__root.tsx`)
   - Square 64x64 icon-only PNG at `public/favicon.png`, wired into the root route `head().links`, and remove the old `favicon.ico`.

5. **Memory update**
   - The stored rule says "never replace the original circular clinic logo" — update it to record that this uploaded official logo is now the canonical mark.

6. **Verify** — screenshot header/footer in light and dark mode to confirm the mark reads cleanly at small size.

## One thing to flag
The logo's rainbow orange/yellow/teal gradient is a different colour world from the site's emerald + gold palette. I'll keep the site palette as-is and let the logo sit as its own accent; if you'd rather I retune the palette toward the logo's colours, say so and I'll fold that in.
