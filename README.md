# Personal Medical Record (Remix + NestJS + MongoDB)

Monorepo implementation of the Personal Medical Record app.

## Stack
- Frontend: React + Remix (`apps/web`)
- Backend: NestJS + Mongoose (`apps/api`)
- Database: MongoDB

## Features implemented
- Doctor visit listing and API create/list endpoints.
- Lab visit listing and API create/list endpoints.
- Catalog APIs and frontend views for medicines and lab tests.
- AVMS-inspired basic shell layout with sidebar and content area.

## Run
```bash
npm install
npm run dev
```

- API: `http://localhost:4000`
- Web: `http://localhost:3000`
