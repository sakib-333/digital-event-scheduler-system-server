# Digital Event Scheduler System

This is the server-side implementation of the Digital Event Scheduler System, built with Node.js, Express.js, and MongoDB. It provides APIs for event management, user roles, and admin approvals.

## Features

- **Express.js**: Web framework for building the server
- **Mongoose**: Provides a straight-forward, schema-based solution to model for application data.
- **MongoDB**: Database for storing user data and other information
- **JWT Authentication**: Secure user authentication with JSON Web Tokens
- **Cookie-Parser**: Parsing cookies in requests
- **CORS**: Enabling cross-origin requests for the server
- **dotenv**: Environment variable management

## Prerequisites

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/)
- A **MongoDB** instance (either local or cloud-based like MongoDB Atlas)

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone git@github.com:sakib-333/digital-event-scheduler-system-server.git

   cd digital-event-scheduler-system-server
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file root of the folder and all of your secret keys.

   ```bash
   db_username=<your-db-username>

   db_password=<your-db-password>

   uri=<mongodb-connection-uri>

   jwt_secret=<your-jwt-secret>

   ```

4. Start server

   ```bash
   node index.js
   ```

5. Your server should now be running on `http://localhost:3000`.
