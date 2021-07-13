# Movies REST API

movies-rest-api provides image url of a movie and also adds to favorite list.

## Installation
1. Get a free OMDB API Key at http://www.omdbapi.com
2. Clone the repo
```
git clone https://github.com/farhanhilmi/movies-rest-api.git
```
3. Install NPM packages
```
npm install
```
4. Enter your API key in `.env`
```
API_KEY=YOUR_API_KEY
```

## Run the app
```
npm start
```

# Usage

By default the server starts on port `8080`. 

:warning: Important!

You have to login first before sending the request otherwise it will respond 403.

User already has dummy data with `username` `userone` and `password` `12345`.

## Login Endpoint

Method: `POST`

Endpoint: `/auth/login`

Body:
```
{
    "username": "userone",
    "password": "12345"
}
```

#### Success Response
```
{
    "message": "Login Success",
    "token": [USER_TOKEN],
    "userId": "1"
}
```

## GET Poster Url

Method: `GET`

Headers: `Authorization: [TOKEN]`

Endpoint: `/movies/?title=[title]`

Example:
```
http://localhost:8080/movies/?title=tenet
```

#### Success Response
```
{
    "posterUrl": "https://m.media-amazon.com/images/M/MV5BYzg0NGM2NjAtNmIxOC00MDJmLTg5ZmYtYzM0MTE4NWE2NzlhXkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_SX300.jpg"
}
```

#### Movie Not Found Response `404`
```
{
    "message": "The movie title could not be found."
}
```

## POST Movie Titles to Favorite List

Method: `POST`

Headers: `Authorization: [TOKEN]`

Body: 
```
{
    "title": "Baby Driver"
}
```

Endpoint: `/movies/favorite`

Example:
```
http://localhost:8080/movies/favorite
```

#### Response
```
{
    "message": "Favorite movie added!"
}
```

## GET All Favorite Movies

Method: `GET`

Headers: `Authorization: [TOKEN]`

Endpoint: `/movies/favorite`

Example:
```
http://localhost:8080/movies/favorite
```

#### Response
```
{
    "message": "Fetched favorite movies success!",
    "posterUrl": {
        "url": [
            "https://m.media-amazon.com/images/M/MV5BYzg0NGM2NjAtNmIxOC00MDJmLTg5ZmYtYzM0MTE4NWE2NzlhXkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_SX300.jpg",
            "https://m.media-amazon.com/images/M/MV5BMjM3MjQ1MzkxNl5BMl5BanBnXkFtZTgwODk1ODgyMjI@._V1_SX300.jpg",
        ]
    }
}
```
