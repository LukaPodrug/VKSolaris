## Waterpolo Club Backend (Express + Postgres)

Environment variables:

- Copy `env.example` to `.env` and fill values. Required:
  - `DATABASE_URL` (Neon Postgres)
  - `JWT_SECRET`
  - Optional: `ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASSWORD`, `PORT`

Scripts:

- dev: run with file watching
- start: production server

Endpoints (admin protected unless noted):

- GET /health (public)
- POST /auth/login { email, password } -> { token }
- GET /users?status=pending|active|suspended
- POST /users { firstName, lastName, memberId }
- POST /users/:id/approve
- POST /users/:id/suspend
- POST /users/:id/apply-promo { code? , discountPercent? }
- GET /promos
- POST /promos { code, discountPercent, expiresAt?, usageLimit?, isActive? }
- PATCH /promos/:id { isActive }
- DELETE /promos/:id
- POST /wallet/issue/:userId { firstName, lastName, memberId, customDesign? }
- GET /wallet/card/:userId

Deploy to Render:

- Build command: none
- Start command: `node src/server.js`
- Environment: set `DATABASE_URL`, `JWT_SECRET`, and admin defaults


