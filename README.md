# RandomSentenceGenerator
A website that creates grammatically correct simple sentences

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
- **POST request**: Allows users to add or delete words to their dictionary.
- **Sentence generation logic**: Uses stored words to construct simple grammatically correct sentences with the following structure: [here](https://www.butte.edu/departments/cas/tipsheets/grammar/sentence_structure.html)
.
## Interaction Between Client & Server
- The client generates a sentence, adds or deletes a word or looks at their history
- All that is done through a GET request.
- The server then provides the data that the client has requested through a POST request
- **NOTE:** The different Index, Dictionary and History .html files have been none dinamically created but will be implemented during serverside creation

## Technical Implementation
- **Front-end**: HTML, CSS (Bootstrap 5), JavaScript
- **Back-end**: Node.js with Express
- **Data Format**: JSON
- **Linting**: ESLint to ensure code quality (this hasn't been done yet will will get to it during serverside Implementation)

## User Experience (UX)
- **Minimal input required** for sentence generation.
- **Dynamic filtering** for managing word collections.
- **Accessible design** ensuring ease of use.