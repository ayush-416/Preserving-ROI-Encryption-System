# Preserving ROI Encryption System

A Privacy-Preserving Region of Interest (ROI) Encryption System built with FastAPI and React. This system allows administrators to upload images, automatically detect regions of interest (using YOLOv8), and selectively encrypt these sensitive patches. Users can then request access to specific encrypted regions, which administrators can approve using secure RSA/AES key exchange mechanisms.

## Features

- **Role-based Authentication**: Distinct roles for Administrators and Users, with secure RSA public key management.
- **Automated ROI Detection**: Integrates YOLOv8 object detection to automatically identify regions of interest within uploaded images.
- **Selective Encryption**: Extracts and encrypts specific image patches (ROIs) using AES, ensuring sensitive data is protected while keeping the rest of the image in the clear or handled separately.
- **Access Management System**: Users can request access to specific encrypted image patches. Administrators can review and approve these requests, securely sharing the AES key using the approved user's public RSA key.
- **React Frontend**: A modern, interactive user interface built with Create React App.
- **FastAPI Backend**: A high-performance Python backend powered by FastAPI.

## Project Structure

- `/client`: React frontend application.
- `/server`: FastAPI backend application, SQLite/JSON database logic, and YOLOv8 model (`yolov8n.pt`).

## Prerequisites

- Node.js & npm (for the frontend)
- Python 3.8+ (for the backend)

## Installation & Setup

### 1. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   python main.py
   ```
   The backend will be running at `http://localhost:8000` with interactive API docs available at `http://localhost:8000/docs`.

### 2. Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install Node dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`.

## Technologies Used

- **Backend**: Python, FastAPI, Uvicorn, OpenCV (`opencv-python`), Ultralytics (YOLOv8), PyCryptodome (for RSA/AES encryption).
- **Frontend**: React, React Router DOM.
