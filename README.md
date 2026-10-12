# TaskFlow MERN

## Requirements
- Node.js 18 or newer
- MongoDB running locally or a MongoDB Atlas connection string

## Backend setup
1. Open a terminal in `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` to your own values.
4. Run `npm run dev`.
5. Health check: `http://localhost:5000/api/v1/health`.

## Frontend setup
1. Open another terminal in `fronted` (folder name retained from the provided project).
2. Run `npm install`.
3. Copy `.env.example` to `.env` if needed; the default API URL is `http://localhost:5000/api/v1`.
4. Run `npm run dev` and open the Vite URL shown in the terminal.

## Notes
- Do not commit `.env` files or real secrets.
- Registration and login use the backend API; the backend must be running and MongoDB reachable.
- Seed command: `npm run seed` from `backend` after configuring `.env`.
- Tests: `npm test` from `backend` (requires a reachable test MongoDB URI if configured).
