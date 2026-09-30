# Task Trackeri backend

## Eeldused

Arvutis peavad olema Node.js ja npm. Kontrolli käsuga `node --version` ja
`npm --version`.

## Paigaldamine ja käivitamine

Klooni kursuse repositoorium ning liigu selle juurkaustast backend'i kausta:

```bash
cd task-tracker/backend
npm ci
npm start
```

Server jääb tööle pordil 3000. Ava brauseris
`http://localhost:3000/api/health`: vastuse staatus on `200` ja JSON-sisu
`{"status":"ok"}`. Serveri peatamiseks vajuta terminalis `Ctrl+C`.

`localhost` tähendab sinu enda arvutit ja port eristab sellel töötavaid teenuseid.
Backend töötab frontend'i Vite'i arendusserverist eraldi protsessina.
Juuraadress `/` vastab `404`-ga; API marsruudid algavad `/api`-ga.
Kui näed viga `EADDRINUSE`, on port 3000 juba kasutusel: peata varasem
backend'i protsess selle terminalis, seejärel käivita uuesti.

`npm start` käivitab backend'i `package.json` failis määratud käsu `node src/server.js`.
Käivita see backend'i kaustas, et npm kasutaks õiget `package.json` faili.

## Ülesannete lugemine

Kõigi näidete serveriaadress on `http://localhost:3000`.

| Päring                           | Tulemus                             |
| -------------------------------- | ----------------------------------- |
| `GET /api/tasks`                 | `200`, kõik ülesanded               |
| `GET /api/tasks/2`               | `200`, ülesanne ID-ga 2             |
| `GET /api/tasks?completed=true`  | `200`, tehtud ülesanded             |
| `GET /api/tasks?completed=false` | `200`, tegemata ülesanded           |
| `GET /api/tasks/999`             | `404`, `{"error":"Task not found"}` |
| `GET /api/tasks?completed=yes`   | `400`, vigane filtriväärtus         |
| `GET /api/tasks/abc`             | `400`, vigane ID                    |

`req.params.id` tuleb URL-i teest, `req.query.completed` päringuparameetrist.
ID teisendatakse arvuks. Filtri puhul lubatakse ainult tekste `true` ja `false`:
`Boolean('false')` oleks ekslikult `true`, sest tegemist on mittetühja tekstiga.
Filtreerimine ei muuda algandmeid.

Pärast backend'i koodi muutmist peata server `Ctrl+C` abil ja käivita uuesti
`npm start`, et uus kood kasutusele võetaks.

## Ülesande loomine

`POST /api/tasks` võtab vastu JSON-keha `{"title":"Learn Express"}`.
Saada päis `Content-Type: application/json`, et `express.json()` loeks keha.
Server eemaldab pealkirja ääretühikud, määrab unikaalse täisarvulise ID ja
`completed: false` ning tagastab loodud ülesande staatusega `201`.
Puuduv, mitte-tekstiline, tühi või ainult tühikutest koosnev pealkiri annab `400`.
Kliendi saadetud `id` ja `completed` ei määra uue ülesande väärtusi.

Näide PowerShellis (server peab eraldi terminalis töötama):

```powershell
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/tasks' -ContentType 'application/json' -Body '{"title":"  Learn Express  "}'
```

Seejärel ava brauseris `http://localhost:3000/api/tasks`, et näha uut ülesannet.
Brauseri aadressiriba teeb GET-päringu, mitte POST-päringut.
Andmed salvestatakse backend'i `data/tasks.json` faili.
Reacti vorm kasutab nüüd seda API-t.

## Reacti ühendamine backend'iga

Käivita backend'i kaustas `npm start` ja teises terminalis `task-tracker`
kaustas `npm run dev`. Ava Vite'i leht pordil 5173. Mõlemad protsessid
peavad töötama korraga.

Frontend'i `.env.development` määrab `VITE_API_URL=http://localhost:3000/api`.
Kohaliku ülekirjutuse saab panna `.env.local` faili, mis on Gitist välja jäetud.
`.env.example` sisaldab konfiguratsiooni näidet. Pärast muutmist taaskäivita Vite.
Kõik ülesannete päringud lähevad läbi `src/services/taskApi.js`.
Laadimine kasutab GET-i, lisamine POST-i, staatuse muutmine PATCH-i ja
kustutamine DELETE-i. React kasutab serveri tagastatud ülesannet ja ID-d.
Vea korral kuvatakse teade ja ebaõnnestunud lisamine ei tühjenda sisestust.

