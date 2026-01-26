# SCU Theta Tau API Documentation

This API allows authorized applications to fetch publicly-safe data about brothers and leadership.

## Base URL
`https://www.scuthetatau.com/api/`

## Endpoints

### 1. Get All Brothers
Returns a list of all brothers sorted by last name.

- **URL**: `/brothers`
- **Method**: `GET`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `[{ "firstName": "John", "lastName": "Doe", ... }]`

---

### 2. Get Leadership
Returns the Executive Board and other leadership positions.

- **URL**: `/leadership`
- **Method**: `GET`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "executiveBoard": [...], "otherLeadership": [...] }`

---

### 3. Get Users by Role
Returns brothers with a specific role.

- **URL**: `/role/[role_name]`
- **Method**: `GET`
- **Example**: `/api/role/regent`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `[{ "firstName": "Jane", "lastName": "Smith", "role": "Regent", ... }]`

---

## Authentication & Setup
The API requires a **Firebase Service Account** to be configured in Vercel.

1. Generate a Service Account JSON in Firebase Console.
2. Add it to Vercel as `FIREBASE_SERVICE_ACCOUNT` environment variable.

## Security
- All endpoints are **Read-Only** (GET).
- Sensitive fields like `email` and private contact info are excluded from responses.
