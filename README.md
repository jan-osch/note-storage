# Note-Sotrage

## Instalacja
Po pobraniu źródeł z git należy w katalogu głównym aplikacji uruchomić polecenie:

```
npm install
```

## Uruchomienie
Gdy npm zakończy instalowanie dependencji należy w katalogu głównym aplikacji uruchomić polecenie:

```
npm run start
```

## Opis rozwiązań

### ES6, Babel, Gulp
Projekt jest napisany z użyciem ES6. Aby uruchomić go w najnowszej wersji
Node.js potrzebna jest kompilacja przez babel na ES5. W `gulpfile.babel.js` zdefiniowane są taski gulpa
które pozwalają na kompilacje, uruchomienie i tryb `watch`, czyli reload po zmianach.

### Note
Klasa która przechowuje **wpisy** o 3 polach: value, title, created_at.
W pole `created_at` w implementacji zostało zamienione na zgodne z camelCase `createdAt`.
Aby zapewnić zgodność z opisem zadania przeciążono serializację do JSON.

### NoteStorage
Klasa która służy jako kontener na instancje `Note`.
`NoteStorage` przechowuje obiekty w pamięci, aby ułatwić podmianę implementacji na np.bazę danych API
klasy zostało napisane w sposób asynchroniczny z callbackami.

### NoteGenerator
Klasa która służy do tworzenia losowych wpisów. Napełnia ona swoją instancję `NoteStorage`

## API

### Ostatnie wpisy
Aby zobaczyć 25 ostatnich wpisów należy wykonać request HTTP GET na adres:
```
http://localhost:3000/api/note/most_recent?count=25
```
Wyniki są posortowane malejąco po `created_at` i rosnąco po `title`.
Przez zmianę parametru `count` w query można uzyskać dowolną liczbę wyników.

### Najczęściej powtarzające tytuły z sumą value

Aby zobaczyć 25 najczęściej powtarzających title z odpowiadającymi im sumami wartości `value` należy
wykonać request HTTP GET na adres:

```
http://localhost:3000/api/title/most_frequent/sum_values?count=25
```
Przez zmianę parametru `count` w query można uzyskać dowolną liczbę wyników
(limituje nas rozmiar alfabetu języka angielskiego).

### Najczęściej powtarzające tytuły z ilością powtórzeń

Aby zobaczyć 25 najczęściej powtarzających title z odpowiadającymi im ilościami powtórzeń
należy wykonać request HTTP GET na adres:

```
http://localhost:3000/api/title/most_frequent/frequency?count=25
```
Przez zmianę parametru `count` w query można uzyskać dowolną liczbę wyników
(limituje nas rozmiar alfabetu języka angielskiego).




