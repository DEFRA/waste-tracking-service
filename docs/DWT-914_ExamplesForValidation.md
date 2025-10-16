# Examples of Request and Response Messages Used in the Receipt of Waste API.


## POST request - Create Waste Movement - happy path 

curl --request POST \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/movements/receive \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA' \
  --header 'content-type: application/json' \
  --data '{
  "organisationApiId": "b74cbf3c-e9e2-43f3-bd6b-009d37a8d677",
  "dateTimeReceived": "2025-10-15T11:05:05.310Z",
  "reasonForNoConsignmentCode": "Carrier did not provide documentation",d
  "wasteItems": [
    {
      "ewcCodes": [
        "200121"
      ],
      "wasteDescription": "Industrial waste containing persistent organic pollutants (POPs) and hazardous heavy metals from decommissioned electrical equipment and contaminated soil",
      "physicalForm": "Mixed",
      "numberOfContainers": 15,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.2,
        "isEstimate": true
      },
      "pops": {
        "containsPops": true,
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Chlordane",
            "concentration": 250
          },
          {
            "name": "Toxaphene",
            "concentration": 156.4
          },
          {
            "name": "Dicofol",
            "concentration": 0.8
          },
          {
            "name": "DDT",
            "concentration": 1.2
          }
        ]
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_1",
          "HP_3",
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Mercury",
            "concentration": 0.35
          },
          {
            "name": "Arsenic",
            "concentration": 300
          },
          {
            "name": "Chromium",
            "concentration": 0.42
          },
          {
            "name": "Lead",
            "concentration": 0.89
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    },
    {
      "ewcCodes": [
        "150110"
      ],
      "wasteDescription": "Secondary waste containing plastic packaging and minor contaminants",
      "physicalForm": "Solid",
      "numberOfContainers": 5,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.1,
        "isEstimate": true
      },
      "pops": {
        "containsPops": false,
        "sourceOfComponents": "NOT_PROVIDED"
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Arsenic",
            "concentration": 75
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    }
  ],
  "carrier": {
    "organisationName": "Carrier Ltd",
    "registrationNumber": "CBDL999999",
    "address": {
      "fullAddress": "321 Test Street, Test City",
      "postcode": "TC2 2CD"
    },
    "emailAddress": "test@carrier.com",
    "phoneNumber": "01234567890",
    "meansOfTransport": "Road",
    "vehicleRegistration": "AB12 CDE"
  },
  "receiver": {
    "organisationName": "Receiver Ltd",
    "emailAddress": "receiver@test.com",
    "phoneNumber": "01234567890",
    "authorisationNumbers": [
      "PPC/A/9999999",
      "PPC/A/SEPA9999-9999"
    ],
    "regulatoryPositionStatements": [
      123,
      456
    ]
  },
  "receipt": {
    "address": {
      "fullAddress": "123 Test Street, Test City",
      "postcode": "TC1 2AB"
    }
  }
}'

response 

{
    "statusCode": 200,
    "globalMovementId": "25BT6FOP"
}

## POST request - Create Waste Movement - error - missing required fields

curl --request POST \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/movements/receive \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA' \
  --header 'content-type: application/json' \
  --data '{
  "organisationApiId": "b74cbf3c-e9e2-43f3-bd6b-009d37a8d677",
  "dateTimeReceived": "2025-10-15T11:07:09.939Z",
  "reasonForNoConsignmentCode": "Carrier did not provide documentation",
  "wasteItems": [
    {
      "ewcCodes": [
        "200121"
      ],
      "wasteDescription": "Industrial waste containing persistent organic pollutants (POPs) and hazardous heavy metals from decommissioned electrical equipment and contaminated soil",
      "physicalForm": "Mixed",
      "numberOfContainers": 15,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 0,
        "isEstimate": true
      },
      "pops": {
        "containsPops": true,
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Chlordane",
            "concentration": 250
          },
          {
            "name": "Toxaphene",
            "concentration": 156.4
          },
          {
            "name": "Dicofol",
            "concentration": 0.8
          },
          {
            "name": "DDT",
            "concentration": 1.2
          }
        ]
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_1",
          "HP_3",
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Mercury",
            "concentration": 0.35
          },
          {
            "name": "Arsenic",
            "concentration": 300
          },
          {
            "name": "Chromium",
            "concentration": 0.42
          },
          {
            "name": "Lead",
            "concentration": 0.89
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    },
    {
      "ewcCodes": [
        "150110"
      ],
      "wasteDescription": "Secondary waste containing plastic packaging and minor contaminants",
      "physicalForm": "Solid",
      "numberOfContainers": 5,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.1,
        "isEstimate": true
      },
      "pops": {
        "containsPops": false,
        "sourceOfComponents": "NOT_PROVIDED"
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Arsenic",
            "concentration": 75
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    }
  ],
  "carrier": {
    "organisationName": "Carrier Ltd",
    "registrationNumber": "CBDL999999",
    "address": {
      "fullAddress": "321 Test Street, Test City",
      "postcode": "TC2 2CD"
    },
    "emailAddress": "test@carrier.com",
    "phoneNumber": "01234567890",
    "meansOfTransport": "Road",
    "vehicleRegistration": "AB12 CDE"
  },
  "receiver": {
    "organisationName": "Receiver Ltd",
    "emailAddress": "receiver@test.com",
    "phoneNumber": "01234567890",
    "authorisationNumbers": [
      "PPC/A/9999999",
      "PPC/A/SEPA9999-9999"
    ],
    "regulatoryPositionStatements": [
      123,
      456
    ]
  },
  "receipt": {
    "address": {
      "fullAddress": "123 Test Street, Test City",
      "postcode": "TC1 2AB"
    }
  }
}'

response 

{
    "validation": {
      "errors": [
        {
          "key": "wasteItems.0.weight.amount",
          "errorType": "UnexpectedError",
          "message": "\"wasteItems[0].weight.amount\" must be a positive number"
        }
      ]
    }
}

## POST request - Create Waste Movement - warning

curl --request POST \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/movements/receive \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA' \
  --header 'content-type: application/json' \
  --data '{
  "organisationApiId": "b74cbf3c-e9e2-43f3-bd6b-009d37a8d677",
  "dateTimeReceived": "2025-10-15T11:08:54.108Z",
  "reasonForNoConsignmentCode": "Carrier did not provide documentation",
  "wasteItems": [
    {
      "ewcCodes": [
        "200121"
      ],
      "wasteDescription": "Industrial waste containing persistent organic pollutants (POPs) and hazardous heavy metals from decommissioned electrical equipment and contaminated soil",
      "physicalForm": "Mixed",
      "numberOfContainers": 15,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.4,
        "isEstimate": true
      },
      "pops": {
        "containsPops": true,
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Chlordane"
          },
          {
            "name": "Toxaphene",
            "concentration": 156.4
          },
          {
            "name": "Dicofol",
            "concentration": 0.8
          },
          {
            "name": "DDT",
            "concentration": 1.2
          }
        ]
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_1",
          "HP_3",
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Mercury",
            "concentration": 0.35
          },
          {
            "name": "Arsenic",
            "concentration": 300
          },
          {
            "name": "Chromium",
            "concentration": 0.42
          },
          {
            "name": "Lead",
            "concentration": 0.89
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    },
    {
      "ewcCodes": [
        "150110"
      ],
      "wasteDescription": "Secondary waste containing plastic packaging and minor contaminants",
      "physicalForm": "Solid",
      "numberOfContainers": 5,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.1,
        "isEstimate": true
      },
      "pops": {
        "containsPops": false,
        "sourceOfComponents": "NOT_PROVIDED"
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Arsenic",
            "concentration": 75
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    }
  ],
  "carrier": {
    "organisationName": "Carrier Ltd",
    "registrationNumber": "CBDL999999",
    "address": {
      "fullAddress": "321 Test Street, Test City",
      "postcode": "TC2 2CD"
    },
    "emailAddress": "test@carrier.com",
    "phoneNumber": "01234567890",
    "meansOfTransport": "Road",
    "vehicleRegistration": "AB12 CDE"
  },
  "receiver": {
    "organisationName": "Receiver Ltd",
    "emailAddress": "receiver@test.com",
    "phoneNumber": "01234567890",
    "authorisationNumbers": [
      "PPC/A/9999999",
      "PPC/A/SEPA9999-9999"
    ],
    "regulatoryPositionStatements": [
      123,
      456
    ]
  },
  "receipt": {
    "address": {
      "fullAddress": "123 Test Street, Test City",
      "postcode": "TC1 2AB"
    }
  }
}'

response

{
    "statusCode": 200,
    "globalMovementId": "25IYSV0P",
    "validation": {
      "warnings": [
        {
          "key": "wasteItems.0.pops.components.0.concentration",
          "errorType": "NotProvided",
          "message": "wasteItems[0].pops.components[0].concentration is recommended when source of components is one of CARRIER_PROVIDED, GUIDANCE, OWN_TESTING"
        }
      ]
    }
}

