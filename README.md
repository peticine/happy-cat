# peticine.

Feline CKD awareness, clinical age journey, and sign screening for pet parents.

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
