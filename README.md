# .github/workflows/ci.yml

name: CI Pipeline

# This workflow runs on pushes to the main branch and on pull requests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  # Job to test the backend
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v3
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r Backend/requirements.txt
      
      - name: Run backend tests
        # We don't need Docker here, we can run pytest directly
        run: |
          cd Backend
          pytest

  # Job to test the frontend
  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Use a recent LTS version of Node

      - name: Install frontend dependencies
        run: |
          cd Frontend
          npm install
      
      - name: Run frontend tests
        run: |
          cd Frontend
          npm test
