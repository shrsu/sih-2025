### 1. `/register/pharmacy` (POST)
**Purpose:** Register a new pharmacy and create its inventory.
**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "phone_number": "string",
  "location_area": "string",
  "password": "string"
}
```
**Response:**  
- `201 Created` with `{ message, id }`  
- Errors: `400`, `409`, `500`

---

### 2. `/register/doctor` (POST)
**Purpose:** Register a new doctor.
**Request Body:**
```json
{
  "name": "string",
  "password": "string"
}
```
**Response:**  
- `201 Created` with `{ message, id }`  
- Errors: `400`, `500`

---

### 3. `/login/pharmacy` (POST)
**Purpose:** Login for pharmacy.
**Request Body:**
```json
{
  "id": "string",
  "password": "string"
}
```
**Response:**  
- `200 OK` with `{ message, pharmacy }`  
- Errors: `400`, `404`, `401`, `500`

---

### 4. `/login/doctor` (POST)
**Purpose:** Login for doctor.
**Request Body:**
```json
{
  "id": "string",
  "password": "string"
}
```
**Response:**  
- `200 OK` with `{ message, doctor }`  
- Errors: `400`, `404`, `401`, `500`

---

### 5. `/inventory/add` (POST)
**Purpose:** Add a medicine to a pharmacy's inventory.
**Request Body:**
```json
{
  "pharmacy_id": "string",
  "medicine": { "name": "string", ... }
}
```
**Response:**  
- `200 OK` with `{ message, inventory }`  
- Errors: `400`, `404`, `500`

---

### 6. `/inventory/update` (PATCH)
**Purpose:** Update a medicine's `requires_prescription` status in inventory.
**Request Body:**
```json
{
  "pharmacy_id": "string",
  "name": "string",
  "updates": { "requires_prescription": true/false }
}
```
**Response:**  
- `200 OK` with `{ message, inventory }`  
- Errors: `400`, `404`, `500`

---

### 7. `/inventory/remove` (DELETE)
**Purpose:** Remove a medicine from a pharmacy's inventory.
**Request Body:**
```json
{
  "pharmacy_id": "string",
  "name": "string"
}
```
**Response:**  
- `200 OK` with `{ message, inventory }`  
- Errors: `400`, `404`, `500`

---

### 8. `/inventory` (GET)
**Purpose:** Get the inventory for a pharmacy.
**Request Body:**  
```json
{
  "pharmacy_id": "string"
}
```
**Response:**  
- `200 OK` with `{ inventory }`  
- Errors: `400`, `404`, `500`

---

### 9. `/tickets` (GET)
**Purpose:** Get all tickets.
**Response:**  
- `200 OK` with `[tickets]`  
- Errors: `500`

---

### 10. `/tickets/prescription` (PATCH)
**Purpose:** Update a prescription in a ticket.
**Request Body:**
```json
{
  "summary_id": "string",
  "doctor_name": "string",
  "prescription": { ... }
}
```
**Response:**  
- `200 OK` with `{ message, ticket }`  
- Errors: `400`, `404`, `500`

---

### 11. `/tickets/status` (PATCH)
**Purpose:** Update the active status of a ticket.
**Request Body:**
```json
{
  "ticket_id": "string",
  "isActive": true/false
}
```
**Response:**  
- `200 OK` with `{ message, ticket }`  
- Errors: `400`, `404`, `500`

---

### 12. `/recon/reset` (POST)
**Purpose:** Reset all tickets and mark all calls as unprocessed (for reconciliation/maintenance).
**Response:**  
- `200 OK` with `{ message, ticketsDeleted, callsUpdated }`  
- Errors: `500`

