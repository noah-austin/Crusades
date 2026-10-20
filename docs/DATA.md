# Crusades Atlas data format

All content lives in plain JS files under `data/`. Each file assigns to a global and is loaded
by a `<script>` tag in `index.html`. No build step.

Coordinates are always `[longitude, latitude]` in decimal degrees.

The atlas is told from the Christian side, grounded in the primary sources (Fulcher of Chartres,
the Gesta Francorum, Raymond of Aguilers, Albert of Aachen, William of Tyre, Odo of Deuil,
the Itinerarium Peregrinorum, Ambroise, and so on). Hard parts (massacres, atrocities, defeats)
are stated plainly in a line or two, as the Christian chroniclers themselves recorded them.
Never invent quotes. A quote must be a real passage from a named source, close to a standard
English translation; mark trims with "(abridged)". When unsure, paraphrase in body text instead.

Writing style: plain, direct, short sentences. Active voice. No em-dash asides, no
"not X but Y" framing, no hype words. British/US spelling either is fine, but be consistent
within a file (existing files use "honour", "defence").

---

## 1. A crusade module

```js
window.CRUSADES = window.CRUSADES || [];
window.CRUSADES.push({
  id: "third",                       // unique, used in URLs
  order: 3,                          // sort order in the crusade picker
  name: "The Third Crusade",
  years: "1187–1192",
  blurb: "One sentence for the picker.",
  routes: { ... },                   // §2
  regions: [ ... ],                  // §3
  landmarks: [ ... ],                // §4
  figures: { ... },                  // §5
  chapters: [ ... ],                 // §6
  battles: { ... },                  // §7  (battle and moment scenes)
});
```

## 2. Routes (armies on the move)

```js
routes: {
  richard: {
    label: "Richard",                // shown at the head of the column
    color: "--r-richard",            // a CSS token name OR a hex like "#7d2a52"
    until: "third-jaffa",            // optional: stop drawing the marching column after this chapter id
    column: ["leader","knight","knight","foot","foot","archer","pilgrim"],  // optional figure order
    points: [[-1.25, 51.0], ...],    // ordered waypoints, 6–25 points; sea legs are fine
  },
}
```

A chapter advances routes with `routes: { richard: 7.5 }` = progress measured in **vertex index**
(7.5 = halfway between point 7 and point 8). Progress is cumulative across chapters.
Use hex colors for new routes; keep each army's color consistent across chapters and battles.

## 3. Regions (map text labels)

```js
{ name: "Kingdom of Jerusalem", at: [35.4, 32.4], from: "chapter-id", until: "chapter-id", state: true }
{ name: "Mediterranean Sea", at: [18.5, 35.2], sea: true }
```
`state: true` draws it in the accent color (crusader states). `from`/`until` are optional chapter ids.

## 4. Landmarks (drawn city art on the globe)

```js
{ name: "Acre", at: [35.07, 32.92], icon: "walled", major: true, today: "Akko, Israel" }
```
Icons: `walled`, `town`, `cathedral`, `basilica`, `hagia` (Constantinople only), `jerusalem`
(Jerusalem only), `antioch`, `castle`, `citadel`, `battle`, `goldendome`, `rotunda`, `port`.
`major: true` for at most ~5 per module. `today` = modern name and country, when different.

## 5. Figures (key people)

```js
figures: {
  richard: {
    name: "Richard I of England",
    role: "King of England, 1189–1199",
    life: "1157–1199",
    portrait: { kind: "king", color: "#a8301d", color2: "#d2a33a", beard: true, emblem: "lions" },
    bio: ["2–3 short paragraphs, each 1–3 sentences."],
  },
}
```
Portrait kinds: `knight`, `king`, `emperor` (Byzantine/German emperor), `pope`, `bishop`, `monk`,
`queen`, `sultan`, `hermit`, `templar`. Emblems: `cross` (default), `lions`, `lilies`, `eagle`,
`keys` (papal), `templar` (red cross on white), `hospitaller` (white cross on black), `none`.
`color` = main garment/banner color, `color2` = trim. The figure's banner on the map uses `color`.
Figure ids must be unique across ALL modules if they are different people. The same person in two
modules (e.g. Bernard of Clairvaux) can be defined in each with the same id.

## 6. Chapters (the story)

```js
{
  id: "third-acre",                  // unique across all modules; prefix with the module, e.g. "second-", "third-"
  date: "August 1189 – July 1191",   // human-readable
  year: 1189,                        // integer year for the timeline labels
  mapYear: 1191.5,                   // decimal year that picks the territory snapshot (defaults to `year`)
  title: "The siege of Acre",
  place: "Acre",                     // "City, Region" or a short phrase
  at: [35.07, 32.92],                // where the pulse marker sits
  view: { at: [35.0, 32.9], k: 9 },  // camera centre and zoom (1 = whole globe, 3 ≈ eastern Med, 6 ≈ Syria/Palestine, 10–12 = a city)
  routes: { richard: 14 },           // optional route progress at the END of this chapter
  days: { from: "1189-08-28", to: "1191-07-12", label: "of the siege" },  // optional animated day counter
  fight: true,                       // optional: crossed-swords mark on the map
  camp: "cru" | "foe",               // optional: ring of siege tents around `at`
  battle: "acre",                    // optional: id in `battles` → "Watch the battle" button
  moment: "acre-surrender",          // optional: id in `battles` → "See the moment" button (a non-battle scene)
  caption: "One or two sentences for cinema mode (max ~220 characters).",
  body: ["2–4 paragraphs, each 2–4 sentences."],
  quotes: [{ text: "...", source: "Author, Work", url: "https://..." }],   // url only if verified
  myth: { myth: "Common belief in one sentence.", fact: "What the sources show, 1–3 sentences." },  // optional, ~1 in 4 chapters
  today: "Akko, Israel. The crusader halls survive beneath the Ottoman town.",  // optional, one line
  sources: [{ title: "Itinerarium Peregrinorum, book 1", url: "https://..." }], // optional further reading, url only if verified
  figures: ["richard", "philip"],
}
```

