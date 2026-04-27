[← Back to Top](README.md){ .md-button }

# Digital Waste Tracking API Terms Of Service

## Terms of Service for Software Services Integrating with the Digital Waste Tracking Receipt of Waste API

### Introduction

This document outlines the terms and conditions for developers and organisations creating software services (referenced below as Software developers) that consume the Digital Waste Tracking (DWT) API. By accessing or using the API, you agree to comply with these terms and all applicable laws and regulations.

### Purpose

The DWT API is designed to support the UK’s transition to a circular economy and to help tackle waste crime by enabling accurate, and timely submission of data on waste movements. Your software must contribute to this goal by ensuring data integrity, compliance, and transparency.

### Eligibility and Access

- You must register and obtain appropriate credentials before using the API.

- Only authorised users may access the production API environment; access to the sandbox environment is available for testing.

- Before accessing the production API environment, software developers are expected to review the technical documentation in full to ensure that you have integrated as per the technical specification. 



### Software Developers' Responsibilities

You must:

- **Ensure alignment with the API specification:** This will ensure validation of the submitted waste tracking data.
- **Understand that GET endpoint code descriptions** are designed to help software developers cross-reference the codes for there own internal use, and not for use on User Interfaces (UIs).

- **Understand that warning and error messages** are designed to help software developers with there own internal use, and not for use on User Interfaces (UIs).

- **Maintain Security:** Implement robust security measures including OAuth 2.0 authentication, encryption, and secure storage of credentials.

- **Avoid Client-Side API Calls:** The API does not support CORS; do not attempt to call it directly from browser-based applications.

- **Support your users and customers:** Ensure your software supports your users in meeting their legal obligations.

- **Handle reaching the service rate limits:** If the limit is reached (indicated by a 429 response code) handle the response using best development practices like exponential back-offs and retries.

- **Be aware of accessibility standards** that may apply to the software that you supply [W3C Accessibility Standards Overview](https://www.w3.org/WAI/standards-guidelines/) | [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/standards-guidelines/) | [W3C](https://www.w3.org/WAI/standards-guidelines/)

- **Hold the master copy of data:** The API must not be relied on as a copy or source of waste tracking data.

- **Allow your  users and customers to change, export or delete their data** if they want to. 

- **Exemptions:** you must clearly communicate with your users and customers any PAT exemptions you have been granted and the effects those exemptions have on the services you are able to provide. 

### Our Responsibilities

We will:

- Aim to minimise changes to the API; keep to those which are essential and provide notification and where possible some advance notice.

- Make sure any minor changes made to APIs are backwards compatible.

- Warn you before we retire an API.

- Provide a robust test environment.

### Data Usage and Privacy

- All data submitted via the API must be handled in accordance with UK data protection laws.

- Data containing personally identifiable information (e.g. names and contact details) must only ever be submitted to the production API environment, never to any test API environment.

- You must not misuse or repurpose data obtained through the API for unauthorised commercial or analytical purposes.

- You cannot advertise your software as ‘Defra accredited’, ‘Defra endorsed’, ‘Defra certified’, ‘Defra approved’ or similar.

- You cannot use our Defra brand in any way including logo placement on your application.

### Publication  

Defra will publish and keep up to date a list of commercially available software providers (and products) that have successfully integrated with the DWT API which will be published on gov.uk.  

This list will be reviewed and updated fortnightly. 

### Enforcement and Penalties

- Defra will adopt an education-first approach to enforcement in regards to these terms.

- Continued non-compliance with these terms of use may result in temporary or permanent suspension of API access and removal from the published list as appropriate.

### Updates and Versioning

- Defra may update the API. You are responsible for ensuring your software remains compatible with the latest version.

- We may update these Terms of Use as our service evolves. Users will be notified of changes and may be required to re-accept the updated terms.

- Subscribe to Defra’s developer updates for notifications on changes and other information about the API implementation which can be found at DEFRA waste tracking service on [GitHub](https://github.com/DEFRA/waste-tracking-service).

## Termination

- Defra reserves the right to revoke access to the API at any time for breach of these terms or for operational reasons and to remove any listing from the published list as appropriate.

## Contact and Support

For technical support, integration queries, contact [Defra Waste Tracking Technical Support](mailto:WasteTracking_Developers@defra.gov.uk).

## Liability

- Defra cannot accept any responsibility for any loss, disruption or damage to your data or your computer system using the WTS API or if access to the service is revoked.

- You are responsible for any defaults, errors or omissions arising from the customer’s use of your service.  

You will indemnify Defra against any legal claims or actions that may arise when users and customers rely on your services or information published on the software developer list.

## User Data Protection

We are committed to ensuring that all personal and sensitive data handled through your software service is protected in accordance with UK data protection laws, including the UK GDPR and the Data Protection Act 2018.

As a software developer or operator of a service consuming the Defra Digital Waste Tracking API, you must:

- **Implement Appropriate Safeguards:** Use encryption, access controls, and secure storage to protect user  and customer data both in transit and at rest.

- **Minimise Data Collection:** Only collect and process data that is strictly necessary for the operation of your service and compliance with waste tracking regulations.

- **Obtain Consent Where Required:** Ensure that users and customers are informed about how their data will be used and obtain explicit consent where necessary.

- **Provide Transparency:** Maintain a clear and accessible privacy policy that outlines your data handling practices, including retention periods and third-party sharing.

- **Support Data Subject Rights:** Enable users to exercise their rights under UK GDPR, including access, rectification, erasure, and objection to processing.

- **Report Breaches Promptly:** In the event of a data breach involving personal data obtained via the API, notify the Information Commissioner’s Office (ICO), [Defra Security Team](mailto:security.team@defra.gov.uk) and affected individuals as required by law.

    Failure to comply with these obligations may result in suspension of API access.<br><br>
**Communication with your users and customers** 

    You are encouraged to take responsibility for keeping your users and customers up to date with your implementation timescales and progress to aid their planning and adoption. 

### Reference Material

Terms of use -[Defra API Developer Portal - GOV.UK](https://developer-portal.trade.defra.gov.uk/documentation/terms-of-use)

Also HMRC Terms Of Use - [HMRC Developer Hub - GOV.UK](https://developer.service.hmrc.gov.uk/api-documentation/docs/terms-of-use#introduction)<br><br>

## Changelog

You can find the changelog for this document in the [Receipt API v1.0 Terms of Service](https://github.com/DEFRA/waste-tracking-service/wiki/Terms-of-Service-Changelog) GitHub wiki.


Page last updated on April 27th 2026

