# Custom Onboarding Flow

This is a full-stack web application for customizing user onboarding flows. Admins can control which fields appear on specific steps of the onboarding process, while users can fill out the forms.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Running the App](#running-the-app)
- [Admin Configuration](#admin-configuration)

## Features

- **User Onboarding Wizard**: A three-step onboarding process where users can input email, password, personal details, and more.
- **Admin Configuration**: Admins can customize which fields appear on step 2 and step 3 of the onboarding wizard.
- **Data Persistence**: User data is stored in MongoDB and can be displayed in a simple HTML table.


## Tech Stack

- **Frontend**: Next.js (React), TypeScript, CSS Modules
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoClient)
- **State Management**: React's `useState` and `useEffect`
- **API Communication**: Fetch API for frontend-backend communication

## Setup and Installation

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js
- npm or yarn
- MongoDB

### Installation

1. **Clone the repository**:
   ```bash
   git clone 
   cd custom-onboarding-flow

2. **Install dependencies**:
    - In the project root directory, run:
    ```bash
    npm install
    ```
    - Install dependencies for both the frontend and backend:
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```
3. **Environment Variables**:
    - Create a `.env` file in the `backend/` directory with the following:

    ```bash
        MONGO_URI=<your-mongodb-connection-string>
    ```
4. **Database Setup**:
    - Make sure MongoDB is running on your machine or connect to a MongoDB Atlas cluster.

## API Endpoints

- **PUST /api/users/register**: Registers a new user with email and password.
- **PUST /api/users/addInfos**: Adds personal information ( address, about me, birthdate) for a user.
- **GET /api/users/allUsers**: Fetches all users data.
- **GET /api/adminConfig**: Fetches the admin configuration for steps 2 and 3.
- **PUT /api/adminConfig**: Updates the admin configuration.


## Running the App

1. **Start the backend server**: In the `backend/` directory, run:
    ```bash 
    npm run dev
    ```
2. **Start the frontend server**: In the frontend/ directory, run:
    ```bash 
    npm run dev
    ``` 
3. **Access app**:
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:5000

## Admin Configuration

The onboarding process can be customized by updating the admin configuration stored in the database. By default, the configuration is:
```json
{
  "step2": ["aboutMe", "address"],
  "step3": ["birthday"]
}
```

**To update the configuration**:
1. Go to /admin and make your selections.
2. Submit the form to update which components are shown in each step of the onboarding process.