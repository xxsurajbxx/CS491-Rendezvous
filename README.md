# CS491-City-Nav-App

Senior capstone project for the startup track

---

## Setup

To get the application up and running, follow these steps:

---

### 1. Set up Environment Variables

Before running the application, create the required `.env` files in the appropriate directories:

#### **backend/.env**

Create a `.env` file in the `backend` directory and include the following variables:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
HASDATA_API_KEY=
JWT_SECRET=
EMAIL_USER=
EMAIL_PW=
TICKETMASTER_KEY=
ORS_KEY=
```

#### **frontend/.env**

Create a `.env` file in the `frontend` directory and include the following variables:

```env
NEXT_PUBLIC_JWT_SECRET=
NEXT_PUBLIC_GEOAPIFY_KEY=
```

> **Note:** If you're connecting to the NJIT SQL Server, you must be on NJIT's Wi-Fi or connected to the NJIT network via the **Cisco Secure Client VPN** or any other VPN.

---

### 2. Set up the Backend

* Open a terminal window.
* Navigate to the **backend** directory:

  ```bash
  cd backend
  ```
* Install the required dependencies:

  ```bash
  npm install
  ```
* Build the backend:

  ```bash
  npm run build
  ```
* Start the backend:

  ```bash
  npm run start
  ```

---

### 3. Set up the Frontend

* Open another terminal window.
* Navigate to the **frontend** directory:

  ```bash
  cd frontend
  ```
* Install the required dependencies (use the `--legacy-peer-deps` flag if necessary):

  ```bash
  npm install --legacy-peer-deps
  ```
* Build the frontend:

  ```bash
  npm run build
  ```
* Start the frontend:

  ```bash
  npm run start
  ```

---

### 4. Run End-to-End Tests (Optional)

* While the backend and frontend are running, open another terminal window in the **parent directory** (the directory that contains both `backend` and `frontend`).
* Install the Cypress testing dependencies:

  ```bash
  npm install
  ```
* Run Cypress to open the test interface:

  ```bash
  npm run cypress:open
  ```

---

### Additional Notes

* Ensure both the backend and frontend servers are running before running Cypress tests.
* By default:

  * Frontend runs on `http://localhost:3000`
  * Backend runs on `http://localhost:8080`

