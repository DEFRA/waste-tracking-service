# Receipt of Waste - API authentication Note

To start using the Receipt API, you need your Client ID and Secret which you should have received via email. You will need this to apply to the OAuth service for an access/bearer token. The diagram below shows the authentication flow:
```mermaid
sequenceDiagram
    participant Third Party Software
    participant OAuth
    participant Receipt API

    Third Party Software->>OAuth: Client ID + Secret
    OAuth-->>Third Party Software: Bearer Token

    Third Party Software->>Receipt API: POST Receipt API + Bearer Token
    Receipt API -->>Third Party Software: Result of Waste Movement Request (Success/Failure)
```
This process involves two steps: 

1. Submit the client id and secret to the OAuth service to be granted an access token. See the python code snippet below.

![alt text](https://github.com/DEFRA/waste-tracking-service/blob/DWT-492_sept15_review/changelog/Get_a_cognito_token.png)

2. Submit the access/bearer token to use the API. See the python code snippet below.

![alt text](https://github.com/DEFRA/waste-tracking-service/blob/DWT-492_sept15_review/changelog/Use_a_cognito_token.png)

##What are the login URLs for my API?

https://waste-movement-external-api-8ec5c.auth.eu-west-2.amazoncognito.com/oauth2/token

<br/>Page last updated on 23 September 2025.
