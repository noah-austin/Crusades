# Crusades Atlas

An animated globe that tells the history of the Crusades chapter by chapter, from the Christian side
and grounded in the primary sources.

Modules:
- **The First Crusade** (1095–1099)
- **The Kingdom and the Second Crusade** (1100–1149)
- **The Third Crusade** (1174–1192, from the leper king to the Treaty of Jaffa)

It plays as a narrated film: press Begin and watch. A British narrator tells the story while
the camera flies across a portolan-style globe, armies march under their banners, borders shift,
and battles and key moments play out as animated manuscript plates. Music and sound effects are
synthesized live in the browser. Tap the screen for the few controls there are (pause, skip,
mute, subtitles, chapter list).

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
- `audio.js` — narration playback plus synthesized music, ambience and sound effects
- `data/narration.js` and `audio/` — the narration audio and its subtitle timings (generated)
- `tools/build-script.js`, `tools/voice.py` — turn the story text into narration (see below)
- `data/first-crusade.js`, `data/second-crusade.js`, `data/third-crusade.js` — one module per crusade
- `data/geography.js` — territory snapshots 1090–1192, rivers and mountain ranges (borders are approximate)
- `data/land.js` — coastlines from Natural Earth via world-atlas
- `docs/DATA.md` — the data format; read this to add a crusade

## Narration

The voice is generated offline with the open Kokoro TTS model (Apache-2.0), voice `bm_george`
for the narrator and `bm_fable` for quotes from the chroniclers.

```
node tools/build-script.js > script.json          # story text → speakable script
python tools/voice.py script.json kokoro-q8.onnx voices.bin out   # → out/audio/*.mp3, out/narration.js
```

After editing any story text, rebuild the script and rerun `voice.py` for the changed segments
(delete their mp3s or pass their ids), then copy `out/audio/` and `out/narration.js` into place.
