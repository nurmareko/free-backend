# Free — Backend (REST API)

## Endpoints

| Method | Path | Body | Notes |
|---|---|---|---|
| `GET` | `/api/items` | — | All items, newest first |
| `GET` | `/api/items?mine=true` | — | Caller's items only |
| `GET` | `/api/items/{id}` | — | Detail |
| `POST` | `/api/items` | multipart | Create (owner from token) |
| `PUT` | `/api/items/{id}` | multipart | Update, owner only |
| `DELETE` | `/api/items/{id}` | — | Delete, owner only |
| `GET` | `/api/me` | — | Authed profile |

All requests need `Authorization: Bearer <google_id_token>`.
Multipart fields: `title`, `description`, `location`, `contactInfo`, `image` (file).