## PUT request - Update Waste Movement - happy path

curl --request PUT \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/movements/25IYSV0P/receive \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA' \
  --header 'content-type: application/json' \
  --data '{
  "organisationApiId": "b74cbf3c-e9e2-43f3-bd6b-009d37a8d677",
  "dateTimeReceived": "2025-10-15T11:11:10.466Z",
  "hazardousWasteConsignmentCode": "SB1234567",
  "wasteItems": [
    {
      "ewcCodes": [
        "200121"
      ],
      "wasteDescription": "Industrial waste containing persistent organic pollutants (POPs) and hazardous heavy metals from decommissioned electrical equipment and contaminated soil",
      "physicalForm": "Mixed",
      "numberOfContainers": 15,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.2,
        "isEstimate": true
      },
      "pops": {
        "containsPops": true,
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Chlordane",
            "concentration": 250
          },
          {
            "name": "Toxaphene",
            "concentration": 156.4
          },
          {
            "name": "Dicofol",
            "concentration": 0.8
          },
          {
            "name": "DDT",
            "concentration": 1.2
          }
        ]
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_1",
          "HP_3",
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Mercury",
            "concentration": 0.35
          },
          {
            "name": "Arsenic",
            "concentration": 300
          },
          {
            "name": "Chromium",
            "concentration": 0.42
          },
          {
            "name": "Lead",
            "concentration": 0.89
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    }
  ],
  "carrier": {
    "organisationName": "Carrier Ltd",
    "registrationNumber": "CBDL999999",
    "meansOfTransport": "Rail"
  },
  "receiver": {
    "organisationName": "Receiver Ltd",
    "emailAddress": "receiver@test.com",
    "authorisationNumbers": [
      "PPC/A/9999999"
    ]
  },
  "receipt": {
    "address": {
      "fullAddress": "123 Test Street, Test City",
      "postcode": "TC1 2AB"
    }
  }
}'

response 

{
    "message": "Receipt movement updated successfully"
}

## PUT request - Update Waste Movement - error - missing required fields

curl --request PUT \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/movements/25IYSV0P/receive \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA' \
  --header 'content-type: application/json' \
  --data '{
  "organisationApiId": "b74cbf3c-e9e2-43f3-bd6b-009d37a8d677",
  "dateTimeReceived": "2025-10-15T11:12:01.397Z",
  "hazardousWasteConsignmentCode": "SB1234567",
  "wasteItems": [
    {
      "ewcCodes": [
        "200121"
      ],
      "wasteDescription": "Industrial waste containing persistent organic pollutants (POPs) and hazardous heavy metals from decommissioned electrical equipment and contaminated soil",
      "physicalForm": "Mixed",
      "numberOfContainers": 15,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.2
      },
      "pops": {
        "containsPops": true,
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Chlordane",
            "concentration": 250
          },
          {
            "name": "Toxaphene",
            "concentration": 156.4
          },
          {
            "name": "Dicofol",
            "concentration": 0.8
          },
          {
            "name": "DDT",
            "concentration": 1.2
          }
        ]
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_1",
          "HP_3",
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Mercury",
            "concentration": 0.35
          },
          {
            "name": "Arsenic",
            "concentration": 300
          },
          {
            "name": "Chromium",
            "concentration": 0.42
          },
          {
            "name": "Lead",
            "concentration": 0.89
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    }
  ],
  "carrier": {
    "organisationName": "Carrier Ltd",
    "registrationNumber": "CBDL999999",
    "meansOfTransport": "Rail"
  },
  "receiver": {
    "organisationName": "Receiver Ltd",
    "emailAddress": "receiver@test.com",
    "authorisationNumbers": [
      "PPC/A/9999999"
    ]
  },
  "receipt": {
    "address": {
      "fullAddress": "123 Test Street, Test City",
      "postcode": "TC1 2AB"
    }
  }
}'

response 

{
    "validation": {
      "errors": [
        {
          "key": "wasteItems.0.weight.isEstimate",
          "errorType": "NotProvided",
          "message": "\"wasteItems[0].weight.isEstimate\" is required"
        }
      ]
    }
  }

## PUT request - Update Waste Movement - warning

curl --request PUT \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/movements/25IYSV0P/receive \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA' \
  --header 'content-type: application/json' \
  --data '{
  "organisationApiId": "b74cbf3c-e9e2-43f3-bd6b-009d37a8d677",
  "dateTimeReceived": "2025-10-15T11:14:34.611Z",
  "hazardousWasteConsignmentCode": "SB1234567",
  "wasteItems": [
    {
      "ewcCodes": [
        "200121"
      ],
      "wasteDescription": "Industrial waste containing persistent organic pollutants (POPs) and hazardous heavy metals from decommissioned electrical equipment and contaminated soil",
      "physicalForm": "Mixed",
      "numberOfContainers": 15,
      "typeOfContainers": "SKI",
      "weight": {
        "metric": "Tonnes",
        "amount": 1.2,
        "isEstimate": true
      },
      "pops": {
        "containsPops": true,
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Chlordane"
          },
          {
            "name": "Toxaphene",
            "concentration": 156.4
          },
          {
            "name": "Dicofol",
            "concentration": 0.8
          },
          {
            "name": "DDT",
            "concentration": 1.2
          }
        ]
      },
      "hazardous": {
        "containsHazardous": true,
        "hazCodes": [
          "HP_1",
          "HP_3",
          "HP_6"
        ],
        "sourceOfComponents": "CARRIER_PROVIDED",
        "components": [
          {
            "name": "Mercury",
            "concentration": 0.35
          },
          {
            "name": "Arsenic",
            "concentration": 300
          },
          {
            "name": "Chromium",
            "concentration": 0.42
          },
          {
            "name": "Lead",
            "concentration": 0.89
          }
        ]
      },
      "disposalOrRecoveryCodes": [
        {
          "code": "R1",
          "weight": {
            "metric": "Tonnes",
            "amount": 0.75,
            "isEstimate": false
          }
        }
      ]
    }
  ],
  "carrier": {
    "organisationName": "Carrier Ltd",
    "registrationNumber": "CBDL999999",
    "meansOfTransport": "Rail"
  },
  "receiver": {
    "organisationName": "Receiver Ltd",
    "emailAddress": "receiver@test.com",
    "authorisationNumbers": [
      "PPC/A/9999999"
    ]
  },
  "receipt": {
    "address": {
      "fullAddress": "123 Test Street, Test City",
      "postcode": "TC1 2AB"
    }
  }
}'

response 

{
    "message": "Receipt movement updated successfully",
    "validation": {
      "warnings": [
        {
          "key": "wasteItems.0.pops.components.0.concentration",
          "errorType": "NotProvided",
          "message": "wasteItems[0].pops.components[0].concentration is recommended when source of components is one of CARRIER_PROVIDED, GUIDANCE, OWN_TESTING"
        }
      ]
    }
}

## GET EWC Codes 

curl --request GET \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/reference-data/ewc-codes \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA'

response 

