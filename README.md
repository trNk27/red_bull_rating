# Red Bull Ranker

A small static website for ranking Red Bull flavors from 1 to 10.

- **+ Add a Red Bull** opens a searchable catalogue of editions (classics, color editions, and summer, spring, winter and Japan-only editions, including the newest **Winter Edition 2026: Pistachio & Berries**). You can filter by group, or press Enter to add the first match.
- Click a number from 1 to 10 to score a can. Clicking the same number again clears the score.
- Add tasting notes, remove cans (with undo), and sort by score, name or date added.
- Click a can to replace the drawing with a real photo, either by image URL or by uploading one.
- Rankings are saved in your browser's localStorage. Use **Export** and **Import** to back them up or move them to another device.

No build step: open `index.html`, or serve the folder with `python3 -m http.server`.

## Real can photos

Every edition has a drawn can by default. To use a real photo for everyone, put the image in `images/` and add an `image` field to that edition in `editions.js`:

```js
{ id: "winter-2026-pistachio", ..., image: "images/winter-2026-pistachio.png" },
```

If the image fails to load, the page falls back to the drawn can.

## Adding new editions

Add a line to `editions.js`. Set `isNew: true` to show the "New" badge.

## Hosting on GitHub Pages

Live at https://trnk27.github.io/red_bull_rating/ once Pages is on: Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`.
