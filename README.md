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
- `app.js` — globe rendering (D3 orthographic projection), camera flights, route animation, story panel
- `data/first-crusade.js` — all story content: chapters, army routes, key figures, regions
- `data/land.js` — coastlines from Natural Earth via world-atlas

To add a crusade, write a new data file in the same shape as `data/first-crusade.js`.
