# Receipt of Waste - API Authentication Guide

To start using the Receipt API, you need your Client ID and Secret which you should have received via email. You will need this to apply to the OAuth service for an access token. 

This process involves two steps: 
<ol>
    <li>Submit the client id and secret to the OAuth service to be granted an access token.

```python
import requests  #use requests library
import base64 
def get_cognito_token(client_id, client_secret, token_url): # your clientID, Client Secret and OAuth URL
    client_credentials = f"{client_id}:{client_secret}"
    encoded_credentials = base64.b64encode(client_credentials.encode()).decode() 
    headers = { "Authorization": f"Basic {encoded_credentials}", "Content-Type": "application/x-www-form-urlencoded" }
    payload = { "grant_type": "client_credentials", "client_id": client_id, "client_secret": client_secret, }
    response = requests.post(f"{token_url}/oauth2/token", headers=headers, data=payload) 
    response.raise_for_status() 
    token_response = response.json() 
    return token_response["access_token"]
```
</li>
<li>Submit the access/bearer token to use the API. 

```python
import requests 
def make_api_request(access_token, api_url): # your access token and the api url here
    headers = { "Authorization": f"Bearer {access_token}" } 
    response = requests.get(api_url, headers=headers)
    response.raise_for_status() 
    return response.json() 
```
</li>
</ol>
Sequence Diagram for Authentication Flow

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mermaid Diagram Example</title>
    <!-- Load Mermaid from CDN -->
    <script type="module">
        import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
        // Initialize Mermaid
        mermaid.initialize({ startOnLoad: true });
    </script>
</head>
<body>
    <h2>Authentication sequence diagram</h2>
    <div class="mermaid">

 sequenceDiagram
    participant Third Party Software
    participant OAuth
    participant Receipt API
    Third Party Software->>OAuth: Client ID + Secret
    OAuth-->>Third Party Software: Bearer Token
    Third Party Software->>Receipt API: POST Receipt API + Bearer Token
    Receipt API -->>Third Party Software: Result of Waste Movement Request (Success/Failure)
    </div>
</body>
</html>

## What is the OAuth login URL for my API?

```code
Production: https://waste-movement-external-api-75ee2.auth.eu-west-2.amazoncognito.com

Test: https://waste-movement-external-api-8ec5c.auth.eu-west-2.amazoncognito.com 
```

## Testing your credentials
You can test your credentials using the following Curl commands. If the Curl command returns an error, your credentials were entered incorrectly. If the command returns an access token then your credentials are correct.

Two Curl commands and python examples are provided, one for the production environment and one for the test environment.

Replace `$CLIENTID` with your client ID and replace `$CLIENTSECRET` with your client secret.

### Production Environment

```curl
curl --request POST 
--url https://waste-movement-external-api-75ee2.auth.eu-west-2.amazoncognito.com/oauth2/token 

--user "$CLIENTID:$CLIENTSECRET" 

--header 'Content-Type: application/x-www-form-urlencoded' 

--data 'grant_type=client_credentials'

```

### Test Environment

```curl
curl --request POST 
--url https://waste-movement-external-api-8ec5c.auth.eu-west-2.amazoncognito.com/oauth2/token 

-user "$CLIENTID:$CLIENTSECRET" 

--header 'Content-Type: application/x-www-form-urlencoded' 

--data 'grant_type=client_credentials'

```

### Python Examples

**Production Environment**

```python
import requests

def get_access_token(client_id, client_secret):
    response = requests.post(
        "https://waste-movement-external-api-75ee2.auth.eu-west-2.amazoncognito.com/oauth2/token",
        auth=(client_id, client_secret),
        headers={
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data={
            "grant_type": "client_credentials"
        }
    )

    response.raise_for_status()

    token_response = response.json()

    return token_response["access_token"]


# Example usage
access_token = get_access_token(
    "your-client-id",
    "your-client-secret"
)

print(access_token)

```

**Test Environment**

```python
import requests

def get_access_token(client_id, client_secret):
    response = requests.post(
        "https://waste-movement-external-api-8ec5c.auth.eu-west-2.amazoncognito.com/oauth2/token",
        auth=(client_id, client_secret),
        headers={
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data={
            "grant_type": "client_credentials"
        }
    )

    response.raise_for_status()

    token_response = response.json()

    return token_response["access_token"]


# Example usage
access_token = get_access_token(
    "your-client-id",
    "your-client-secret"
)

print(access_token)

```
<br>Page last updated on October 21st 2026.
