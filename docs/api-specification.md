# Receipt of Waste - draft API specification

!!! Note "Private Beta"
    Are you a waste receiver or software provider and want to get involved? [Sign up for our Digital Waste Tracking Private Beta test](private-beta-comms-sign-up.md)

> These APIs are a draft. They may be updated to reflect changes to policy, legislation and user feedback.

We are designing waste tracking APIs to be flexible and accommodate differences in business processes, allowing for:

- separate submission of waste collection and receipt data, whilst maintaining a connection between the two
- differences in data requirements
- data to be submitted in any order (e.g. receipt before collection)

##Draft Open API specifications
The following draft specifications are all published on the Swagger API hub:

- [receiving waste onto a site](https://defra.github.io/waste-tracking-service/apiSpecifications/index.html)

[![image](defra-spec.png)](defra-spec.png)

## API Testing and Examples

Bruno has been selected as our preferred API testing and documentation tool, following [GOV.UK API technical and data standards](https://www.gov.uk/guidance/gds-api-technical-and-data-standards#test-your-assumptions-with-users) for providing test services and living documentation.

### What is Bruno?

Bruno is a software tool that helps developers test and interact with our waste tracking APIs. Think of it as a specialised testing environment where developers can try out different API features, check that everything works correctly, and share their testing setup with their team. It's designed to work across different stages of development, from initial testing to production use.

### Our Bruno Collection

We provide a comprehensive Bruno collection that includes:
- **Digital Waste Tracking External API** - Complete API testing collection
- **OAuth2 Authentication** - Pre-configured client credentials flow
- **Waste Movement Creation** - Test creating new waste movements
- **Movement Updates** - Test updating received waste movements
- **Multiple Test Scenarios** - Success, warning, and error test cases
- **Environment Configurations** - External test and Production environment configuration
- **Comprehensive Documentation** - Step-by-step setup and usage instructions

### Getting Started with Bruno

1. **Install Bruno**: Download the free open source software from [their site](https://www.usebruno.com/) or from [Github](https://github.com/usebruno/bruno/releases)
2. **Import our collection**: The Bruno collection is located in the repository at `docs/bruno/digitalWasteTrackingExternalAPI/`
3. **Configure environment**: Set up your environment variables and OAuth2 credentials
4. **Set up authentication**: Configure OAuth2 client credentials flow

### Using the Collection

- **Test individual endpoints**: Use the collection to test specific API calls
- **Validate responses**: Compare responses against expected schemas
- **Debug issues**: Use Bruno's debugging tools to troubleshoot API problems
- **Share with team**: Export and share test results with your development team
- **OAuth2 Integration**: Automatic token management and refresh

!!! Note "Bruno Collection Available"
    The Bruno collection is now available in the repository at [docs/bruno/digitalWasteTrackingExternalAPI](https://github.com/DEFRA/waste-tracking-service/tree/main/docs/bruno/digitalWasteTrackingExternalAPI). 
    See the [README](bruno/digitalWasteTrackingExternalAPI/EXPORT-README.md) for detailed setup instructions.

<br/>Page last updated on 15 August 2025.
