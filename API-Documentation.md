# Random Sentence Generator API Documentation

## Overview

This document outlines the API endpoints available in the Random Sentence Generator application. The API provides functionality for managing words, generating sentences, and tracking sentence history.

## Base URL

All endpoints are relative to the base URL of the server:

```
http://localhost:3000
```

The server runs on port 3000 by default but can be configured using the PORT environment variable.

## Endpoints

### Words API

#### Get All Words

Retrieves all words organized by groups and categories.

- **URL**: `/api/words`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200
  - **Content**: JSON object with words organized by groups and categories
    ```json
    {
      "Subject": {
        "Nouns": ["person", "mountain", "state"],
        "Pronouns": ["he", "she", "they"]
      },
      "Predicate": {
        "Verbs": ["run", "jump", "speak"],
        "Helping Verbs": ["is", "was", "will"]
      }
    }
    ```
- **Error Response**:
  - **Code**: 500
  - **Content**: `{ "error": "Failed to load words data" }`

#### Add Word

Adds a new word to the specified group and category.

- **URL**: `/api/words`
- **Method**: `POST`
- **Data Params**:
  ```json
  {
    "word": "example",
    "group": "Subject",
    "category": "Nouns"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ "success": true }`
- **Error Responses**:
  - **Code**: 400
  - **Content**: `{ "error": "Missing required fields" }`
  - **Code**: 400
  - **Content**: `{ "error": "Word already exists" }`
  - **Code**: 500
  - **Content**: `{ "error": "Failed to add word" }`

#### Delete Word

Deletes a word from all groups and categories.

- **URL**: `/api/words`
- **Method**: `DELETE`
- **Data Params**:
  ```json
  {
    "word": "example"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ "success": true }`
- **Error Responses**:
  - **Code**: 400
  - **Content**: `{ "error": "Word is required" }`
  - **Code**: 404
  - **Content**: `{ "error": "Word not found" }`
  - **Code**: 500
  - **Content**: `{ "error": "Failed to delete word" }`

### History API

#### Get History

Retrieves the sentence generation history.

- **URL**: `/api/history`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of history items
    ```json
    [
      {
        "id": 1679012345678,
        "sentence": "The happy person jumps enthusiastically.",
        "timestamp": "2023-03-17T12:34:56.789Z"
      }
    ]
    ```
- **Error Response**:
  - **Code**: 500
  - **Content**: `{ "error": "Failed to load history data" }`

#### Save to History

Saves a generated sentence to the history.

- **URL**: `/api/history`
- **Method**: `POST`
- **Data Params**:
  ```json
  {
    "sentence": "The happy person jumps enthusiastically"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ "success": true }`
- **Error Responses**:
  - **Code**: 400
  - **Content**: `{ "error": "Sentence required" }`
  - **Code**: 500
  - **Content**: `{ "error": "Failed to save history" }`

## Data Structures

### Word Structure

Words are organized in a hierarchical structure:

```
{
  "Group1": {
    "Category1": ["word1", "word2"],
    "Category2": ["word3", "word4"]
  },
  "Group2": {
    "Category3": ["word5", "word6"]
  }
}
```

The application uses these groups:

- **Subject**: Contains "Nouns" and "Pronouns"
- **Predicate**: Contains "Verbs" and "Helping Verbs"
- **Object**: Contains "Direct Objects" and "Indirect Objects"
- **Complement**: Contains "Subject Complements" and "Object Complements"
- **Modifiers**: Contains "Articles", "Demonstratives", "Possessives", "Quantifiers", and "Adjectives"

### History Item Structure

Each history item has the following structure:

```json
{
  "id": 1679012345678,
  "sentence": "The happy person jumps enthusiastically.",
  "timestamp": "2023-03-17T12:34:56.789Z"
}
```

## Usage Examples

### Adding a New Word

```javascript
fetch('/api/words', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    word: 'mountain',
    group: 'Subject',
    category: 'Nouns'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Generating and Saving a Sentence

```javascript
// First, get words data
fetch('/api/words')
  .then(response => response.json())
  .then(wordsData => {
    // Use words data to generate a sentence (client-side generation)
    const sentence = "The mountain stands tall and majestic.";
    
    // Save the generated sentence
    return fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sentence })
    });
  })
  .then(response => response.json())
  .then(data => console.log(data));
```

## Limitations

- The history is limited to 8 items, with the newest item appearing first
- Each sentence is automatically formatted (trimmed, period added if missing)
- Words must be unique within their category

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in JSON format. Always check the response status before processing the data.