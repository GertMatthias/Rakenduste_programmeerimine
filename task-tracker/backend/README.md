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
Praegu on olemas ainult tervisekontrolli marsruut; `/` vastab `404`-ga.
Kui näed viga `EADDRINUSE`, on port 3000 juba kasutusel: peata varasem
backend'i protsess selle terminalis, seejärel käivita uuesti.

`npm start` käivitab backend'i `package.json` failis määratud käsu `node src/server.js`.
Käivita see backend'i kaustas, et npm kasutaks õiget `package.json` faili.

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
