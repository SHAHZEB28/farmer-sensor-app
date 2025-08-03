# Field Insights Dashboard 🌾

![CI Pipeline](https://github.com/<YourGitHubUsername>/<YourRepoName>/actions/workflows/ci.yml/badge.svg)

An interactive, full-stack web application designed to ingest, process, and analyze farm sensor data. This project allows users to submit sensor readings (e.g., soil moisture, temperature) via a REST API or a bulk CSV file upload, processes large files asynchronously, and displays real-time analytics on a modern, responsive UI.

This project was built to meet and exceed the requirements of the **Carbonleap Full Stack Intern Take-Home Assignment**.

---

### ✨ Live Demo

**(Link to your deployed application will go here)**

---

### 🚀 Features

- **Single & Bulk Data Ingestion:** Submit sensor readings one by one or upload a large CSV file.
- **Asynchronous Processing:** Large CSV files are processed in the background using Celery, providing a non-blocking user experience.
- **Real-time Job Status:** Users receive live toast notifications on the status of their background jobs (uploading, processing, success, or failure).
- **Dynamic Dashboard:** An interactive dashboard that displays real-time analytics and a time-series chart of sensor readings.
- **Fully Tested:** Includes a comprehensive test suite for both the backend API and the frontend components.
- **Containerized:** The entire application is containerized with Docker for easy setup and deployment.

### 🛠️ Tech Stack

| Category      | Technology                                                                                                                                                                                                                                                                                                                                                                                                                   |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)                                                                                       |
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)                                                                                                    |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)                                                                                                                                                                                                          |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)                                                                                                                                                                                          |
| **Testing** | ![Pytest](https://img.shields.io/badge/Pytest-0A9B71?style=for-the-badge&logo=pytest&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)                                                                                                                                                                                                                            |

---

### Local Development Setup

#### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed and running.
- [Node.js](https://nodejs.org/) (v18 or later) and npm installed.

#### Running the Application

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-name>
    ```

2.  **Start all services with Docker Compose:**
    This command builds and starts the backend API, database, Redis, and Celery workers.
    ```bash
    docker compose up --build
    ```
    - The backend API will be available at `http://localhost:8000`.
    - The interactive API documentation is at `http://localhost:8000/docs`.

3.  **Run the Frontend Development Server:**
    In a **new terminal**, navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    npm install
    npm run dev
    ```
    - The frontend will be available at `http://localhost:5173`.

---

### 🧪 Running Automated Tests

#### Backend Tests
Ensure the Docker containers are running, then in a new terminal, run:
```bash
docker compose exec api pytest

Frontend Tests

Navigate to the Frontend directory and run:

npm test

📊 Data Generation for Submission

As per the assignment requirements, a large dataset was generated to realistically evaluate the asynchronous processing capabilities of the application.

File: final_dataset.csv (included in the repository root)

Record Count: 500

Method: The dataset was generated to simulate realistic sensor readings over several hours for two different fields. It includes both temperature and soil moisture data with timestamps formatted in ISO 8601. This allows for a comprehensive test of the bulk CSV upload, background processing, and data visualization features.

</markdown>
