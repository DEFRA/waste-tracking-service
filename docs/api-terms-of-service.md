# Digital Waste Tracking API Terms of Service

## Terms of Service for Software Services Integrating with the Digital Waste Tracking Receipt of Waste API

### Introduction

This document outlines the terms and conditions for software providers and organisations creating software services that consume the Digital Waste Tracking (DWT) API. In this document, they are referred to as **software providers**.

By accessing or using the API, you agree to comply with these terms and all applicable laws and regulations.

### Purpose

The DWT API is designed to support the UK's transition to a circular economy and help tackle waste crime by enabling accurate and timely submission of data on waste movements. Your software must contribute to this goal by ensuring data integrity, compliance and transparency.

### Eligibility and access

- You must register and obtain appropriate credentials before using the API.
- Only authorised users may access the production API environment. Access to the sandbox environment is available for testing.
- Before accessing the production API environment, software providers are expected to review the technical documentation in full to ensure they have integrated in accordance with the technical specification.

### Software providers' responsibilities

You must:

- **Ensure alignment with the API specification:** This will ensure validation of submitted waste tracking data.
- **Complete self-verification testing:** Before requesting production environment credentials, test your software against the published Production Approval Testing (PAT) scenarios and confirm, based on your own assessment, that the results meet the specified information requirements set out in Schedule 1 to the Digital Waste Tracking (England) Regulations 2026 (S.I. 2026/729). Defra's issue of production credentials does not constitute testing, marking, certification, endorsement or approval of your software, and must not be represented as such in any marketing material, customer communication or other public statement.
- **Understand that GET endpoint code descriptions** are designed to help software providers cross-reference codes for their own internal use and are not for use on user interfaces.
- **Understand that warning and error messages** are designed to help software providers with their own internal use and are not for use on user interfaces.
- **Maintain security:** Implement robust security measures, including OAuth 2.0 authentication, encryption and secure storage of credentials.
- **Avoid client-side API calls:** The API does not support CORS. Do not attempt to call it directly from browser-based applications.
- **Support your users and customers:** Ensure your software supports users in meeting their legal obligations.
- **Handle service rate limits:** If the limit is reached, indicated by a `429` response code, handle the response using appropriate development practices such as exponential back-off and retries.
- **Be aware of accessibility standards** that may apply to the software you supply. Refer to the [W3C accessibility standards overview](https://www.w3.org/WAI/standards-guidelines/).
- **Hold the master copy of data:** The API must not be relied on as a copy or source of waste tracking data.
- **Allow your users and customers to change, export or delete their data** if they want to.
- **PAT results:** Clearly communicate your PAT self-assessment results to users and customers, including any scenario your software does not pass or support and the effect this has on the services you can provide. No exemption, waiver or other dispensation from a failed PAT scenario is available from Defra. A failed result remains a failed result regardless of the reason for the failure.

### Ongoing compliance

Production access is granted based on your ongoing compliance with these terms, not as a one-off gate passed during onboarding.

You must:

- re-run the published PAT scenarios following any release, update or other material change to your software that could affect its ability to capture, validate or transmit specified information, to confirm that your software continues to meet the requirements
- retain your own records of self-verification testing, including the date, scenario tested and outcome, for as long as your software remains in use, as evidence of the basis on which credentials were issued and continued
- notify Defra of any material change to your software that could affect its ability to capture specified information, using the contact details in this document

Defra may request evidence of your most recent self-verification testing at any time. Continued non-compliance may result in suspension or removal from the published list, in accordance with the Enforcement and penalties section.

### End user responsibilities

Where your software is used by operators of permitted facilities, referred to as **waste receivers**, to meet their obligations under regulation 4 of the Digital Waste Tracking (England) Regulations 2026 (S.I. 2026/729), you must make it clear to those customers, in a durable and readily accessible form, that:

- they are responsible for their own due diligence when selecting software that captures and transmits the specified information required by Schedule 1 to the Regulations
- they are responsible for satisfying themselves, including by reference to your self-certification testing results, that your software meets those requirements
- Defra's issue of production credentials to you is not confirmation by Defra that your software is compliant and cannot be relied upon by customers as such
- responsibility for complying with regulation 4, and liability for any failure to do so, including under regulations 16 and 19 and Schedule 2 of the Regulations, rests with the waste receiver as the regulated operator, regardless of any limitation, gap or defect in the software they have chosen to use
- any known limitation, gap or untested scenario in your software must be communicated clearly enough to allow them to make an informed decision about their own compliance

### Our responsibilities

We will:x

- aim to minimise changes to the API, limit changes to those that are essential and provide notification and, where possible, advance notice
- ensure that minor API changes are backwards compatible
- warn you before we retire an API
- provide a robust test environment

### Data usage and privacy

- All data submitted through the API must be handled in accordance with UK data protection laws.
- Data containing personally identifiable information, such as names and contact details, must only be submitted to the production API environment and never to a test API environment.
- You must not misuse or repurpose data obtained through the API for unauthorised commercial or analytical purposes.
- You cannot advertise your software as "Defra accredited", "Defra endorsed", "Defra certified", "Defra approved" or similar.
- You cannot use the Defra brand in any way, including placing the Defra logo on your application.

### Publication

Defra will publish and maintain a list of commercially available software providers and products that have successfully integrated with the DWT API. This list will be published on GOV.UK and reviewed and updated fortnightly.

Inclusion on this list confirms that a software provider has technically integrated with the DWT API. It is not a statement by Defra that the provider's software:

- complies with the Regulations
- has passed PAT testing
- has been granted an exemption

You must not represent inclusion on the list as such.

### Enforcement and penalties

- Defra will adopt an education-first approach to enforcing these terms.
- Continued non-compliance with these terms may result in temporary or permanent suspension of API access and removal from the published list, as appropriate.

### Updates and versioning

- Defra may update the API. You are responsible for ensuring your software remains compatible with the latest version.
- We may update these terms as the service evolves. Users will be notified of changes and may be required to accept the updated terms again.
- Subscribe to Defra developer updates for notifications about API implementation changes and other information through the [Defra waste tracking service on GitHub](https://github.com/DEFRA/waste-tracking-service).

## Termination

Defra reserves the right to revoke access to the API at any time for breach of these terms or for operational reasons, and to remove any listing from the published list as appropriate.

## Contact and support

For technical support or integration queries, contact [Defra Waste Tracking Technical Support](mailto:WasteTracking_Developers@defra.gov.uk).

## Liability

- Defra cannot accept responsibility for any loss, disruption or damage to your data or computer system resulting from use of the DWT API or revocation of access to the service.
- You are responsible for any defaults, errors or omissions arising from your customers' use of your service.
- Waste receivers and other end users remain responsible, as the regulated party under the Regulations, for their own compliance with regulation 4 and for the due diligence exercised in selecting and continuing to use compliant software. This responsibility is not transferred to, or shared with, Defra because Defra issued production credentials to the software provider. It is not discharged by the software provider's self-verification testing.

You will indemnify Defra against any legal claims or actions that may arise when users and customers rely on your services or information published on the software providers list.

## User data protection

We are committed to ensuring that all personal and sensitive data handled through your software service is protected in accordance with UK data protection laws, including the UK GDPR and the Data Protection Act 2018.

As a software provider or operator of a service consuming the Defra DWT API, you must:

- **Implement appropriate safeguards:** Use encryption, access controls and secure storage to protect user and customer data in transit and at rest.
- **Minimise data collection:** Only collect and process data that is strictly necessary for operating your service and complying with waste tracking regulations.
- **Obtain consent where required:** Ensure users and customers are informed about how their data will be used and obtain explicit consent where necessary.
- **Provide transparency:** Maintain a clear and accessible privacy policy outlining your data handling practices, including retention periods and third-party sharing.
- **Support data subject rights:** Enable users to exercise their rights under UK GDPR, including access, rectification, erasure and objection to processing.
- **Report breaches promptly:** If a data breach involves personal data obtained through the API, notify the Information Commissioner's Office, the [Defra Security Team](mailto:security.team@defra.gov.uk) and affected individuals as required by law.

Failure to comply with these obligations may result in suspension of API access.

### Communication with your users and customers

You are encouraged to keep users and customers informed about your implementation timescales and progress to support their planning and adoption.

## Changelog

You can find the changelog for this document in the [Receipt API v1.0 Terms of Service GitHub wiki](https://github.com/DEFRA/waste-tracking-service/wiki/Terms-of-Service-Changelog).

Page last updated on 09 October 2026.
