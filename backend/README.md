# Backend API Documentation

## Table of Contents
- [Setup and Configuration](#setup-and-configuration)
- [API Endpoints](#api-endpoints)
  - [Register User](#register-user)
  - [Login User](#login-user)
  - [Get User Profile](#get-user-profile)
  - [Logout User](#logout-user)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Development](#development)
- [Notes](#notes)
- [Captain API Endpoints](#captain-api-endpoints)
  - [Register Captain](#register-captain)
  - [Login Captain](#login-captain)
  - [Get Captain Profile](#get-captain-profile)
  - [Logout Captain](#logout-captain)

## Setup and Configuration

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Environment Variables
Create a `.env` file in the backend root directory: 
```

## Security Features
- Password hashing using bcrypt
- JWT-based authentication
- Email uniqueness validation
- Input validation and sanitization

## Error Handling
Status codes used in the API:
- `201`: Successfully created resource
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Testing
You can test the API using Postman:

1. Register User Example: 
```

The server will run on `http://localhost:4000`

## API Endpoints

### Register User
Creates a new user account and returns an authentication token.

**Endpoint:** `POST /users/register`

**Request Headers:** 
```

## Development
1. **Ensure MongoDB is running locally**
    ```bash
    mongod
    ```

2. **Create the `.env` file with required variables**
    ```bash
    PORT=4000
    DB_CONNECT=mongodb://localhost:27017/uber-clone
    JWT_SECRET=your-secret-key
    ```

3. **Install dependencies using `npm install`**
    ```bash
    npm install
    ```

4. **Start the server using `npm start`**
    ```bash
    npm start
    ```

## Notes
- **Timestamps:** All timestamps are in ISO 8601 format.
- **Token Expiration:** JWT tokens expire after 24 hours.
- **Password Requirements:** Minimum 6 characters.
- **Email Uniqueness:** Each email must be unique in the database.
- **Server Port:** The server runs on port `4000` by default.
- **Token Blacklisting:** Tokens are blacklisted upon logout and expire from the blacklist after 24 hours. 

## Captain API Endpoints

### Register Captain
Creates a new captain account and returns an authentication token.

**Endpoint:** `POST /captains/register`

**Request Headers:**
```json
{
    "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "vehicle": {
        "color": "Black",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
    }
}
```

**Field Requirements:**

| Field              | Type   | Required | Validation                                |
|-------------------|--------|----------|-------------------------------------------|
| firstname         | string | Yes      | Min length: 3 characters                  |
| lastname          | string | Yes      | Min length: 3 characters                  |
| email             | string | Yes      | Valid email format, Unique                |
| password          | string | Yes      | Min length: 6 characters                  |
| vehicle.color     | string | Yes      | Min length: 3 characters                  |
| vehicle.plate     | string | Yes      | Min length: 3 characters                  |
| vehicle.capacity  | number | Yes      | Min value: 1                             |
| vehicle.vehicleType| string | Yes     | Enum: ['car', 'motorcycle', 'auto']      |

**Success Response (201 Created):**
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "captain": {
        "_id": "captain_id",
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "vehicle": {
            "color": "Black",
            "plate": "ABC123",
            "capacity": 4,
            "vehicleType": "car"
        }
    }
}
```

**Error Responses:**

1. **Validation Error (400 Bad Request)**
```json
{
    "errors": [
        {
            "msg": "First name must be at least 3 characters long",
            "param": "firstname",
            "location": "body"
        }
    ]
}
```

2. **Email Already Exists (400 Bad Request)**
```json
{
    "success": false,
    "message": "Email already exists"
}
```

### Login Captain
Authenticates a captain and returns an authentication token.

**Endpoint:** `POST /captains/login`

**Request Headers:**
```json
{
    "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "captain": {
        "_id": "captain_id",
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "vehicle": {
            "color": "Black",
            "plate": "ABC123",
            "capacity": 4,
            "vehicleType": "car"
        },
        "status": "inactive"
    }
}
```

### Get Captain Profile
Retrieves the profile of the authenticated captain.

**Endpoint:** `GET /captains/profile`

**Request Headers:**
```json
{
    "Authorization": "Bearer your_jwt_token_here"
}
```

**Success Response (200 OK):**
```json
{
    "success": true,
    "captain": {
        "_id": "captain_id",
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "vehicle": {
            "color": "Black",
            "plate": "ABC123",
            "capacity": 4,
            "vehicleType": "car"
        },
        "status": "inactive"
    }
}
```

### Logout Captain
Logs out the authenticated captain by blacklisting the JWT token.

**Endpoint:** `GET /captains/logout`

**Request Headers:**
```json
{
    "Authorization": "Bearer your_jwt_token_here"
}
```

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

**Error Responses (for all endpoints):**

1. **Unauthorized (401)**
```json
{
    "success": false,
    "message": "Access denied. No token provided."
}
```

2. **Invalid Token (401)**
```json
{
    "success": false,
    "message": "Invalid token."
}
```

3. **Token Blacklisted (401)**
```json
{
    "success": false,
    "message": "Token has been invalidated. Please login again."
}
```

4. **Server Error (500)**
```json
{
    "success": false,
    "message": "Something went wrong!"
}
```

## Captain Model Schema

```javascript
const captainSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        required: true,
        minlength: [3, 'First name must be at least 3 characters long']
    },
    lastname: { 
        type: String, 
        required: true,
        minlength: [3, 'Last name must be at least 3 characters long']
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true,
        select: false
    },
    socketId: { type: String },
    status: { 
        type: String,
        enum: ['active','inactive'], 
        default: 'inactive' 
    },
    vehicle: {
        color: { 
            type: String, 
            required: true, 
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: { 
            type: String, 
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car','motorcycle', 'auto'],
        }
    }
});
``` 