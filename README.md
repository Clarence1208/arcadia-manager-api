#  ARCADIA MANAGER API

## About the app

    This API allows the creation and management of arcadia-solutions websites 
    When creating a website, a script is run to create: 
            - a database with a superAdmin according to the info given
            - a front
            - a domain name
    You also create an account on the website to access the admin panel later on.
    You can check the heath of your website there and delete it. 


## Installing the app
    Run cp .env.exemple  .env and modify it
    Run docker-compose up --build

    The app is accessible at localhost:3000/
    The phpmyadmin is accessible at localhost:8080/

## Testing the app (POSTMAN)
    A postman collection json file is at the root.

### Authors :
    - Loriane HILDERAL
    - Clarence HIRSCH
    - Nino PLANE