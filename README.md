# peticine.

Feline CKD awareness, clinical age journey, and sign screening for pet parents.

## Static assets

| Folder | What goes here | Used in prod as |
|--------|----------------|-----------------|
| `images/` | Logos, stage art, any PNG/JPG/SVG | `https://your-site/images/filename.png` |
| `assets/` | Vite build output only (`age-journey.js`, `age-journey.css`) | Do not put hand-made images here |

After adding or replacing files in `images/`, commit and push to `peticine/happy-cat`. Vercel serves the repo root, so paths like `./images/healthy-cat-logo.png` work in production.

`npm run build:age` clears `assets/` before rebuilding — it will not touch `images/`.

## Run locally

```bash
npm install
npm run build:age
python3 -m http.server 8765
```

Open `http://localhost:8765`.

After editing the React age journey (`src/age-journey/`), rebuild:

```bash
npm run build:age
```

## Age journey (Framer Motion)

Five-step flow on first visit:

1. **How old is your cat?** — name + age
2. **Age reveal** — “Lina is 11 years old” → human equivalent → conditions at this age
3. **Risk screen** — symptom checkboxes
4. **Results** — kidney sign assessment, recommended tests, book consultation
5. **Consultation** — vet review → enter site

Reset:

```js
localStorage.removeItem('peticine-cat-age');
localStorage.removeItem('peticine-cat-name');
localStorage.removeItem('peticine-cat-profile');
sessionStorage.removeItem('peticine-age-done');
```
