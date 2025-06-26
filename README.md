# LCK CHT in React

## Project Description

This project is a real-time text chat application developed using a client-server architecture. Users can exchange messages instantly, manage friend requests, and maintain private conversations only with accepted contacts.

## Technologies Used

- **Frontend:** React.js (dynamic and responsive UI)
- **Backend:** Node.js with Express (REST API and WebSocket for real-time communication)
- **Database:** MySQL (persistent storage of users, messages, and friend requests)
- **Real-Time Communication:** Socket.IO (WebSockets)

## Main Features

- User registration and login
- Real-time message sending and receiving
- Search for other users
- Sending, accepting, and rejecting friend requests
- Contacts list (chat only available with accepted friends)
- Persistent storage of messages and relationships in the database

# Project Setup Instructions

## Prerequisites

Before you start, ensure the following are installed and configured on your system:

### 1. **Node.js (Version 20)**

- Download and install Node.js v20 from the official website: [https://nodejs.org/](https://nodejs.org/)

### 2. **Yarn Package Manager**

- Install Yarn globally using npm:
  ```bash
  npm install -g yarn
  ```

### 3. **MySQL**

- Install MySQL locally.
- Create a database on your machine with the following credentials:
  - **User:** `root`
  - **Password:** `toor`
- After creating the database, execute the contents of the `dbchat.sql` file step by step to set up the necessary schema and data.

---

## Installing the Project

1. **Navigate to the Project Root (**``**)**

   ```bash
   cd path/to/my-app
   ```

2. **Install Dependencies**

### - **Frontend**

```bash
cd frontend
yarn install
```

### - **Backend**

```bash
cd ../backend
yarn install
```

---

## Environment Configuration

If you need to change the database user, password, port, or other settings, edit the `.env` file located in the `backend` directory.

---

## Starting the Project

From the `my-app` root directory, run:

```bash
yarn run start
```

This command will start both the frontend and backend, provided that both are configured to run under this command.

---

## Additional Information

- If you encounter issues with package versions or dependencies, try:
  ```bash
  yarn upgrade
  ```
  or force reinstall with:
  ```bash
  yarn install --force
  ```
