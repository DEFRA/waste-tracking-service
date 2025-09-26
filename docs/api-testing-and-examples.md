# API Testing and Examples

Bruno has been selected as our preferred API testing documentation tool, following [GOV.UK API technical and data standards](https://www.gov.uk/guidance/gds-api-technical-and-data-standards#test-your-assumptions-with-users) for providing test services and living documentation.

## What is Bruno?

Bruno is an opensource software tool that helps developers test and interact with our waste tracking APIs. Think of it as a specialised testing environment where developers can try out different API features, check that everything works correctly, and share their testing setup with their team. It's designed to work across different stages of development, from initial testing to production use.

## Our Bruno Collection

We provide a comprehensive Bruno collection that includes:

- **Digital Waste Tracking External API** - Complete API testing collection
- **OAuth2 Authentication** - Pre-configured client credentials flow
- **Waste Movement Creation** - Test creating new waste movements
- **Movement Updates** - Test updating received waste movements
- **Multiple Test Scenarios** - Success, warning, and error test cases
- **Environment Configurations** - External test and Production environment configuration
- **Comprehensive Documentation** - Step-by-step setup and usage instructions

## Getting Started with Bruno

1. **Install Bruno**: Download the free open source software from [their site](https://www.usebruno.com/) or from [Github](https://github.com/usebruno/bruno/releases)
2. **Open our collection**: The Bruno collection is located in the repository at `docs/bruno/digitalWasteTrackingExternalAPI/`, use the "Open" funcationality in Bruno to view it.
3. **Configure environment**: Set up your environment variables and OAuth2 credentials
4. **Make a request**: Run the POST Request "Receive Movement - Basic Required Fields Only" as a starting point, it should return a successful response code and a globalMovementId.

## Using the Collection

- **Test individual endpoints**: Use the collection to test specific API calls
- **Validate responses**: Compare responses against expected schemas
- **Debug issues**: Use Bruno's debugging tools to troubleshoot API problems
- **Share with team**: Export and share test results with your development team
- **OAuth2 Integration**: Automatic token management and refresh

!!! Note "Bruno Collection Available"
    The Bruno collection is available in the repository at [docs/bruno/digitalWasteTrackingExternalAPI](https://github.com/DEFRA/waste-tracking-service/tree/main/docs/bruno/digitalWasteTrackingExternalAPI).

Page last updated on 26 September 2025.
