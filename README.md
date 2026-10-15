# APOGEE

A browser spaceflight simulator foundation. TypeScript, Vite, PixiJS 8, accessible DOM HUD. No backend or credentials required.

```sh
npm ci --cache /tmp/apogee-npm
npm run dev
npm run build
npm test
```

Begin a new flight, ignite with Space, adjust throttle with W/S and pitch with A/D (arrow keys also work). Touch controls are available. Escape pauses; save and resume via mission control. Saves are local to the browser. This phase models a single-stage vertical flight with fuel, gravity, approximate atmospheric drag and landing classification; it is not yet an orbital mechanics model or vehicle editor.

## System boundaries

- `core/`: configuration and bounded 60 Hz fixed-step loop; rendering uses browser frames.
- `game/`: serializable flight state and explicit menu / flight / paused transitions.
- `simulation/`: pure simulation updates in SI units. Add forces here, never in rendering.
- `rendering/`: Pixi scene composition, procedural planet, stars and vehicle. Consumes state only.
- `input/`: keyboard action mapping; DOM controls feed the same state boundary.
- `ui/`: responsive shell, menus, HUD and design tokens. Center stays clear in flight.
- `builder/`: typed vehicle definition; future parts and assembly logic plug in here.
- `celestial/`: body data; `map/`: trajectory estimates, future orbit projections.
- `persistence/`: versioned, validated browser saves. Add schema migrations before changing save formats.
- `assets/`: stable alias manifest and awaited Pixi loading. Put shipped files in `public/assets/`.
- `audio/`: user-activated audio service; `utils/`: shared pure helpers.

Startup awaits assets and renderer initialization and offers recovery on failure. Hidden tabs pause flight, frame catch-up is bounded, and storage failure stays nonfatal. Tests cover ascent, impact, fuel, pitch and corrupt saves. Add systems as pure updates called from the fixed-step loop; keep renderer objects out of saves. Expand the scene union and SceneManager for new screens. The current empty manifest is intentional: all visuals are generated locally. Fonts are bundled locally; startup needs no external asset hosts. Browser smoke tests: `npm run test:e2e` (installed Chromium by default; override with `CHROMIUM_PATH`).