[
    {
      "code": "010101",
      "isHazardous": false
    },
    {
      "code": "010102",
      "isHazardous": false
    },
    {
      "code": "010304",
      "isHazardous": true
    },
    {
      "code": "010305",
      "isHazardous": true
    },
    {
      "code": "010306",
      "isHazardous": false
    },
    {
      "code": "010307",
      "isHazardous": true
    },
    {
      "code": "010308",
      "isHazardous": false
    },
    {
      "code": "010309",
      "isHazardous": false
    },
    {
      "code": "010310",
      "isHazardous": true
    },
    {
      "code": "010399",
      "isHazardous": false
    },
    {
      "code": "010407",
      "isHazardous": true
    },
    {
      "code": "010408",
      "isHazardous": false
    },
    {
      "code": "010409",
      "isHazardous": false
    },
    {
      "code": "010410",
      "isHazardous": false
    },
    {
      "code": "010411",
      "isHazardous": false
    },
    {
      "code": "010412",
      "isHazardous": false
    },
    {
      "code": "010413",
      "isHazardous": false
    },
    {
      "code": "010499",
      "isHazardous": false
    },
    {
      "code": "010504",
      "isHazardous": false
    },
    {
      "code": "010505",
      "isHazardous": true
    },
    {
      "code": "010506",
      "isHazardous": true
    },
    {
      "code": "010507",
      "isHazardous": false
    },
    {
      "code": "010508",
      "isHazardous": false
    },
    {
      "code": "010599",
      "isHazardous": false
    },
    {
      "code": "020101",
      "isHazardous": false
    },
    {
      "code": "020102",
      "isHazardous": false
    },
    {
      "code": "020103",
      "isHazardous": false
    },
    {
      "code": "020104",
      "isHazardous": false
    },
    {
      "code": "020106",
      "isHazardous": false
    },
    {
      "code": "020107",
      "isHazardous": false
    },
    {
      "code": "020108",
      "isHazardous": true
    },
    {
      "code": "020109",
      "isHazardous": false
    },
    {
      "code": "020110",
      "isHazardous": false
    },
    {
      "code": "020199",
      "isHazardous": false
    },
    {
      "code": "020201",
      "isHazardous": false
    },
    {
      "code": "020202",
      "isHazardous": false
    },
    {
      "code": "020203",
      "isHazardous": false
    },
    {
      "code": "020204",
      "isHazardous": false
    },
    {
      "code": "020299",
      "isHazardous": false
    },
    {
      "code": "020301",
      "isHazardous": false
    },
    {
      "code": "020302",
      "isHazardous": false
    },
    {
      "code": "020303",
      "isHazardous": false
    },
    {
      "code": "020304",
      "isHazardous": false
    },
    {
      "code": "020305",
      "isHazardous": false
    },
    {
      "code": "020399",
      "isHazardous": false
    },
    {
      "code": "020401",
      "isHazardous": false
    },
    {
      "code": "020402",
      "isHazardous": false
    },
    {
      "code": "020403",
      "isHazardous": false
    },
    {
      "code": "020499",
      "isHazardous": false
    },
    {
      "code": "020501",
      "isHazardous": false
    },
    {
      "code": "020502",
      "isHazardous": false
    },
    {
      "code": "020599",
      "isHazardous": false
    },
    {
      "code": "020601",
      "isHazardous": false
    },
    {
      "code": "020602",
      "isHazardous": false
    },
    {
      "code": "020603",
      "isHazardous": false
    },
    {
      "code": "020699",
      "isHazardous": false
    },
    {
      "code": "020701",
      "isHazardous": false
    },
    {
      "code": "020702",
      "isHazardous": false
    },
    {
      "code": "020703",
      "isHazardous": false
    },
    {
      "code": "020704",
      "isHazardous": false
    },
    {
      "code": "020705",
      "isHazardous": false
    },
    {
      "code": "020799",
      "isHazardous": false
    },
    {
      "code": "030101",
      "isHazardous": false
    },
    {
      "code": "030104",
      "isHazardous": true
    },
    {
      "code": "030105",
      "isHazardous": false
    },
    {
      "code": "030199",
      "isHazardous": false
    },
    {
      "code": "030201",
      "isHazardous": true
    },
    {
      "code": "030202",
      "isHazardous": true
    },
    {
      "code": "030203",
      "isHazardous": true
    },
    {
      "code": "030204",
      "isHazardous": true
    },
    {
      "code": "030205",
      "isHazardous": true
    },
    {
      "code": "030299",
      "isHazardous": false
    },
    {
      "code": "030301",
      "isHazardous": false
    },
    {
      "code": "030302",
      "isHazardous": false
    },
    {
      "code": "030305",
      "isHazardous": false
    },
    {
      "code": "030307",
      "isHazardous": false
    },
    {
      "code": "030308",
      "isHazardous": false
    },
    {
      "code": "030309",
      "isHazardous": false
    },
    {
      "code": "030310",
      "isHazardous": false
    },
    {
      "code": "030311",
      "isHazardous": false
    },
    {
      "code": "030399",
      "isHazardous": false
    },
    {
      "code": "040101",
      "isHazardous": false
    },
    {
      "code": "040102",
      "isHazardous": false
    },
    {
      "code": "040103",
      "isHazardous": true
    },
    {
      "code": "040104",
      "isHazardous": false
    },
    {
      "code": "040105",
      "isHazardous": false
    },
    {
      "code": "040106",
      "isHazardous": false
    },
    {
      "code": "040107",
      "isHazardous": false
    },
    {
      "code": "040108",
      "isHazardous": false
    },
    {
      "code": "040109",
      "isHazardous": false
    },
    {
      "code": "040199",
      "isHazardous": false
    },
    {
      "code": "040209",
      "isHazardous": false
    },
    {
      "code": "040210",
      "isHazardous": false
    },
    {
      "code": "040214",
      "isHazardous": true
    },
    {
      "code": "040215",
      "isHazardous": false
    },
    {
      "code": "040216",
      "isHazardous": true
    },
    {
      "code": "040217",
      "isHazardous": false
    },
    {
      "code": "040219",
      "isHazardous": true
    },
    {
      "code": "040220",
      "isHazardous": false
    },
    {
      "code": "040221",
      "isHazardous": false
    },
    {
      "code": "040222",
      "isHazardous": false
    },
    {
      "code": "040299",
      "isHazardous": false
    },
    {
      "code": "050102",
      "isHazardous": true
    },
    {
      "code": "050103",
      "isHazardous": true
    },
    {
      "code": "050104",
      "isHazardous": true
    },
    {
      "code": "050105",
      "isHazardous": true
    },
    {
      "code": "050106",
      "isHazardous": true
    },
    {
      "code": "050107",
      "isHazardous": true
    },
    {
      "code": "050108",
      "isHazardous": true
    },
    {
      "code": "050109",
      "isHazardous": true
    },
    {
      "code": "050110",
      "isHazardous": false
    },
    {
      "code": "050111",
      "isHazardous": true
    },
    {
      "code": "050112",
      "isHazardous": true
    },
    {
      "code": "050113",
      "isHazardous": false
    },
    {
      "code": "050114",
      "isHazardous": false
    },
    {
      "code": "050115",
      "isHazardous": true
    },
    {
      "code": "050116",
      "isHazardous": false
    },
    {
      "code": "050117",
      "isHazardous": false
    },
    {
      "code": "050199",
      "isHazardous": false
    },
    {
      "code": "050601",
      "isHazardous": true
    },
    {
      "code": "050603",
      "isHazardous": true
    },
    {
      "code": "050604",
      "isHazardous": false
    },
    {
      "code": "050699",
      "isHazardous": false
    },
    {
      "code": "050701",
      "isHazardous": true
    },
    {
      "code": "050702",
      "isHazardous": false
    },
    {
      "code": "050799",
      "isHazardous": false
    },
    {
      "code": "060101",
      "isHazardous": true
    },
    {
      "code": "060102",
      "isHazardous": true
    },
    {
      "code": "060103",
      "isHazardous": true
    },
    {
      "code": "060104",
      "isHazardous": true
    },
    {
      "code": "060105",
      "isHazardous": true
    },
    {
      "code": "060106",
      "isHazardous": true
    },
    {
      "code": "060199",
      "isHazardous": false
    },
    {
      "code": "060201",
      "isHazardous": true
    },
    {
      "code": "060203",
      "isHazardous": true
    },
    {
      "code": "060204",
      "isHazardous": true
    },
    {
      "code": "060205",
      "isHazardous": true
    },
    {
      "code": "060299",
      "isHazardous": false
    },
    {
      "code": "060311",
      "isHazardous": true
    },
    {
      "code": "060313",
      "isHazardous": true
    },
    {
      "code": "060314",
      "isHazardous": false
    },
    {
      "code": "060315",
      "isHazardous": true
    },
    {
      "code": "060316",
      "isHazardous": false
    },
    {
      "code": "060399",
      "isHazardous": false
    },
    {
      "code": "060403",
      "isHazardous": true
    },
    {
      "code": "060404",
      "isHazardous": true
    },
    {
      "code": "060405",
      "isHazardous": true
    },
    {
      "code": "060499",
      "isHazardous": false
    },
    {
      "code": "060502",
      "isHazardous": true
    },
    {
      "code": "060503",
      "isHazardous": false
    },
    {
      "code": "060602",
      "isHazardous": true
    },
    {
      "code": "060603",
      "isHazardous": false
    },
    {
      "code": "060699",
      "isHazardous": false
    },
    {
      "code": "060701",
      "isHazardous": true
    },
    {
      "code": "060702",
      "isHazardous": true
    },
    {
      "code": "060703",
      "isHazardous": true
    },
    {
      "code": "060704",
      "isHazardous": true
    },
    {
      "code": "060799",
      "isHazardous": false
    },
    {
      "code": "060802",
      "isHazardous": true
    },
    {
      "code": "060899",
      "isHazardous": false
    },
    {
      "code": "060902",
      "isHazardous": false
    },
    {
      "code": "060903",
      "isHazardous": false
    },
    {
      "code": "060904",
      "isHazardous": false
    },
    {
      "code": "060999",
      "isHazardous": false
    },
    {
      "code": "061002",
      "isHazardous": true
    },
    {
      "code": "061099",
      "isHazardous": false
    },
    {
      "code": "061101",
      "isHazardous": false
    },
    {
      "code": "061199",
      "isHazardous": false
    },
    {
      "code": "061301",
      "isHazardous": true
    },
    {
      "code": "061302",
      "isHazardous": true
    },
    {
      "code": "061303",
      "isHazardous": false
    },
    {
      "code": "061304",
      "isHazardous": true
    },
    {
      "code": "061305",
      "isHazardous": true
    },
    {
      "code": "061399",
      "isHazardous": false
    },
    {
      "code": "070101",
      "isHazardous": true
    },
    {
      "code": "070103",
      "isHazardous": true
    },
    {
      "code": "070104",
      "isHazardous": true
    },
    {
      "code": "070107",
      "isHazardous": true
    },
    {
      "code": "070108",
      "isHazardous": true
    },
    {
      "code": "070109",
      "isHazardous": true
    },
    {
      "code": "070110",
      "isHazardous": true
    },
    {
      "code": "070111",
      "isHazardous": true
    },
    {
      "code": "070112",
      "isHazardous": false
    },
    {
      "code": "070199",
      "isHazardous": false
    },
    {
      "code": "070201",
      "isHazardous": true
    },
    {
      "code": "070203",
      "isHazardous": true
    },
    {
      "code": "070204",
      "isHazardous": true
    },
    {
      "code": "070207",
      "isHazardous": true
    },
    {
      "code": "070208",
      "isHazardous": true
    },
    {
      "code": "070209",
      "isHazardous": true
    },
    {
      "code": "070210",
      "isHazardous": true
    },
    {
      "code": "070211",
      "isHazardous": true
    },
    {
      "code": "070212",
      "isHazardous": false
    },
    {
      "code": "070213",
      "isHazardous": false
    },
    {
      "code": "070214",
      "isHazardous": true
    },
    {
      "code": "070215",
      "isHazardous": false
    },
    {
      "code": "070216",
      "isHazardous": true
    },
    {
      "code": "070217",
      "isHazardous": false
    },
    {
      "code": "070299",
      "isHazardous": false
    },
    {
      "code": "070301",
      "isHazardous": true
    },
    {
      "code": "070303",
      "isHazardous": true
    },
    {
      "code": "070304",
      "isHazardous": true
    },
    {
      "code": "070307",
      "isHazardous": true
    },
    {
      "code": "070308",
      "isHazardous": true
    },
    {
      "code": "070309",
      "isHazardous": true
    },
    {
      "code": "070310",
      "isHazardous": true
    },
    {
      "code": "070311",
      "isHazardous": true
    },
    {
      "code": "070312",
      "isHazardous": false
    },
    {
      "code": "070399",
      "isHazardous": false
    },
    {
      "code": "070401",
      "isHazardous": true
    },
    {
      "code": "070403",
      "isHazardous": true
    },
    {
      "code": "070404",
      "isHazardous": true
    },
    {
      "code": "070407",
      "isHazardous": true
    },
    {
      "code": "070408",
      "isHazardous": true
    },
    {
      "code": "070409",
      "isHazardous": true
    },
    {
      "code": "070410",
      "isHazardous": true
    },
    {
      "code": "070411",
      "isHazardous": true
    },
    {
      "code": "070412",
      "isHazardous": false
    },
    {
      "code": "070413",
      "isHazardous": true
    },
    {
      "code": "070499",
      "isHazardous": false
    },
    {
      "code": "070501",
      "isHazardous": true
    },
    {
      "code": "070503",
      "isHazardous": true
    },
    {
      "code": "070504",
      "isHazardous": true
    },
    {
      "code": "070507",
      "isHazardous": true
    },
    {
      "code": "070508",
      "isHazardous": true
    },
    {
      "code": "070509",
      "isHazardous": true
    },
    {
      "code": "070510",
      "isHazardous": true
    },
    {
      "code": "070511",
      "isHazardous": true
    },
    {
      "code": "070512",
      "isHazardous": false
    },
    {
      "code": "070513",
      "isHazardous": true
    },
    {
      "code": "070514",
      "isHazardous": false
    },
    {
      "code": "070599",
      "isHazardous": false
    },
    {
      "code": "070601",
      "isHazardous": true
    },
    {
      "code": "070603",
      "isHazardous": true
    },
    {
      "code": "070604",
      "isHazardous": true
    },
    {
      "code": "070607",
      "isHazardous": true
    },
    {
      "code": "070608",
      "isHazardous": true
    },
    {
      "code": "070609",
      "isHazardous": true
    },
    {
      "code": "070610",
      "isHazardous": true
    },
    {
      "code": "070611",
      "isHazardous": true
    },
    {
      "code": "070612",
      "isHazardous": false
    },
    {
      "code": "070699",
      "isHazardous": false
    },
    {
      "code": "070701",
      "isHazardous": true
    },
    {
      "code": "070703",
      "isHazardous": true
    },
    {
      "code": "070704",
      "isHazardous": true
    },
    {
      "code": "070707",
      "isHazardous": true
    },
    {
      "code": "070708",
      "isHazardous": true
    },
    {
      "code": "070709",
      "isHazardous": true
    },
    {
      "code": "070710",
      "isHazardous": true
    },
    {
      "code": "070711",
      "isHazardous": true
    },
    {
      "code": "070712",
      "isHazardous": false
    },
    {
      "code": "070799",
      "isHazardous": false
    },
    {
      "code": "080111",
      "isHazardous": true
    },
    {
      "code": "080112",
      "isHazardous": false
    },
    {
      "code": "080113",
      "isHazardous": true
    },
    {
      "code": "080114",
      "isHazardous": false
    },
    {
      "code": "080115",
      "isHazardous": true
    },
    {
      "code": "080116",
      "isHazardous": false
    },
    {
      "code": "080117",
      "isHazardous": true
    },
    {
      "code": "080118",
      "isHazardous": false
    },
    {
      "code": "080119",
      "isHazardous": true
    },
    {
      "code": "080120",
      "isHazardous": false
    },
    {
      "code": "080121",
      "isHazardous": true
    },
    {
      "code": "080199",
      "isHazardous": false
    },
    {
      "code": "080201",
      "isHazardous": false
    },
    {
      "code": "080202",
      "isHazardous": false
    },
    {
      "code": "080203",
      "isHazardous": false
    },
    {
      "code": "080299",
      "isHazardous": false
    },
    {
      "code": "080307",
      "isHazardous": false
    },
    {
      "code": "080308",
      "isHazardous": false
    },
    {
      "code": "080312",
      "isHazardous": true
    },
    {
      "code": "080313",
      "isHazardous": false
    },
    {
      "code": "080314",
      "isHazardous": true
    },
    {
      "code": "080315",
      "isHazardous": false
    },
    {
      "code": "080316",
      "isHazardous": true
    },
    {
      "code": "080317",
      "isHazardous": true
    },
    {
      "code": "080318",
      "isHazardous": false
    },
    {
      "code": "080319",
      "isHazardous": true
    },
    {
      "code": "080399",
      "isHazardous": false
    },
    {
      "code": "080409",
      "isHazardous": true
    },
    {
      "code": "080410",
      "isHazardous": false
    },
    {
      "code": "080411",
      "isHazardous": true
    },
    {
      "code": "080412",
      "isHazardous": false
    },
    {
      "code": "080413",
      "isHazardous": true
    },
    {
      "code": "080414",
      "isHazardous": false
    },
    {
      "code": "080415",
      "isHazardous": true
    },
    {
      "code": "080416",
      "isHazardous": false
    },
    {
      "code": "080417",
      "isHazardous": true
    },
    {
      "code": "080499",
      "isHazardous": false
    },
    {
      "code": "080501",
      "isHazardous": true
    },
    {
      "code": "090101",
      "isHazardous": true
    },
    {
      "code": "090102",
      "isHazardous": true
    },
    {
      "code": "090103",
      "isHazardous": true
    },
    {
      "code": "090104",
      "isHazardous": true
    },
    {
      "code": "090105",
      "isHazardous": true
    },
    {
      "code": "090106",
      "isHazardous": true
    },
    {
      "code": "090107",
      "isHazardous": false
    },
    {
      "code": "090108",
      "isHazardous": false
    },
    {
      "code": "090110",
      "isHazardous": false
    },
    {
      "code": "090111",
      "isHazardous": true
    },
    {
      "code": "090112",
      "isHazardous": false
    },
    {
      "code": "090113",
      "isHazardous": true
    },
    {
      "code": "090199",
      "isHazardous": false
    },
    {
      "code": "100101",
      "isHazardous": false
    },
    {
      "code": "100102",
      "isHazardous": false
    },
    {
      "code": "100103",
      "isHazardous": false
    },
    {
      "code": "100104",
      "isHazardous": true
    },
    {
      "code": "100105",
      "isHazardous": false
    },
    {
      "code": "100107",
      "isHazardous": false
    },
    {
      "code": "100109",
      "isHazardous": true
    },
    {
      "code": "100113",
      "isHazardous": true
    },
    {
      "code": "100114",
      "isHazardous": true
    },
    {
      "code": "100115",
      "isHazardous": false
    },
    {
      "code": "100116",
      "isHazardous": true
    },
    {
      "code": "100117",
      "isHazardous": false
    },
    {
      "code": "100118",
      "isHazardous": true
    },
    {
      "code": "100119",
      "isHazardous": false
    },
    {
      "code": "100120",
      "isHazardous": true
    },
    {
      "code": "100121",
      "isHazardous": false
    },
    {
      "code": "100122",
      "isHazardous": true
    },
    {
      "code": "100123",
      "isHazardous": false
    },
    {
      "code": "100124",
      "isHazardous": false
    },
    {
      "code": "100125",
      "isHazardous": false
    },
    {
      "code": "100126",
      "isHazardous": false
    },
    {
      "code": "100199",
      "isHazardous": false
    },
    {
      "code": "100201",
      "isHazardous": false
    },
    {
      "code": "100202",
      "isHazardous": false
    },
    {
      "code": "100207",
      "isHazardous": true
    },
    {
      "code": "100208",
      "isHazardous": false
    },
    {
      "code": "100210",
      "isHazardous": false
    },
    {
      "code": "100211",
      "isHazardous": true
    },
    {
      "code": "100212",
      "isHazardous": false
    },
    {
      "code": "100213",
      "isHazardous": true
    },
    {
      "code": "100214",
      "isHazardous": false
    },
    {
      "code": "100215",
      "isHazardous": false
    },
    {
      "code": "100299",
      "isHazardous": false
    },
    {
      "code": "100302",
      "isHazardous": false
    },
    {
      "code": "100304",
      "isHazardous": true
    },
    {
      "code": "100305",
      "isHazardous": false
    },
    {
      "code": "100308",
      "isHazardous": true
    },
    {
      "code": "100309",
      "isHazardous": true
    },
    {
      "code": "100315",
      "isHazardous": true
    },
    {
      "code": "100316",
      "isHazardous": false
    },
    {
      "code": "100317",
      "isHazardous": true
    },
    {
      "code": "100318",
      "isHazardous": false
    },
    {
      "code": "100319",
      "isHazardous": true
    },
    {
      "code": "100320",
      "isHazardous": false
    },
    {
      "code": "100321",
      "isHazardous": true
    },
    {
      "code": "100322",
      "isHazardous": false
    },
    {
      "code": "100323",
      "isHazardous": true
    },
    {
      "code": "100324",
      "isHazardous": false
    },
    {
      "code": "100325",
      "isHazardous": true
    },
    {
      "code": "100326",
      "isHazardous": false
    },
    {
      "code": "100327",
      "isHazardous": true
    },
    {
      "code": "100328",
      "isHazardous": false
    },
    {
      "code": "100329",
      "isHazardous": true
    },
    {
      "code": "100330",
      "isHazardous": false
    },
    {
      "code": "100399",
      "isHazardous": false
    },
    {
      "code": "100401",
      "isHazardous": true
    },
    {
      "code": "100402",
      "isHazardous": true
    },
    {
      "code": "100403",
      "isHazardous": true
    },
    {
      "code": "100404",
      "isHazardous": true
    },
    {
      "code": "100405",
      "isHazardous": true
    },
    {
      "code": "100406",
      "isHazardous": true
    },
    {
      "code": "100407",
      "isHazardous": true
    },
    {
      "code": "100409",
      "isHazardous": true
    },
    {
      "code": "100410",
      "isHazardous": false
    },
    {
      "code": "100499",
      "isHazardous": false
    },
    {
      "code": "100501",
      "isHazardous": false
    },
    {
      "code": "100503",
      "isHazardous": true
    },
    {
      "code": "100504",
      "isHazardous": false
    },
    {
      "code": "100505",
      "isHazardous": true
    },
    {
      "code": "100506",
      "isHazardous": true
    },
    {
      "code": "100508",
      "isHazardous": true
    },
    {
      "code": "100509",
      "isHazardous": false
    },
    {
      "code": "100510",
      "isHazardous": true
    },
    {
      "code": "100511",
      "isHazardous": false
    },
    {
      "code": "100599",
      "isHazardous": false
    },
    {
      "code": "100601",
      "isHazardous": false
    },
    {
      "code": "100602",
      "isHazardous": false
    },
    {
      "code": "100603",
      "isHazardous": true
    },
    {
      "code": "100604",
      "isHazardous": false
    },
    {
      "code": "100606",
      "isHazardous": true
    },
    {
      "code": "100607",
      "isHazardous": true
    },
    {
      "code": "100609",
      "isHazardous": true
    },
    {
      "code": "100610",
      "isHazardous": false
    },
    {
      "code": "100699",
      "isHazardous": false
    },
    {
      "code": "100701",
      "isHazardous": false
    },
    {
      "code": "100702",
      "isHazardous": false
    },
    {
      "code": "100703",
      "isHazardous": false
    },
    {
      "code": "100704",
      "isHazardous": false
    },
    {
      "code": "100705",
      "isHazardous": false
    },
    {
      "code": "100707",
      "isHazardous": true
    },
    {
      "code": "100708",
      "isHazardous": false
    },
    {
      "code": "100799",
      "isHazardous": false
    },
    {
      "code": "100808",
      "isHazardous": true
    },
    {
      "code": "100809",
      "isHazardous": false
    },
    {
      "code": "100810",
      "isHazardous": true
    },
    {
      "code": "100811",
      "isHazardous": false
    },
    {
      "code": "100812",
      "isHazardous": true
    },
    {
      "code": "100813",
      "isHazardous": false
    },
    {
      "code": "100814",
      "isHazardous": false
    },
    {
      "code": "100815",
      "isHazardous": true
    },
    {
      "code": "100816",
      "isHazardous": false
    },
    {
      "code": "100817",
      "isHazardous": true
    },
    {
      "code": "100818",
      "isHazardous": false
    },
    {
      "code": "100819",
      "isHazardous": true
    },
    {
      "code": "100820",
      "isHazardous": false
    },
    {
      "code": "100899",
      "isHazardous": false
    },
    {
      "code": "100903",
      "isHazardous": false
    },
    {
      "code": "100905",
      "isHazardous": true
    },
    {
      "code": "100906",
      "isHazardous": false
    },
    {
      "code": "100907",
      "isHazardous": true
    },
    {
      "code": "100908",
      "isHazardous": false
    },
    {
      "code": "100909",
      "isHazardous": true
    },
    {
      "code": "100910",
      "isHazardous": false
    },
    {
      "code": "100911",
      "isHazardous": true
    },
    {
      "code": "100912",
      "isHazardous": false
    },
    {
      "code": "100913",
      "isHazardous": true
    },
    {
      "code": "100914",
      "isHazardous": false
    },
    {
      "code": "100915",
      "isHazardous": true
    },
    {
      "code": "100916",
      "isHazardous": false
    },
    {
      "code": "100999",
      "isHazardous": false
    },
    {
      "code": "101003",
      "isHazardous": false
    },
    {
      "code": "101005",
      "isHazardous": true
    },
    {
      "code": "101006",
      "isHazardous": false
    },
    {
      "code": "101007",
      "isHazardous": true
    },
    {
      "code": "101008",
      "isHazardous": false
    },
    {
      "code": "101009",
      "isHazardous": true
    },
    {
      "code": "101010",
      "isHazardous": false
    },
    {
      "code": "101011",
      "isHazardous": true
    },
    {
      "code": "101012",
      "isHazardous": false
    },
    {
      "code": "101013",
      "isHazardous": true
    },
    {
      "code": "101014",
      "isHazardous": false
    },
    {
      "code": "101015",
      "isHazardous": true
    },
    {
      "code": "101016",
      "isHazardous": false
    },
    {
      "code": "101099",
      "isHazardous": false
    },
    {
      "code": "101103",
      "isHazardous": false
    },
    {
      "code": "101105",
      "isHazardous": false
    },
    {
      "code": "101109",
      "isHazardous": true
    },
    {
      "code": "101110",
      "isHazardous": false
    },
    {
      "code": "101111",
      "isHazardous": true
    },
    {
      "code": "101112",
      "isHazardous": false
    },
    {
      "code": "101113",
      "isHazardous": true
    },
    {
      "code": "101114",
      "isHazardous": false
    },
    {
      "code": "101115",
      "isHazardous": true
    },
    {
      "code": "101116",
      "isHazardous": false
    },
    {
      "code": "101117",
      "isHazardous": true
    },
    {
      "code": "101118",
      "isHazardous": false
    },
    {
      "code": "101119",
      "isHazardous": true
    },
    {
      "code": "101120",
      "isHazardous": false
    },
    {
      "code": "101199",
      "isHazardous": false
    },
    {
      "code": "101201",
      "isHazardous": false
    },
    {
      "code": "101203",
      "isHazardous": false
    },
    {
      "code": "101205",
      "isHazardous": false
    },
    {
      "code": "101206",
      "isHazardous": false
    },
    {
      "code": "101208",
      "isHazardous": false
    },
    {
      "code": "101209",
      "isHazardous": true
    },
    {
      "code": "101210",
      "isHazardous": false
    },
    {
      "code": "101211",
      "isHazardous": true
    },
    {
      "code": "101212",
      "isHazardous": false
    },
    {
      "code": "101213",
      "isHazardous": false
    },
    {
      "code": "101299",
      "isHazardous": false
    },
    {
      "code": "101301",
      "isHazardous": false
    },
    {
      "code": "101304",
      "isHazardous": false
    },
    {
      "code": "101306",
      "isHazardous": false
    },
    {
      "code": "101307",
      "isHazardous": false
    },
    {
      "code": "101309",
      "isHazardous": true
    },
    {
      "code": "101310",
      "isHazardous": false
    },
    {
      "code": "101311",
      "isHazardous": false
    },
    {
      "code": "101312",
      "isHazardous": true
    },
    {
      "code": "101313",
      "isHazardous": false
    },
    {
      "code": "101314",
      "isHazardous": false
    },
    {
      "code": "101399",
      "isHazardous": false
    },
    {
      "code": "101401",
      "isHazardous": true
    },
    {
      "code": "110105",
      "isHazardous": true
    },
    {
      "code": "110106",
      "isHazardous": true
    },
    {
      "code": "110107",
      "isHazardous": true
    },
    {
      "code": "110108",
      "isHazardous": true
    },
    {
      "code": "110109",
      "isHazardous": true
    },
    {
      "code": "110110",
      "isHazardous": false
    },
    {
      "code": "110111",
      "isHazardous": true
    },
    {
      "code": "110112",
      "isHazardous": false
    },
    {
      "code": "110113",
      "isHazardous": true
    },
    {
      "code": "110114",
      "isHazardous": false
    },
    {
      "code": "110115",
      "isHazardous": true
    },
    {
      "code": "110116",
      "isHazardous": true
    },
    {
      "code": "110198",
      "isHazardous": true
    },
    {
      "code": "110199",
      "isHazardous": false
    },
    {
      "code": "110202",
      "isHazardous": true
    },
    {
      "code": "110203",
      "isHazardous": false
    },
    {
      "code": "110205",
      "isHazardous": true
    },
    {
      "code": "110206",
      "isHazardous": false
    },
    {
      "code": "110207",
      "isHazardous": true
    },
    {
      "code": "110299",
      "isHazardous": false
    },
    {
      "code": "110301",
      "isHazardous": true
    },
    {
      "code": "110302",
      "isHazardous": true
    },
    {
      "code": "110501",
      "isHazardous": false
    },
    {
      "code": "110502",
      "isHazardous": false
    },
    {
      "code": "110503",
      "isHazardous": true
    },
    {
      "code": "110504",
      "isHazardous": true
    },
    {
      "code": "110599",
      "isHazardous": false
    },
    {
      "code": "120101",
      "isHazardous": false
    },
    {
      "code": "120102",
      "isHazardous": false
    },
    {
      "code": "120103",
      "isHazardous": false
    },
    {
      "code": "120104",
      "isHazardous": false
    },
    {
      "code": "120105",
      "isHazardous": false
    },
    {
      "code": "120106",
      "isHazardous": true
    },
    {
      "code": "120107",
      "isHazardous": true
    },
    {
      "code": "120108",
      "isHazardous": true
    },
    {
      "code": "120109",
      "isHazardous": true
    },
    {
      "code": "120110",
      "isHazardous": true
    },
    {
      "code": "120112",
      "isHazardous": true
    },
    {
      "code": "120113",
      "isHazardous": false
    },
    {
      "code": "120114",
      "isHazardous": true
    },
    {
      "code": "120115",
      "isHazardous": false
    },
    {
      "code": "120116",
      "isHazardous": true
    },
    {
      "code": "120117",
      "isHazardous": false
    },
    {
      "code": "120118",
      "isHazardous": true
    },
    {
      "code": "120119",
      "isHazardous": true
    },
    {
      "code": "120120",
      "isHazardous": true
    },
    {
      "code": "120121",
      "isHazardous": false
    },
    {
      "code": "120199",
      "isHazardous": false
    },
    {
      "code": "120301",
      "isHazardous": true
    },
    {
      "code": "120302",
      "isHazardous": true
    },
    {
      "code": "130101",
      "isHazardous": true
    },
    {
      "code": "130104",
      "isHazardous": true
    },
    {
      "code": "130105",
      "isHazardous": true
    },
    {
      "code": "130109",
      "isHazardous": true
    },
    {
      "code": "130110",
      "isHazardous": true
    },
    {
      "code": "130111",
      "isHazardous": true
    },
    {
      "code": "130112",
      "isHazardous": true
    },
    {
      "code": "130113",
      "isHazardous": true
    },
    {
      "code": "130204",
      "isHazardous": true
    },
    {
      "code": "130205",
      "isHazardous": true
    },
    {
      "code": "130206",
      "isHazardous": true
    },
    {
      "code": "130207",
      "isHazardous": true
    },
    {
      "code": "130208",
      "isHazardous": true
    },
    {
      "code": "130301",
      "isHazardous": true
    },
    {
      "code": "130306",
      "isHazardous": true
    },
    {
      "code": "130307",
      "isHazardous": true
    },
    {
      "code": "130308",
      "isHazardous": true
    },
    {
      "code": "130309",
      "isHazardous": true
    },
    {
      "code": "130310",
      "isHazardous": true
    },
    {
      "code": "130401",
      "isHazardous": true
    },
    {
      "code": "130402",
      "isHazardous": true
    },
    {
      "code": "130403",
      "isHazardous": true
    },
    {
      "code": "130501",
      "isHazardous": true
    },
    {
      "code": "130502",
      "isHazardous": true
    },
    {
      "code": "130503",
      "isHazardous": true
    },
    {
      "code": "130506",
      "isHazardous": true
    },
    {
      "code": "130507",
      "isHazardous": true
    },
    {
      "code": "130508",
      "isHazardous": true
    },
    {
      "code": "130701",
      "isHazardous": true
    },
    {
      "code": "130702",
      "isHazardous": true
    },
    {
      "code": "130703",
      "isHazardous": true
    },
    {
      "code": "130801",
      "isHazardous": true
    },
    {
      "code": "130802",
      "isHazardous": true
    },
    {
      "code": "130899",
      "isHazardous": true
    },
    {
      "code": "140601",
      "isHazardous": true
    },
    {
      "code": "140602",
      "isHazardous": true
    },
    {
      "code": "140603",
      "isHazardous": true
    },
    {
      "code": "140604",
      "isHazardous": true
    },
    {
      "code": "140605",
      "isHazardous": true
    },
    {
      "code": "150101",
      "isHazardous": false
    },
    {
      "code": "150102",
      "isHazardous": false
    },
    {
      "code": "150103",
      "isHazardous": false
    },
    {
      "code": "150104",
      "isHazardous": false
    },
    {
      "code": "150105",
      "isHazardous": false
    },
    {
      "code": "150106",
      "isHazardous": false
    },
    {
      "code": "150107",
      "isHazardous": false
    },
    {
      "code": "150109",
      "isHazardous": false
    },
    {
      "code": "150110",
      "isHazardous": true
    },
    {
      "code": "150111",
      "isHazardous": true
    },
    {
      "code": "150202",
      "isHazardous": true
    },
    {
      "code": "150203",
      "isHazardous": true
    },
    {
      "code": "160103",
      "isHazardous": false
    },
    {
      "code": "160104",
      "isHazardous": true
    },
    {
      "code": "160106",
      "isHazardous": false
    },
    {
      "code": "160107",
      "isHazardous": true
    },
    {
      "code": "160108",
      "isHazardous": true
    },
    {
      "code": "160109",
      "isHazardous": true
    },
    {
      "code": "160110",
      "isHazardous": true
    },
    {
      "code": "160111",
      "isHazardous": true
    },
    {
      "code": "160112",
      "isHazardous": false
    },
    {
      "code": "160113",
      "isHazardous": true
    },
    {
      "code": "160114",
      "isHazardous": true
    },
    {
      "code": "160115",
      "isHazardous": false
    },
    {
      "code": "160116",
      "isHazardous": false
    },
    {
      "code": "160117",
      "isHazardous": false
    },
    {
      "code": "160118",
      "isHazardous": false
    },
    {
      "code": "160119",
      "isHazardous": false
    },
    {
      "code": "160120",
      "isHazardous": false
    },
    {
      "code": "160121",
      "isHazardous": true
    },
    {
      "code": "160122",
      "isHazardous": false
    },
    {
      "code": "160199",
      "isHazardous": false
    },
    {
      "code": "160209",
      "isHazardous": true
    },
    {
      "code": "160210",
      "isHazardous": true
    },
    {
      "code": "160211",
      "isHazardous": true
    },
    {
      "code": "160212",
      "isHazardous": true
    },
    {
      "code": "160213",
      "isHazardous": true
    },
    {
      "code": "160214",
      "isHazardous": false
    },
    {
      "code": "160215",
      "isHazardous": true
    },
    {
      "code": "160216",
      "isHazardous": false
    },
    {
      "code": "160303",
      "isHazardous": true
    },
    {
      "code": "160304",
      "isHazardous": false
    },
    {
      "code": "160305",
      "isHazardous": true
    },
    {
      "code": "160306",
      "isHazardous": false
    },
    {
      "code": "160307",
      "isHazardous": true
    },
    {
      "code": "160401",
      "isHazardous": true
    },
    {
      "code": "160402",
      "isHazardous": true
    },
    {
      "code": "160403",
      "isHazardous": true
    },
    {
      "code": "160504",
      "isHazardous": true
    },
    {
      "code": "160505",
      "isHazardous": false
    },
    {
      "code": "160506",
      "isHazardous": true
    },
    {
      "code": "160507",
      "isHazardous": true
    },
    {
      "code": "160508",
      "isHazardous": true
    },
    {
      "code": "160509",
      "isHazardous": false
    },
    {
      "code": "160601",
      "isHazardous": true
    },
    {
      "code": "160602",
      "isHazardous": true
    },
    {
      "code": "160603",
      "isHazardous": true
    },
    {
      "code": "160604",
      "isHazardous": false
    },
    {
      "code": "160605",
      "isHazardous": false
    },
    {
      "code": "160606",
      "isHazardous": true
    },
    {
      "code": "160708",
      "isHazardous": true
    },
    {
      "code": "160709",
      "isHazardous": true
    },
    {
      "code": "160799",
      "isHazardous": false
    },
    {
      "code": "160801",
      "isHazardous": false
    },
    {
      "code": "160802",
      "isHazardous": true
    },
    {
      "code": "160803",
      "isHazardous": false
    },
    {
      "code": "160804",
      "isHazardous": false
    },
    {
      "code": "160805",
      "isHazardous": true
    },
    {
      "code": "160806",
      "isHazardous": true
    },
    {
      "code": "160807",
      "isHazardous": true
    },
    {
      "code": "160901",
      "isHazardous": true
    },
    {
      "code": "160902",
      "isHazardous": true
    },
    {
      "code": "160903",
      "isHazardous": true
    },
    {
      "code": "160904",
      "isHazardous": true
    },
    {
      "code": "161001",
      "isHazardous": true
    },
    {
      "code": "161002",
      "isHazardous": false
    },
    {
      "code": "161003",
      "isHazardous": true
    },
    {
      "code": "161004",
      "isHazardous": false
    },
    {
      "code": "161101",
      "isHazardous": true
    },
    {
      "code": "161102",
      "isHazardous": false
    },
    {
      "code": "161103",
      "isHazardous": true
    },
    {
      "code": "161104",
      "isHazardous": false
    },
    {
      "code": "161105",
      "isHazardous": true
    },
    {
      "code": "161106",
      "isHazardous": false
    },
    {
      "code": "170101",
      "isHazardous": false
    },
    {
      "code": "170102",
      "isHazardous": false
    },
    {
      "code": "170103",
      "isHazardous": false
    },
    {
      "code": "170106",
      "isHazardous": true
    },
    {
      "code": "170107",
      "isHazardous": false
    },
    {
      "code": "170201",
      "isHazardous": false
    },
    {
      "code": "170202",
      "isHazardous": false
    },
    {
      "code": "170203",
      "isHazardous": false
    },
    {
      "code": "170204",
      "isHazardous": true
    },
    {
      "code": "170301",
      "isHazardous": true
    },
    {
      "code": "170302",
      "isHazardous": false
    },
    {
      "code": "170303",
      "isHazardous": true
    },
    {
      "code": "170401",
      "isHazardous": false
    },
    {
      "code": "170402",
      "isHazardous": false
    },
    {
      "code": "170403",
      "isHazardous": false
    },
    {
      "code": "170404",
      "isHazardous": false
    },
    {
      "code": "170405",
      "isHazardous": false
    },
    {
      "code": "170406",
      "isHazardous": false
    },
    {
      "code": "170407",
      "isHazardous": false
    },
    {
      "code": "170409",
      "isHazardous": true
    },
    {
      "code": "170410",
      "isHazardous": true
    },
    {
      "code": "170411",
      "isHazardous": false
    },
    {
      "code": "170503",
      "isHazardous": true
    },
    {
      "code": "170504",
      "isHazardous": false
    },
    {
      "code": "170505",
      "isHazardous": true
    },
    {
      "code": "170506",
      "isHazardous": false
    },
    {
      "code": "170507",
      "isHazardous": true
    },
    {
      "code": "170508",
      "isHazardous": false
    },
    {
      "code": "170601",
      "isHazardous": true
    },
    {
      "code": "170603",
      "isHazardous": true
    },
    {
      "code": "170604",
      "isHazardous": false
    },
    {
      "code": "170605",
      "isHazardous": true
    },
    {
      "code": "170801",
      "isHazardous": true
    },
    {
      "code": "170802",
      "isHazardous": false
    },
    {
      "code": "170901",
      "isHazardous": true
    },
    {
      "code": "170902",
      "isHazardous": true
    },
    {
      "code": "170903",
      "isHazardous": true
    },
    {
      "code": "170904",
      "isHazardous": false
    },
    {
      "code": "180101",
      "isHazardous": false
    },
    {
      "code": "180102",
      "isHazardous": false
    },
    {
      "code": "180103",
      "isHazardous": true
    },
    {
      "code": "180104",
      "isHazardous": false
    },
    {
      "code": "180106",
      "isHazardous": true
    },
    {
      "code": "180107",
      "isHazardous": false
    },
    {
      "code": "180108",
      "isHazardous": true
    },
    {
      "code": "180109",
      "isHazardous": false
    },
    {
      "code": "180110",
      "isHazardous": true
    },
    {
      "code": "180201",
      "isHazardous": false
    },
    {
      "code": "180202",
      "isHazardous": true
    },
    {
      "code": "180203",
      "isHazardous": false
    },
    {
      "code": "180205",
      "isHazardous": true
    },
    {
      "code": "180206",
      "isHazardous": false
    },
    {
      "code": "180207",
      "isHazardous": true
    },
    {
      "code": "180208",
      "isHazardous": false
    },
    {
      "code": "190102",
      "isHazardous": false
    },
    {
      "code": "190105",
      "isHazardous": true
    },
    {
      "code": "190106",
      "isHazardous": true
    },
    {
      "code": "190107",
      "isHazardous": true
    },
    {
      "code": "190110",
      "isHazardous": true
    },
    {
      "code": "190111",
      "isHazardous": true
    },
    {
      "code": "190112",
      "isHazardous": false
    },
    {
      "code": "190113",
      "isHazardous": true
    },
    {
      "code": "190114",
      "isHazardous": false
    },
    {
      "code": "190115",
      "isHazardous": true
    },
    {
      "code": "190116",
      "isHazardous": false
    },
    {
      "code": "190117",
      "isHazardous": true
    },
    {
      "code": "190118",
      "isHazardous": false
    },
    {
      "code": "190119",
      "isHazardous": false
    },
    {
      "code": "190199",
      "isHazardous": false
    },
    {
      "code": "190203",
      "isHazardous": false
    },
    {
      "code": "190204",
      "isHazardous": true
    },
    {
      "code": "190205",
      "isHazardous": true
    },
    {
      "code": "190206",
      "isHazardous": false
    },
    {
      "code": "190207",
      "isHazardous": true
    },
    {
      "code": "190208",
      "isHazardous": true
    },
    {
      "code": "190209",
      "isHazardous": true
    },
    {
      "code": "190210",
      "isHazardous": false
    },
    {
      "code": "190211",
      "isHazardous": true
    },
    {
      "code": "190299",
      "isHazardous": false
    },
    {
      "code": "190304",
      "isHazardous": true
    },
    {
      "code": "190305",
      "isHazardous": false
    },
    {
      "code": "190306",
      "isHazardous": true
    },
    {
      "code": "190307",
      "isHazardous": false
    },
    {
      "code": "190401",
      "isHazardous": false
    },
    {
      "code": "190402",
      "isHazardous": true
    },
    {
      "code": "190403",
      "isHazardous": true
    },
    {
      "code": "190404",
      "isHazardous": false
    },
    {
      "code": "190501",
      "isHazardous": false
    },
    {
      "code": "190502",
      "isHazardous": false
    },
    {
      "code": "190503",
      "isHazardous": false
    },
    {
      "code": "190599",
      "isHazardous": false
    },
    {
      "code": "190603",
      "isHazardous": false
    },
    {
      "code": "190604",
      "isHazardous": false
    },
    {
      "code": "190605",
      "isHazardous": false
    },
    {
      "code": "190606",
      "isHazardous": false
    },
    {
      "code": "190699",
      "isHazardous": false
    },
    {
      "code": "190702",
      "isHazardous": true
    },
    {
      "code": "190703",
      "isHazardous": false
    },
    {
      "code": "190801",
      "isHazardous": false
    },
    {
      "code": "190802",
      "isHazardous": false
    },
    {
      "code": "190805",
      "isHazardous": false
    },
    {
      "code": "190806",
      "isHazardous": true
    },
    {
      "code": "190807",
      "isHazardous": true
    },
    {
      "code": "190808",
      "isHazardous": true
    },
    {
      "code": "190809",
      "isHazardous": false
    },
    {
      "code": "190810",
      "isHazardous": true
    },
    {
      "code": "190811",
      "isHazardous": true
    },
    {
      "code": "190812",
      "isHazardous": false
    },
    {
      "code": "190813",
      "isHazardous": true
    },
    {
      "code": "190814",
      "isHazardous": false
    },
    {
      "code": "190899",
      "isHazardous": false
    },
    {
      "code": "190901",
      "isHazardous": false
    },
    {
      "code": "190902",
      "isHazardous": false
    },
    {
      "code": "190903",
      "isHazardous": false
    },
    {
      "code": "190904",
      "isHazardous": false
    },
    {
      "code": "190905",
      "isHazardous": false
    },
    {
      "code": "190906",
      "isHazardous": false
    },
    {
      "code": "190999",
      "isHazardous": false
    },
    {
      "code": "191001",
      "isHazardous": false
    },
    {
      "code": "191002",
      "isHazardous": false
    },
    {
      "code": "191003",
      "isHazardous": true
    },
    {
      "code": "191004",
      "isHazardous": false
    },
    {
      "code": "191005",
      "isHazardous": true
    },
    {
      "code": "191006",
      "isHazardous": false
    },
    {
      "code": "191101",
      "isHazardous": true
    },
    {
      "code": "191102",
      "isHazardous": true
    },
    {
      "code": "191103",
      "isHazardous": true
    },
    {
      "code": "191104",
      "isHazardous": true
    },
    {
      "code": "191105",
      "isHazardous": true
    },
    {
      "code": "191106",
      "isHazardous": false
    },
    {
      "code": "191107",
      "isHazardous": true
    },
    {
      "code": "191199",
      "isHazardous": false
    },
    {
      "code": "191201",
      "isHazardous": false
    },
    {
      "code": "191202",
      "isHazardous": false
    },
    {
      "code": "191203",
      "isHazardous": false
    },
    {
      "code": "191204",
      "isHazardous": false
    },
    {
      "code": "191205",
      "isHazardous": false
    },
    {
      "code": "191206",
      "isHazardous": true
    },
    {
      "code": "191207",
      "isHazardous": false
    },
    {
      "code": "191208",
      "isHazardous": false
    },
    {
      "code": "191209",
      "isHazardous": false
    },
    {
      "code": "191210",
      "isHazardous": false
    },
    {
      "code": "191211",
      "isHazardous": true
    },
    {
      "code": "191212",
      "isHazardous": false
    },
    {
      "code": "191301",
      "isHazardous": true
    },
    {
      "code": "191302",
      "isHazardous": false
    },
    {
      "code": "191303",
      "isHazardous": true
    },
    {
      "code": "191304",
      "isHazardous": false
    },
    {
      "code": "191305",
      "isHazardous": true
    },
    {
      "code": "191306",
      "isHazardous": false
    },
    {
      "code": "191307",
      "isHazardous": true
    },
    {
      "code": "191308",
      "isHazardous": false
    },
    {
      "code": "200101",
      "isHazardous": false
    },
    {
      "code": "200102",
      "isHazardous": false
    },
    {
      "code": "200108",
      "isHazardous": false
    },
    {
      "code": "200110",
      "isHazardous": false
    },
    {
      "code": "200111",
      "isHazardous": false
    },
    {
      "code": "200113",
      "isHazardous": true
    },
    {
      "code": "200114",
      "isHazardous": true
    },
    {
      "code": "200115",
      "isHazardous": true
    },
    {
      "code": "200117",
      "isHazardous": true
    },
    {
      "code": "200119",
      "isHazardous": true
    },
    {
      "code": "200121",
      "isHazardous": true
    },
    {
      "code": "200123",
      "isHazardous": true
    },
    {
      "code": "200125",
      "isHazardous": false
    },
    {
      "code": "200126",
      "isHazardous": true
    },
    {
      "code": "200127",
      "isHazardous": true
    },
    {
      "code": "200128",
      "isHazardous": false
    },
    {
      "code": "200129",
      "isHazardous": true
    },
    {
      "code": "200130",
      "isHazardous": false
    },
    {
      "code": "200131",
      "isHazardous": true
    },
    {
      "code": "200132",
      "isHazardous": false
    },
    {
      "code": "200133",
      "isHazardous": true
    },
    {
      "code": "200134",
      "isHazardous": false
    },
    {
      "code": "200135",
      "isHazardous": true
    },
    {
      "code": "200136",
      "isHazardous": false
    },
    {
      "code": "200137",
      "isHazardous": true
    },
    {
      "code": "200138",
      "isHazardous": false
    },
    {
      "code": "200139",
      "isHazardous": false
    },
    {
      "code": "200140",
      "isHazardous": false
    },
    {
      "code": "200141",
      "isHazardous": false
    },
    {
      "code": "200199",
      "isHazardous": false
    },
    {
      "code": "200201",
      "isHazardous": false
    },
    {
      "code": "200202",
      "isHazardous": false
    },
    {
      "code": "200203",
      "isHazardous": false
    },
    {
      "code": "200301",
      "isHazardous": false
    },
    {
      "code": "200302",
      "isHazardous": false
    },
    {
      "code": "200303",
      "isHazardous": false
    },
    {
      "code": "200304",
      "isHazardous": false
    },
    {
      "code": "200306",
      "isHazardous": false
    },
    {
      "code": "200307",
      "isHazardous": false
    },
    {
      "code": "200399",
      "isHazardous": false
    }
  ]

