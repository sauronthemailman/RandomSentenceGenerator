# RandomSentenceGenerator
A website that creates grammatically correct simple sentences

# Random Sentence Generator - Project Overview

## Introduction
The **Random Sentence Generator** is a dynamic web application that allows users to generate grammatically correct simple sentences. It features a personal dictionary where users can add and remove words, influencing the generated sentences. The project follows good programming practices and employs a client-server architecture using **Node.js** for backend services and **AJAX** to fetch dynamic JSON content.

## Website Functionality
### Client-Side Features
- Users can **add words** to their dictionary.
- Users can **delete words** from their dictionary.
- The website generates random sentences using stored words.
- **Interactive user experience** with a clean, simple UI.
- **Bootstrap framework** ensures a responsive design, working on both desktop and mobile.

### Server-Side Functionality
The backend is implemented using **Node.js** and serves data through a **REST API**. It provides the following:
- **GET request**: Retrieves stored words and sentence history for each user.
- **POST request**: Allows users to add words to their dictionary.
- **DELETE request**: Enables users to remove words from their dictionary.
- **Sentence generation logic**: Uses stored words to construct grammatically correct sentences.

## Interaction Between Client & Server
- The front-end makes **AJAX calls** to the server to fetch and update JSON data dynamically.
- A **REST API** ensures efficient communication.
- **Error handling** is implemented for robust performance.

## Technical Implementation
- **Front-end**: HTML, CSS (Bootstrap), JavaScript
- **Back-end**: Node.js with Express
- **Data Format**: JSON
- **Testing**: Jest for automated testing
- **Linting**: ESLint to ensure code quality

## User Experience (UX)
- **Minimal input required** for sentence generation.
- **Dynamic filtering** for managing word collections.
- **Accessible design** ensuring ease of use.