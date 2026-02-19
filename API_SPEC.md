# API Specification — Ramadan Competition Tracker

## Authentication

All protected endpoints require a valid JWT session cookie (`ramadan_session`).
Requests without a valid session return `401 Unauthorized`.

---

## POST /api/auth/signup

**Rate limit:** 5 req / 15 min per IP

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "أحمد محمد"
}
```

**Response 201:**
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "أحمد محمد"
  }
}
```
Sets `ramadan_session` HttpOnly cookie.

---

## POST /api/auth/login

**Rate limit:** 10 req / 15 min per IP

**Request:**
```json
{ "email": "user@example.com", "password": "password123" }
```

**Response 200:** Same as signup. Sets session cookie.

---

## POST /api/auth/logout

**Response 200:**
```json
{ "message": "Logged out" }
```
Clears session cookie.

---

## GET /api/auth/me

**Auth required.**

**Response 200:**
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "أحمد محمد",
    "avatarUrl": null,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## POST /api/groups

**Auth required. Rate limit: 5/hr.**

**Request:**
```json
{
  "name": "عائلة أحمد",
  "slug": "ahmed-family",
  "ramadanStartDate": "2025-03-01",
  "numDays": 30,
  "timezone": "Africa/Cairo",
  "taraweehCap": 11,
  "tahajjudCap": 11
}
```

**Response 201:**
```json
{
  "data": {
    "id": "clx...",
    "name": "عائلة أحمد",
    "slug": "ahmed-family",
    "inviteCode": "ABC123",
    "settings": { ... }
  }
}
```

---

## POST /api/groups/join

**Auth required.**

**Request:**
```json
{ "inviteCode": "ABC123" }
```

**Response 200/201:**
```json
{
  "data": {
    "slug": "ahmed-family",
    "alreadyMember": false
  }
}
```

---

## GET /api/groups/:slug

**Auth required. Must be a member.**

**Response 200:**
```json
{
  "data": {
    "id": "...",
    "name": "عائلة أحمد",
    "slug": "ahmed-family",
    "inviteCode": "ABC123",
    "settings": {
      "ramadanStartDate": "2025-03-01T00:00:00Z",
      "numDays": 30,
      "timezone": "Africa/Cairo",
      "resetRule": "MIDNIGHT",
      "editCutoffHour": 3,
      "taraweehCap": 11,
      "tahajjudCap": 11,
      "quranPagesCap": 20
    },
    "myRole": "ADMIN",
    "lockedDays": [5, 10]
  }
}
```

---

## PATCH /api/groups/:slug

**Auth required. Must be ADMIN.**

**Request (all fields optional):**
```json
{
  "name": "New Name",
  "taraweehCap": 8,
  "tahajjudCap": 8,
  "editCutoffHour": 4,
  "resetRule": "MIDNIGHT",
  "timezone": "Asia/Riyadh"
}
```

---

## GET /api/groups/:slug/logs?day=5

**Auth required. Must be member.**

Query params:
- `day` (optional): filter to specific day number

**Response 200:**
```json
{
  "data": [
    {
      "id": "...",
      "userId": "...",
      "groupId": "...",
      "dayNumber": 5,
      "taraweehRakaat": 11,
      "tahajjudRakaat": 8,
      "quranPages": 20,
      "updatedAt": "2025-03-05T22:00:00Z",
      "user": { "id": "...", "name": "أحمد", "avatarUrl": null }
    }
  ]
}
```

---

## PUT /api/groups/:slug/logs

**Auth required. Must be member. Rate limit: 30/min.**

Updates "today's" log for current user. Day determined by group timezone + reset rule.

**Request:**
```json
{
  "taraweehRakaat": 11,
  "tahajjudRakaat": 8,
  "quranPages": 20,
  "notes": "الحمد لله"
}
```

**Errors:**
- `400`: Ramadan hasn't started/ended
- `403`: Day is locked by admin
- `403`: Edit window closed (past cutoff hour)

---

## POST /api/groups/:slug/logs/admin

**Auth required. Must be ADMIN.**

Override any user's log for any day.

**Request:**
```json
{
  "userId": "target-user-id",
  "dayNumber": 5,
  "taraweehRakaat": 11,
  "tahajjudRakaat": 8,
  "quranPages": 20,
  "reason": "تصحيح خطأ في التسجيل"
}
```

---

## GET /api/groups/:slug/leaderboard

**Auth required. Must be member.**

Query params:
- `type`: `overall` (default) | `daily`
- `day`: day number (required for `type=daily`)

**Response 200:**
```json
{
  "data": [
    {
      "rank": 1,
      "userId": "...",
      "userName": "أحمد",
      "avatarUrl": null,
      "taraweehTotal": 77,
      "tahajjudTotal": 40,
      "quranPagesTotal": 140,
      "totalPoints": 257,
      "daysLogged": 7,
      "lastUpdated": "2025-03-07T22:00:00Z"
    }
  ]
}
```

---

## GET /api/groups/:slug/members

**Auth required. Must be member.**

**Response 200:**
```json
{
  "data": [
    {
      "id": "...",
      "userId": "...",
      "groupId": "...",
      "role": "ADMIN",
      "joinedAt": "2025-01-01T00:00:00Z",
      "user": { "id": "...", "name": "أحمد", "email": "...", "avatarUrl": null }
    }
  ]
}
```

---

## DELETE /api/groups/:slug/members/:userId

**Auth required. Must be ADMIN.**

Kick a member. Cannot kick yourself.

---

## PATCH /api/groups/:slug/members/:userId

**Auth required. Must be ADMIN.**

**Request:**
```json
{ "role": "ADMIN" }
```

---

## POST /api/groups/:slug/days/:day

**Auth required. Must be ADMIN.**

**Request:**
```json
{ "action": "lock" }
```
or
```json
{ "action": "unlock" }
```

---

## GET /api/groups/:slug/invite

**Auth required. Must be member.**

Returns current invite code.

---

## POST /api/groups/:slug/invite

**Auth required. Must be ADMIN.**

Regenerates invite code. Old code is immediately invalidated.

---

## GET /api/health

**Public.**

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2025-03-05T12:00:00Z",
  "db": "connected"
}
```

**Response 503 (DB down):**
```json
{
  "status": "error",
  "timestamp": "...",
  "db": "disconnected"
}
```
