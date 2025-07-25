# cross-transfert

Demo MVP for a cross transfer service using Firebase backend, Flutter app and React admin panel.

## Prerequisites
- Node.js 18+
- npm
- Firebase CLI
- Flutter 3.22+

## Setup
```bash
npm install # install root deps
cd functions && npm install # install functions deps
cd ..
cd admin && npm install # admin web deps
```

For Flutter app:
```bash
cd flutter_app
flutter pub get
```

## Running emulators
```bash
npm run dev:emu
```

The Flutter app can run against the web platform with:
```bash
flutter run -d chrome
```
