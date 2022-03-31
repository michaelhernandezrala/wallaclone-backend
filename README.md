# Wallaclone-Backend

## Installation of dependencies

` npm install `

## Configuration

Review lib/connectMongoose.js to set database configuration

## Init database 

Initialize the DB with 8 default ads

` npm run initDB `

## Start

To start a single instance:

` npm start `

To start in development mode (including nodemon and debug log)

` npm run dev` 

The default port is 3000

## API info 

### Base Path

The API can be used with the path: API

### GET api/adverts
    {
        "results": [
            {
                "_id": "6218ffdc4948dc90754eea9c",
                "name": "Guitarra",
                "sale": false,
                "price": 150,
                "tags": [
                    "lifestyle",
                    "work"
                ],
                "photo": ""
            },
    }  

### GET /api/new-advert/tags

Return the list of available tags for the ads

    {
        "result": [
            "lifestyle",
            "mobile",
            "motor",
            "work"
        ]
    }
