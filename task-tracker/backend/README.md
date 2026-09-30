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

Programm prindib terminali tervituse ja kolm ülesannet ning lõpetab töö.
Praegu ei käivitata veebiserverit. Backend'il ei ole veel väliseid sõltuvusi.

`npm start` käivitab backend'i `package.json` failis määratud käsu `node index.js`.
Käivita see backend'i kaustas, et npm kasutaks õiget `package.json` faili.

## Paketid ja failid

- `package.json`: projekti andmed, npm-käsud ja sõltuvuste kirjeldused.
- `package-lock.json`: sõltuvuste täpsed versioonid; kuulub Giti ajalukku.
- `node_modules`: paigaldatud paketid; ei kuulu Giti ajalukku. Ülemkausta
  `.gitignore` välistab selle ka backend'is.
- `dependencies`: rakenduse tööks vajalikud paketid, näiteks tulevikus Express.
- `devDependencies`: arendamise ja testimise tööriistad.

`npm install` paigaldab sõltuvused ja vajadusel uuendab lukufaili. Uue paketi
lisamiseks kasuta `npm install paketi-nimi`, arendussõltuvuse jaoks lisa
`--save-dev`.

`npm ci` paigaldab sõltuvused lukufaili järgi ning ei muuda seda.
See nõuab olemasolevat, `package.json` failiga kooskõlas olevat lukufaili
ja eemaldab enne paigaldust olemasoleva `node_modules` kausta.
