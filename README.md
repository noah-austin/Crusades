# Crusades Atlas

An animated globe that tells the history of the Crusades chapter by chapter, from the Christian side
and grounded in the primary sources.

Modules:
- **The First Crusade** (1095–1099)
- **The Kingdom and the Second Crusade** (1100–1149)
- **The Third Crusade** (1174–1192, from the leper king to the Treaty of Jaffa)

What you can do:
- Follow each army as a marching column of tapestry-style figures, with borders that change as
  the story moves, rivers, mountain ranges and drawn landmarks.
- Watch animated battle plans (Dorylaeum, Antioch, Jerusalem, Hattin, Acre, Arsuf, Jaffa and more)
  and illustrated moments (Urban II at Clermont, the Holy Lance, Bernard at Vézelay).
- Turn on **Cinema** for a hands-free documentary: captions over the map, scenes play by themselves.
- Tap a key figure for their portrait and story. Myth cards, modern place names and source links
  sit with each chapter.

## Run it

No build step. Serve the folder and open `index.html`:

```
python3 -m http.server
```

## Layout

- `index.html` — page layout and styles
- `app.js` — globe (D3 orthographic projection), camera flights, marching armies, territories, story panel, cinema mode
- `sprites.js` — hand-drawn figures, siege engines, ships, landmarks and portraits
- `battle.js` — animated battle and moment scenes
- `data/first-crusade.js`, `data/second-crusade.js`, `data/third-crusade.js` — one module per crusade
- `data/geography.js` — territory snapshots 1090–1192, rivers and mountain ranges (borders are approximate)
- `data/land.js` — coastlines from Natural Earth via world-atlas
- `docs/DATA.md` — the data format; read this to add a crusade
