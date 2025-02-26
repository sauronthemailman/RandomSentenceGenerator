# Random Sentence Generator - Project Overview

## Introduction

The Random Sentence Generator is a dynamic web application designed to help users create grammatically correct simple sentences. By allowing users to manage a personal dictionary, the application tailors sentence generation to individual preferences. This project adheres to best programming practices, utilizing a client-server architecture with Node.js on the backend and AJAX for dynamic JSON content retrieval.

## Website Functionality

### Client-Side Features

- **Personal Dictionary Management:** Users can add or remove words, customizing their vocabulary.
- **Sentence Generation:** Create random sentences using the user's personalized word collection.
- **Responsive Design:** Built with the Bootstrap framework, the application functions seamlessly across desktops and mobile devices.

### Server-Side Functionality

The backend, developed with Node.js and Express, offers a robust REST API with the following endpoints:

- **GET /api/words:** Retrieves the user's current word list and sentence history.
- **POST /api/words:** Adds or deletes words in the user's dictionary.
- **GET /api/generate-sentence:** Constructs and returns a simple grammatically correct sentence based on the user's word list.

Each endpoint ensures accurate content-type headers and appropriate HTTP status codes, such as `200 OK`, `400 Bad Request`, or `403 Forbidden` (if authentication is implemented).

## Client-Server Interaction

- **AJAX Communication:** The client-side employs AJAX requests to interact with the server, enabling dynamic content updates without full page reloads.
- **REST API:** The server's API facilitates structured and predictable interactions, enhancing maintainability and scalability.
- **Error Handling:** Comprehensive error handling on both client and server sides ensures resilience against unexpected issues.

## Technical Implementation
- **Front-end**: HTML, CSS (Bootstrap 5), JavaScript
- **Back-end**: Node.js with Express
- **Data Format**: JSON
- **Linting**: ESLint to ensure code quality (this hasn't been done yet will will get to it during serverside Implementation)