Chapter count: 12–20 per module. First chapter sets the scene (prologue), last is an epilogue.

## 7. Scenes: battles and moments

Both use the same format. Scene space is **100 wide × 62 tall**, north at the top, origin top-left.

```js
battles: {
  acre: {
    id: "acre",
    title: "The siege of Acre",
    date: "July 1191",
    place: "Acre",
    terrain: [ ...terrain items... ],
    units: { ...units... },
    phases: [ ...4–7 phases... ],
  },
}
```

### Terrain items
```js
{ type: "hills", at: [x,y], w: 30, h: 8, label?, labelAt? }
{ type: "river", path: [[x,y],...], w: 2.2, label?, labelAt? }
{ type: "sea" | "lake", poly: [[x,y],...], label?, labelAt? }
{ type: "marsh", at: [x,y], r: 6, n: 14, label? }
{ type: "road", path: [[x,y],...] }
{ type: "walls", path: [[x,y],...], closed: true }     // towers at every vertex
{ type: "bridge", at: [x,y] }
{ type: "trees", at: [x,y], r: 7, n: 10, label? }
{ type: "tents", at: [x,y], n: 8, r: 9, color: "#hex", label?, labelAt? }
{ type: "landmark", kind: "<landmark icon>", at: [x,y], size: 6, label?, labelAt? }
{ type: "label", text: "...", at: [x,y], size? }
{ type: "floor", poly: [[x,y],...] }                     // paved interior floor (church, hall)
{ type: "columns", from: [x,y], to: [x,y], n: 6 }        // a row of arches/columns (church interior)
{ type: "dais", at: [x,y], w: 14, h: 4 }                 // raised platform (a pope preaching, a throne)
{ type: "desert", poly: [[x,y],...] }                    // dry ground with dune marks (e.g. Hattin)
```

### Units
```js
units: {
  ric: { label: "Richard", side: "cru", kind: "knight", rows: 2, cols: 4, color: "#a8301d",
         leader: true, at: [40, 30] },          // `at` = starting position, visible
  sal: { label: "Saladin", side: "foe", kind: "horsearcher", rows: 2, cols: 5, color: "#3f6b6b",
         leader: true, start: [104, 30] },      // `start` = starts hidden at this spot, appears when a phase moves it
}
```
`side`: `cru` (Christian/crusader side, includes Byzantines) or `foe`.
`kind` (or `mix: ["foot","archer"]` to alternate): `knight`, `foot`, `archer`, `crossbow`, `pilgrim`,
`horsearcher`, `saint`, `siegetower`, `ram`, `trebuchet`, `ship`, `pope`, `bishop`, `priest`,
`king` (crowned rider with banner), `crowd` (unarmed townspeople/pilgrims, mixed clothing),
`templar` (knight in white with red cross), `hospitaller` (knight in black with white cross).
Typical sizes: 1×1 to 3×6. Keep total figures under ~120 per scene.

### Phases
```js
phases: [
  {
    caption: "1–2 sentences of what happens in this moment.",
    set: { ric: { at: [60, 30], state: "fight", facing: 1 } },   // state: march (default) | hold | fight | flee | hidden
    fx: [
      { type: "arrows", from: "unitA", to: "unitB", rate: 9 },
      { type: "stones", from: "unitA", to: "unitB", rate: 4 },   // trebuchet/catapult shot
      { type: "clash", a: "unitA", b: "unitB" },
      { type: "fire", unit: "unitId", lift: 4, r: 3 } | { type: "fire", at: [x,y], r: 6 },
    ],
    dur: 6000,   // optional ms, default ~5200 + caption length
  },
]
```
`facing`: 1 = right, -1 = left. Units keep their last setting until a later phase changes it.
Flee units fade out while moving; send them off the edge (x < 0 or > 100).

## 8. Geography (`data/geography.js`)

```js
window.GEO = {
  powers: {
    byzantine: { name: "Byzantine Empire", color: "#7b4f8e" },
    ...
  },
  // Territory snapshots, sorted by year. The map shows the latest snapshot with year <= chapter.mapYear.
  territories: [
    { year: 1095, areas: [ { power: "byzantine", poly: [[lon,lat], ...] }, ... ] },
    ...
  ],
  rivers: [ { name: "Danube", path: [[lon,lat], ...] }, ... ],
  mountains: [ { name: "Taurus", path: [[lon,lat], ...] }, ... ],   // a ridge line; drawn as hachure peaks
};
```
Polygons are simplified (10–40 points each), drawn on land only (sea is masked by the coastline
being drawn on top), so they may spill into the sea to keep them simple.
