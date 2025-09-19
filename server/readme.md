## 1. Register Pharmacy
**POST** `/api/register/pharmacy`

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
- 201 Created
  ```json
  { "message": "Pharmacy registered successfully", "id": "pharmacy_id" }
  ```
- 409 Conflict, 400 Bad Request, 500 Internal Error

---

## 2. Register Doctor
**POST** `/api/register/doctor`

**Request Body:**
```json
{
  "name": "string",
  "password": "string"
}
```
**Response:**
- 201 Created
  ```json
  { "message": "Doctor registered successfully", "id": "doctor_id" }
  ```
- 400 Bad Request, 500 Internal Error

---

## 3. Login Pharmacy
**POST** `/api/login/pharmacy`

**Request Body:**
```json
{
  "id": "string",
  "password": "string"
}
```
**Response:**
- 200 OK
  ```json
  {
    "message": "Pharmacy login successful",
    "pharmacy": {
      "id": "string",
      "name": "string",
      "location_area": "string"
    }
  }
  ```
- 400, 404, 401, 500 Error

---

## 4. Login Doctor
**POST** `/api/login/doctor`

**Request Body:**
```json
{
  "id": "string",
  "password": "string"
}
```
**Response:**
- 200 OK
  ```json
  {
    "message": "Doctor login successful",
    "doctor": {
      "id": "string",
      "name": "string"
    }
  }
  ```
- 400, 404, 401, 500 Error

---

## 5. Add Medicine to Inventory
**POST** `/api/inventory/add`

**Request Body:**
```json
{
  "pharmacy_id": "string",
  "medicine": {
    "name": "string",
    "requires_prescription": "boolean",
    "status": "in stock" | "out of stock"
  }
}
```
**Response:**
- 200 OK
  ```json
  { "message": "Medicine added", "inventory": [ ... ] }
  ```
- 400, 404, 500 Error

---

## 6. Update Medicine in Inventory
**PATCH** `/api/inventory/update`

**Request Body:**
```json
{
  "pharmacy_id": "string",
  "name": "string",
  "updates": {
    "requires_prescription": "boolean"
  }
}
```
**Response:**
- 200 OK
  ```json
  { "message": "Medicine updated successfully", "inventory": [ ... ] }
  ```
- 400, 404, 500 Error

---

## 7. Remove Medicine from Inventory
**DELETE** `/api/inventory/remove`

**Request Body:**
```json
{
  "pharmacy_id": "string",
  "name": "string"
}
```
**Response:**
- 200 OK
  ```json
  { "message": "Medicine removed", "inventory": [ ... ] }
  ```
- 400, 404, 500 Error

---

## 8. Recon/Reset Data
**POST** `/api/recon/reset`

**Request Body:** (empty)

**Response:**
- 200 OK
  ```json
  {
    "message": "Recon completed successfully",
    "summariesDeleted": number,
    "callsUpdated": number
  }
  ```
- 500 Internal Error

---
