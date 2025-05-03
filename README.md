Sure! Here's a more detailed and polished version of the instructions for your README, with clearer steps and formatting for easier readability:

---

# CS491-City-Nav-App

Senior capstone project for the startup track

## Setup

To get the application up and running, follow these steps:

### 1. Set up the Backend

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

### 2. Set up the Frontend

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

### 3. Run End-to-End Tests (Optional)

* While the backend and frontend are running, open another terminal window in the **parent directory** (the directory that contains both the `backend` and `frontend` directories).
* Run Cypress to open the test interface:

  ```bash
  npm i
  npm run cypress:open
  ```

---

### Additional Notes

* Make sure that both the backend and frontend servers are running before you run Cypress tests.
* The frontend will typically be running on `http://localhost:3000`, and the backend will be running on its own port (configured in the backend code).
