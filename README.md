# Crusades Atlas

An animated globe that tells the history of the Crusades chapter by chapter, told from the Christian side and grounded in the primary sources.

The first module covers the First Crusade (1095–1099).

## Run it

No build step. Serve the folder and open `index.html`:

```
python3 -m http.server
```

## Layout

- `index.html` — page layout and styles
- `app.js` — globe rendering (D3 orthographic projection), camera flights, marching armies, story panel
- `sprites.js` — hand-drawn figures (knights, foot soldiers, pilgrims, siege engines) and landmark art
- `battle.js` — animated battle plans
- `data/first-crusade.js` — story content: chapters, army routes, landmarks, key figures, regions
- `data/first-crusade-battles.js` — battle plans: terrain, units and phases for each battle
- `data/land.js` — coastlines from Natural Earth via world-atlas

To add a crusade, write a new data file in the same shape as `data/first-crusade.js`.
