# Déploiement 2-0 Platform

## Pré-requis
- un host Dockerisé avec accès réseau public ou un provider de conteneurs
- une base PostgreSQL et Redis disponibles
- une valeur `SECRET_KEY` forte pour le backend
- un preset public Cloudinary nommé `2-0-uploads` et un cloud name `poq53np4`

## Initialiser le backend (sous-module)

Après clonage du dépôt, initialiser/récupérer le backend avant tout build :

```bash
git submodule update --init --recursive
```

Puis vérifier que `2-0-backend/` contient bien le code de l'API.

## Option de déploiement la plus économique

### Frontend statique
- Netlify ou Vercel free tier pour servir le build Vite sur un domaine public.
- Le backend est branché via `VITE_API_URL` injecté au build.

### Backend API
- Render free tier pour l'API FastAPI avec Docker.
- PostgreSQL : Render Postgres free tier ou autre provider gratuit.
- Redis : provider gratuit compatible si disponible, sinon externaliser en mémoire volatile ou via un tiers de test.

## Variables d’environnement

Backend:
- `DATABASE_URL`
- `REDIS_URL`
- `SECRET_KEY`
- `ALLOWED_ORIGINS` (liste JSON ou CSV compatible avec Pydantic)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_UPLOAD_PRESET`
- `CLOUDINARY_API_KEY` (optionnel si le preset unsigned est utilisé)
- `CLOUDINARY_API_SECRET` (optionnel si le preset unsigned est utilisé)

Frontend:
- `VITE_API_URL`

## Déploiement local proof

```bash
git submodule update --init --recursive
cd 2-0-backend
docker compose up -d db redis
pytest -q
cd ../frontend_v3
npm run build
```

## Déploiement conteneurisé

```bash
cd /home/thedjampi/Bureau/Gestion\ 2-0
git submodule update --init --recursive
export VITE_API_URL=https://api.example.com/api/v1
export SECRET_KEY=replace-with-a-long-random-secret
export ALLOWED_ORIGINS='["https://your-frontend-domain.com"]'
export CLOUDINARY_CLOUD_NAME=poq53np4
export CLOUDINARY_UPLOAD_PRESET=2-0-uploads
docker compose -f docker-compose.prod.yml up -d --build
```

## Déploiement public conseillé

- Frontend statique : Netlify / Vercel
- Backend API : Render
- Base de données : Render Postgres free tier ou Neon free tier
- Médias : Cloudinary `poq53np4` avec preset public `2-0-uploads`

## Vérification rapide
- backend health : `GET /health`
- docs OpenAPI : `GET /docs`
- frontend static host : rendu sur le port 80