Backend'i `cors` seadistus lubab brauseril vastuseid lugeda origin'idelt
`http://localhost:5173` ja `http://127.0.0.1:5173`. Origin koosneb
protokollist, hostist ja pordist; URL-i alamrada sinna ei kuulu.
Kui kasutad muud frontend'i porti või avalikku aadressi, muuda `app.js`
CORS-i lubatud origin'ide loendit ja taaskäivita backend.
CORS ei ole autentimine ega takista terminalist päringute tegemist.

Ülesanded jäävad alles nii lehe värskendamisel kui ka backend'i taaskäivitamisel.

### GitHub Pages

Avaldatud frontend vajab internetis töötavat HTTPS-backend'i. Külastaja
`localhost` tähendab külastaja enda arvutit, mitte arendaja serverit.
GitHub Pages ei käivita Expressi. Seadista enne tootmise build'i
`VITE_API_URL` avaliku backend'i aadressiks (koos `/api` rajaga) ja luba
backend'i CORS-is GitHub Pagesi origin. Keskkonnamuutuja muutmise järel tuleb
frontend uuesti ehitada ja avaldada, sest Vite lisab väärtuse ehitatud koodi.
Praegu pole avalikku backend'i seadistatud: uus tootmisversioon kuvab puuduva
API-aadressi teate. Varasemat JSON-faili enam varuallikana ei kasutata.
VITE-muutujad on brauseris nähtavad ja neisse ei panda saladusi.

## Ülesande muutmine ja kustutamine

`PATCH /api/tasks/:id` muudab pealkirja ja/või staatust ning tagastab uuendatud
ülesande staatusega `200`. Saatmata väljad jäävad samaks.
Pealkiri peab olema mittetühi tekst ja selle ääretühikud eemaldatakse.
`completed` peab olema tõeväärtus `true` või `false`, mitte tekst.
Tühi muudatusobjekt, muud väljad (näiteks `id`) ja vigased väärtused annavad `400`.
Kõik väljad kontrollitakse enne ülesande muutmist.

```powershell
Invoke-RestMethod -Method Patch -Uri 'http://localhost:3000/api/tasks/2' -ContentType 'application/json' -Body '{"title":"  Learn Express routes  ","completed":true}'
```

`DELETE /api/tasks/:id` eemaldab ülesande ja tagastab `204` ilma vastusekehata.
Seda vastust ei tohi proovida JSON-ina lugeda.

```powershell
Invoke-WebRequest -UseBasicParsing -Method Delete -Uri 'http://localhost:3000/api/tasks/2' | Select-Object StatusCode
```

Mõlema marsruudi puhul annab puuduv ülesanne `404` ja vigane ID `400`.
Pärast kustutamist ei sisalda `GET /api/tasks` enam seda ülesannet ning
`GET /api/tasks/2` annab `404`. Kustutamine säilib ka taaskäivitamisel.

## Middleware ja veakäsitlus

Päringu töötlemise järjekord `app.js` failis:

1. Logija registreerib vastuse lõppemise kuulaja ja kutsub `next()`.
2. `express.json()` loeb JSON-keha.
3. Marsruudid töötlevad päringut.
4. Kui marsruuti ei leita, saadetakse `404` ja `{"error":"Route not found"}`.
5. Nelja parameetriga `errorHandler(error, req, res, next)` käsitleb vigu.

Terminali ilmub näiteks `GET /api/tasks 200`. `next()` jätkab järgmise
middleware'iga; `next(error)` suunab päringu veakäsitlusse.
Valideerimisvead ja vigane JSON annavad `400`, liiga suur keha `413`.
Ootamatu serveriviga annab `500` ja `{"error":"Internal server error"}`.
Vea tehnilised detailid logitakse serveris, mitte ei saadeta kliendile.

Proovi brauseris `http://localhost:3000/api/olematu`, et näha käsitletud
404-viga. Vigast JSON-i saab saata PowerShellist:

```powershell
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/tasks' -ContentType 'application/json' -Body '{'
```

PowerShell teatab HTTP-veast, sest vastuse staatus on `400`.

## API testid

Backend'i kaustas käivita `npm test`. Jälgimisrežiimi jaoks kasuta
`npm run test:watch`. Serverit pole vaja enne käivitada.

Vitest käivitab `src/app.test.js` viis testi; Supertest saadab päringud otse
Expressi rakendusele ja haldab vajalikku ajutist kuulamist ise. Kontrollitakse
GET-i, edukat POST-i, tühja pealkirja tagasilükkamist, puuduvat ülesannet ning
DELETE-i. Testid kontrollivad nii staatusekoode kui ka vastuste sisu.

