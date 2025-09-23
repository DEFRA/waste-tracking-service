# Receipt of Waste - API authentication Note

To start using the Receipt API, you need your Client ID and Secret which you should have received via email. You will need this to apply to the OAuth service for an access/bearer token. 

This process involves two steps: 

<ol>
    <li>Submit the client id and secret to the OAuth service to be granted an access token. See the python code snippet below.

```python
import requests  #use requests library
import base64 
def get_cognito_token(client_id, client_secret, token_url): # your clientID, Client Secret and OAuth URL here 
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
<li>Submit the access/bearer token to use the API. See the python code snippet below.
##Use a Cognito Token

```python
import requests 
def make_api_request(access_token, api_url): 
    headers = { "Authorization": f"Bearer {access_token}" } 
    response = requests.get(api_url, headers=headers)
    response.raise_for_status() 
    return response.json() 
```
</li>
</ol>
##What are the login URLs for my API?

https://waste-movement-external-api-8ec5c.auth.eu-west-2.amazoncognito.com/oauth2/token

<br/>Page last updated on 23 September 2025.
