# LCK CHT in React

## Descripción del Proyecto
Este proyecto es una aplicación de chat de texto en tiempo real desarrollada con un enfoque cliente-servidor. Los usuarios pueden intercambiar mensajes instantáneamente, gestionar solicitudes de amistad y mantener conversaciones privadas solo con sus contactos aceptados.

## Tecnologías utilizadas
Frontend: React.js (interfaz de usuario dinámica y reactiva)

Backend: Node.js con Express (API REST y WebSocket para comunicación en tiempo real)

Base de datos: MySQL (almacenamiento persistente de usuarios, mensajes y solicitudes de amistad)

Comunicación en tiempo real: Socket.IO (WebSockets)

## Funcionalidades principales
Registro e inicio de sesión de usuarios

Envío y recepción de mensajes en tiempo real

Búsqueda de otros usuarios

Envío, aceptación y rechazo de solicitudes de amistad

Listado de contactos (solo se puede chatear con amigos aceptados)

Persistencia de mensajes y relaciones en la base de datos

--- --- --- --- --- --- --- ---- --- --- ---

## Pre-requisites

Before you start, ensure the following are installed on your system:

1. **Node.js (Version 20):**
   - Download and install Node.js version 20 from the [Node.js website](https://nodejs.org/).

2. **Yarn Package Manager:**
   - Install Yarn using npm (Node.js package manager) by running:
     ```
     npm install -g yarn
     ```
   - This installs Yarn globally on your system.

Once Node.js and Yarn are installed, follow these steps:

1. **Navigate to the Project Root:**
   - Ensure you are in the root directory of the project.

2. **Install Dependencies:**
   - **Frontend:**
     - Navigate to the `frontend` directory from the project root:
       ```
       cd frontend
       ```
     - Install the necessary packages using Yarn:
       ```
       yarn install
       ```
   - **Backend:**
     - Navigate to the `backend` directory from the project root:
       ```
       cd ../backend
       ```
     - Install the necessary packages using Yarn:
       ```
       yarn install
       ```

## Starting the Project

To start the project, from the directory "MY-APP", run the following command:

yarn run start

This command will start both the frontend and backend parts of your project. Ensure that both are configured to run with this command.

## Additional Information

- If you encounter any issues with package versions or dependencies, consider running `yarn upgrade` or `yarn install --force` in the respective directories.



