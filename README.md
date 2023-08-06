![Medicapp](https://raw.githubusercontent.com/johnmichaelespiritu/medicapp-frontend/main/public/medicapp.png)

# Medicapp

Medicapp is a web-based patient information management system designed to efficiently manage and maintain patient-related data in a healthcare setting. This system provides an easy-to-use interface for doctors and administrators to handle various aspects of patient information, including managing doctor profiles, patient records, and consultation details. The application aims to streamline the administrative processes and improve patient care by facilitating quick access to accurate information.

## Website

Visit my web application [here](https://medicapp-system.netlify.app/#/).

## Installation

### Clone the repository:

```bash
$ git clone https://github.com/johnmichaelespiritu/medicapp-frontend.git
```

### Navigate to the project directory:

```bash
$ cd your-repo
```

### Start the development server:

You can run the development server to see the project in action.

```bash
$ quasar dev
```

The development server will start, and you can access the project at http://localhost:9000 in your web browser.

## Features

### User Authentication

The login feature requires users to enter their registered credentials, such as email address and password, to log in.

### Registration and Account Creation

New users can register and create their accounts within the system. During registration, users provide essential details, such as their name, email address, and desired password.

### Password Reset and Recovery

The system allows users to reset their passwords in case they forget them. A verification code is sent to users' registered email addresses for verification and security.

### Authentication Tokens (JWT)

Upon successful login, the system generates a JSON Web Token (JWT) that is used to identify and authenticate the user during subsequent requests. The token is sent as an authorization header in API requests to verify the user's identity and access rights.

### Dashboard

The system has a dashboard that provides an overview of essential information, such as the number of doctors, patients, and active consultations.

### Doctor Information

Each doctor profile include personal information, specialty, and contact details.

### Patient Information

Patient information include personal information such as name, home address, and contact details.

### Consultation Information

Consultation records contain details about the patient's complaints, diagnosis, prescribed medications, status, and consultation date.

### Create, Read, Update, Delete (CRUD) Operations

Authorized users can create, read, update, and delete doctor profiles, patient records, and consultation information.

### Search Functionality

The system include a search functionality to quickly find specific records. Users may be able to search by patient name, doctor name, or consultation information.

## Tech Stack

- Frontend: Vue.js, Quasar, SCSS
- Backend: PHP
- Database: MySQL
- Authentication: JWT (JSON Web Tokens) for secure user authentication

## Created by

This project was created by John Michael Espiritu as a personal project to showcase my skills in web development.

© 2023 All rights reserved.
