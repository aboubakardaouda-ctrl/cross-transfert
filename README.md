# Plateforme RSVP — Conférence Annuelle des Traducteurs Chinois
## 中文译者年会

Plateforme RSVP mobile-first, haut de gamme, inspirée de la culture chinoise, pour la gestion des confirmations, du suivi des paiements et de l'envoi d'invitations PDF nominatives.

---

## Stack technique

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** strict
- **Tailwind CSS** avec palette personnalisée
- **Prisma 7** + **SQLite** (via libsql adapter)
- **Resend** pour les e-mails
- **@react-pdf/renderer** pour la génération des PDF

---

## Installation

```bash
# Cloner le dépôt
git clone <url-du-depot>
cd cross-transfert

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Initialiser la base de données
npx prisma migrate dev

# Lancer en développement
npm run dev
```

---

## Variables d'environnement

Voir `.env.example` pour la liste complète. Variables essentielles :

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chemin SQLite (`file:./prisma/dev.db`) |
| `NEXTAUTH_SECRET` | Secret de session admin (chaîne aléatoire longue) |
| `ADMIN_USERNAME` | Identifiant administrateur |
| `ADMIN_PASSWORD` | Mot de passe administrateur |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'e-mails |
| `FROM_EMAIL` | Adresse d'expédition des e-mails |
| `ADMIN_EMAIL` | E-mail de l'administrateur (notifications) |
| `SITE_URL` | URL publique du site |

---

## Routes

| Route | Description |
|---|---|
| `/` | Page RSVP publique |
| `/rsvp` | Suivi de statut (invité) |
| `/admin/login` | Connexion administrateur |
| `/admin/dashboard` | Tableau de bord |
| `/admin/participants/[id]` | Fiche participant + paiements |

### API

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/rsvp` | POST | Soumettre un RSVP |
| `/api/rsvp?email=...` | GET | Consulter un statut |
| `/api/admin/participants` | GET | Liste des participants (admin) |
| `/api/admin/participants/[id]` | GET | Fiche complète (admin) |
| `/api/admin/payments` | POST | Ajouter un versement (admin) |
| `/api/admin/send-invitation` | POST | Envoyer l'invitation PDF (admin) |
| `/api/admin/auth` | POST/DELETE | Login / Logout |

---

## Workflow

```
Invité remplit RSVP
       ↓
Admin notifié par e-mail
       ↓
Admin enregistre les versements manuellement
       ↓
Système cumule jusqu'à 25 000 FCFA
       ↓
Statut passe automatiquement à "validé"
       ↓
Admin clique "Envoyer l'invitation"
       ↓
PDF nominatif généré + envoyé par e-mail à l'invité
```

---

## Design

- Palette : Rouge impérial `#8B1A1A` · Or `#C9A96E` · Ivoire `#FDFCF8`
- Typographies : Playfair Display + Cormorant Garamond
- Mobile-first, pensé pour smartphone (Chrome mobile, Safari iPhone, Android)
- Multilingue : Français · English · 中文 (détection automatique)

---

## Production

```bash
npm run build
npm start
```

Pour un déploiement sur serveur VPS, utiliser **PM2** + **Nginx** en reverse proxy.  
Pour Vercel, remplacer SQLite par **Turso** (libsql hébergé) et mettre à jour `DATABASE_URL`.