`beforeEach` loob unikaalse ajutise kausta, kirjutab sinna testi algandmed ja
loob uue rakenduse koos eraldi ID-loenduriga. `afterEach` kustutab ajutise kausta
ka ebaõnnestunud kontrolli korral. Testid ei kasuta töötava serveri andmeid ega
sõltu üksteise järjekorrast. `app.listen()` jääb eraldi `server.js` faili.
Backend'i Vitest kasutab Node.js-i keskkonda; frontend'i testid kasutavad jsdom-i.

## JSON-faili salvestamine

`src/taskStorage.js` ekspordib `loadTasks(filePath)` ja `saveTasks(filePath, tasks)`.
`node:fs/promises` pakub asünkroonset failide lugemist ja kirjutamist.
`JSON.stringify` teisendab massiivi tekstiks, `JSON.parse` teksti tagasi väärtuseks.
Puuduv fail annab praegu tühja loendi; vigane JSON või vale juurtüüp peatab
käivitamise. Lugemine ei kirjuta faili.

`server.js` laadib enne kuulamise alustamist `./data/tasks.json` ja annab
`createApp`-ile salvestusfunktsiooni. POST, PATCH ja DELETE ootavad salvestamise
lõpuni enne eduka vastuse saatmist ja mälus oleva loendi asendamist.
`serialize` paneb muutmispäringud ühte järjekorda; kirjutamine kasutab ajutist
faili ning nimetab selle alles pärast edukat kirjutamist sihtfailiks.
See lahendus eeldab üht backend'i protsessi ühe andmefaili kohta.

Andmekaust on Gitist välja jäetud. Uues kloonis alustab backend puuduva faili
korral tühja loendiga; esimene lisamine loob faili. Taaskäivitamisel laaditakse
salvestatud ülesanded. Suuremas rakenduses on sobivam andmebaas, mis toetab
tehinguid, tõhusat otsingut ja mitut samaaegset serveriprotsessi.

Kontroll: loo Reactis ülesanne, taaskäivita backend (`Ctrl+C`, `npm start`)
ja värskenda Reacti lehte. Ülesanne peab alles olema.

## Moodulid

- `src/app.js`: loob ja ekspordib Expressi rakenduse ning määrab marsruudid.
- `src/server.js`: impordib rakenduse ja käivitab pordi kuulamise.
- `src/data/tasks.js`: ekspordib näidisandmed.
- `src/taskFunctions.js`: ekspordib funktsioonid `getAllTasks(tasks)`,
  `getTaskById(tasks, id)` ja `getCompletedTasks(tasks)`.
- `index.js`: impordib andmed ja funktsioonid ning kuvab tulemused.

Varasemat moodulite näidet saab endiselt käivitada käsuga `node index.js`.
Rakenduse importimine üksi serverit ei käivita: see võimaldab seda hiljem
testides kasutada ilma serverit käsitsi käivitamata.

`"type": "module"` lubab Node.js-is `.js` failides kasutada `import` ja `export`
süntaksit. Suhtelistes importides kasutame `.js` faililaiendit.

Funktsioonid tagastavad väärtuse ega muuda etteantud andmeid. Puuduv ID annab
`undefined`; tühja massiivi puhul tagastavad loendifunktsioonid `[]`.
`getAllTasks` teeb massiivist pindmise koopia: ülesannete objektid on endiselt
jagatud algse massiiviga.

## Paketid ja failid

- `package.json`: projekti andmed, npm-käsud ja sõltuvuste kirjeldused.
- `package-lock.json`: sõltuvuste täpsed versioonid; kuulub Giti ajalukku.
- `node_modules`: paigaldatud paketid; ei kuulu Giti ajalukku. Ülemkausta
  `.gitignore` välistab selle ka backend'is.
- `dependencies`: rakenduse tööks vajalikud paketid, näiteks Express.
- `devDependencies`: arendamise ja testimise tööriistad.

`npm install` paigaldab sõltuvused ja vajadusel uuendab lukufaili. Uue paketi
lisamiseks kasuta `npm install paketi-nimi`, arendussõltuvuse jaoks lisa
`--save-dev`.

`npm ci` paigaldab sõltuvused lukufaili järgi ning ei muuda seda.
See nõuab olemasolevat, `package.json` failiga kooskõlas olevat lukufaili
ja eemaldab enne paigaldust olemasoleva `node_modules` kausta.