## GET Hazardous Property Codes

curl --request GET \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/reference-data/hazardous-property-codes \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA'

response 

[
    {
      "code": "HP_1"
    },
    {
      "code": "HP_2"
    },
    {
      "code": "HP_3"
    },
    {
      "code": "HP_4"
    },
    {
      "code": "HP_5"
    },
    {
      "code": "HP_6"
    },
    {
      "code": "HP_7"
    },
    {
      "code": "HP_8"
    },
    {
      "code": "HP_9"
    },
    {
      "code": "HP_10"
    },
    {
      "code": "HP_11"
    },
    {
      "code": "HP_12"
    },
    {
      "code": "HP_13"
    },
    {
      "code": "HP_14"
    },
    {
      "code": "HP_15"
    },
    {
      "code": "HP_POP"
    }
  ]

## GET Disposal or Recovery Codes

curl --request GET \
  --url https://waste-movement-external-api.api.dev.cdp-int.defra.cloud/reference-data/disposal-or-recovery-codes \
  --header 'authorization: Bearer eyJraWQiOiJQYnJiZXZvYUF5d1NQcG5KUWlsQXVCT1Q4aVdyNUFcL3RaQkZHaTk5TU5CTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJ3YXN0ZS1tb3ZlbWVudC1leHRlcm5hbC1hcGktcmVzb3VyY2Utc3J2XC9hY2Nlc3MiLCJhdXRoX3RpbWUiOjE3NjA1MjYyNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX3l4VzliZUpDVyIsImV4cCI6MTc2MDUyOTg3NSwiaWF0IjoxNzYwNTI2Mjc1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIyOTBmODVhNy1mMzFlLTQ4MDMtYWQxMS02OGEyZjFlNGJlYmYiLCJjbGllbnRfaWQiOiIybHRldXNlaHNxOXZuZTdkcDFoM3ZtdGUwIn0.nTnHMPwN7o-8zzG8hEtKINbHIYSzda8uWKUHm_BxucmEZkDlIMC_Ioq-t2T0SJkGb6a5z6im4r7iPjnknRWGGFkTmch8MNjMSIkPPS6r9uUSwlXTHAuwMl8AA502JmgnmPri8B0VqiXQSkIYiqFbyYZjKW8xQc-pVE7zCOwxOy8uSv8e4fPGnV9JqYy6m09nRx-r9-VHCdDn9fT9jgl_fAMnGetsIwHBOsN0CHh4nln5UIgb6u3a1eM9fvbavSOuI3Y9M-krIp98kDSXpGTzO8QYgmZGqOU7-wiqYiwlf7RZTFv9Z0hIB1vSCqlWn9m9bK7wd5SdtlGJYnQf-w_rmA'

response 

[
    {
      "code": "R1"
    },
    {
      "code": "R2"
    },
    {
      "code": "R3"
    },
    {
      "code": "R4"
    },
    {
      "code": "R5"
    },
    {
      "code": "R6"
    },
    {
      "code": "R7"
    },
    {
      "code": "R8"
    },
    {
      "code": "R9"
    },
    {
      "code": "R10"
    },
    {
      "code": "R11"
    },
    {
      "code": "R12"
    },
    {
      "code": "R13"
    },
    {
      "code": "D1"
    },
    {
      "code": "D2"
    },
    {
      "code": "D3"
    },
    {
      "code": "D4"
    },
    {
      "code": "D5"
    },
    {
      "code": "D6"
    },
    {
      "code": "D7"
    },
    {
      "code": "D8"
    },
    {
      "code": "D9"
    },
    {
      "code": "D10"
    },
    {
      "code": "D11"
    },
    {
      "code": "D12"
    },
    {
      "code": "D13"
    },
    {
      "code": "D14"
    },
    {
      "code": "D15"
    }
  ]