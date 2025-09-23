# Receipt of Waste - API authentication guide

The process of using the API involves two steps. First using the client id and secret to be granted an access token, and second using the access token to use the API. The following Python snippet provide an example of doing this with the Python requests library.

##Get a Cognito Token
import requests <br/>
import base64 <br/>
def get_cognito_token(client_id, client_secret, token_url):<br/>
client_credentials = f"{client_id}:{client_secret}"<br/>
encoded_credentials = base64.b64encode(client_credentials.encode()).decode() <br/>
headers = { "Authorization": f"Basic {encoded_credentials}", "Content-Type": "application/x-www-form-urlencoded" }<br/>
payload = { "grant_type": "client_credentials", "client_id": client_id, "client_secret": client_secret, }<br/>
response = requests.post(f"{token_url}/oauth2/token", headers=headers, data=payload) <br/>
response.raise_for_status() <br/>
token_response = response.json() <br/>
return token_response["access_token"] <br/>

##Use a Cognito Token
import requests def make_api_request(access_token, api_url): <br/>
headers = { "Authorization": f"Bearer {access_token}" } <br/>
response = requests.get(api_url, headers=headers)<br/>
response.raise_for_status() <br/>
return response.json() <br/>

##What are the login URLs for my API?
https://waste-movement-external-api-8ec5c.auth.eu-west-2.amazoncognito.com/oauth2/token

<br/>Page last updated on 19 September 2025.

