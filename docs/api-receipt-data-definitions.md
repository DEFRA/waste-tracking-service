[← Back to Top](README.md){ .md-button }

# Receipt of Waste - Data Definitions

Are you a waste receiver or software provider and want to get involved? [Sign up for our Digital Waste Tracking Service](api-software-developer-onboarding-process.md)

These draft data definition tables describe the information we expect to be recorded by the future waste tracking service when a receiving site accepts or rejects waste.

They are a draft and may be updated to reflect changes to policy, legislation and feedback received from those in the waste industry.

## Movement Details 

| Data field                                            | Description                                                                                                                                                      |
| ---------------------------------------------------- |  ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Code (mandatory)                                    |  The waste receiver's unique 6-digit code obtained during registration.                                                                                |
| Date/time received (mandatory)                                  |  This is the date and exact time waste was received at the site.                                                                                                  |
| Your unique reference ID (optional)                                 |  For example, a weighbridge ticket number or waste transfer note number.
| Other references for movement (optional)                                    |  Other references for this movement given by the receiver or others.                                                                                                                               |
| Special handling requirements (optional)                         |  Handling instructions for waste that has the potential to cause harm. |
| Reasons for not having a consignment (conditional)                        |  Reason for not providing a hazardous waste consignment code.|
| Hazardous waste consignment code  (conditional)                      | Hazardous waste consignment code.|

## Waste Items 

| Data field                                                                                                  |  Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- |  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EWC code (mandatory)                                              |   A 6-digit code that classifies and describes the waste item, there could be multiple EWC codes for one item in certain scenarios                                                     |
| Waste description (mandatory)                                  |  A detailed description of the waste item, including physical characteristics, composition and if it’s potentially hazardous.            |
| Physical Form (mandatory)                                                                                              | For example, gas, liquid, solid, powder, sludge or mixed.|
| Number of containers (mandatory)                                                                                         |  Number of containers containing in the waste received                                          |
| Type of containers (mandatory)                                                                                        |  The type of container containing the waste received. For example, large industrial skips.                                                                                        |
| Weight - unit of measurement (mandatory)                                                                                 |  Weight unit of measurement (for example, kilograms, grams or tonnes)                                                                                                                                                                                                                                            |
| Weight - amount (mandatory)                                                                                            | Weight of the waste item.                                                                                                                                                                                                                                               |
| Is the waste weight estimated? (mandatory)                                                                            |  Is the weight of the waste item estimated, true or false. 
 |

## POPs Data
| Data field                                                                                                  |  Description|
| ----------------------------------------------------------------------------------------------------------- |  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contains POPs (mandatory)                                               | Does the waste contai persistent organic pollutants (POPs) true or false.                                                            | 
| POP code (mandatory)                                                                                                  | A code related to a POP chemical name, for example, END, HCBC, PCNS, SCCPS.                                                                                                                                                                                            
| Source of Component (mandatory)          |How the POP component details were determined e.g. own testing, from guidance.  |
| POP concentration value  (optional)                                                                                    | The concentration of the POPS, mg per kg.  |

## Hazardous Waste Data
| Data field                                                                                                  |  Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|Contains hazardous? (mandatory)                                                                                    |Does the waste contain Hazardous components, true or false.              |   
| Hazardous property codes (Haz code) (optional)                                                                         |  A code used to classify hazardous waste, for example HP 1 (Explosive waste) or HP 2 (Oxidising waste).|
| Chemical or biological component name (mandatory)                                                                           | For example, Mercury.                                                                                                                                                                      |
| Component concentration value (optional)                                                                              |  The concentration of the hazardous component, mg per kg.  For example, 30mg per kg.|

## Disposal or Recovery Codes
| Data field                                                                                                  |  Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- |  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                                                                    |
| Disposal / recovery code (mandatory) |A code that determines the most appropriate treatment and recovery option for your waste. For each EWC code there must be at least one D or R code. |
| Weight - unit of measurement (mandatory)                                                                                 |  Unit of measurement (Grams, kilograms or tonnes)                                                                                                                                                                                                                                          |
| Weight - amount (mandatory)                                                                                             |  Is the weight of waste covered by the disposal or recovery code estimated, true or false?                                                                                                                                                                                                            |

## Carrier Details

| Data field                                                               |  Description                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |                                                                                         
| Carrier registration number (mandatory but can be null)                                                | The registration number of the carrier delivering the waste movement.|
| Reason for no Registration Number (conditional)  | Reason for not having the carrier registration number.                                                                                                                                                                            |
| Carrier organisation name  (mandatory)                                              | The organisation name of the carrier delivering the waste movement.  |
| Carrier address (optional)                                                        |  The address of the carrier organisation delivering the waste movement. |
| Carrier post code (mandatory)                                                      |  The postcode of the carrier organisation delivering the waste movement.  |
| Carrier contact email address (optional)                                           |  The contact email address of the carrier organisation delivering the waste movement.     | 
| Carrier contact phone number (optional)                                            |  The contact phone number of the carrier organisation delivering the waste movement. |
| Vehicle registration number (conditional)                                             |  The registration number of the vehicle delivering the waste movement |
| Means of transport (mandatory) | The method of transport used in delivering the waste movement, for example, road, rail, air or sea. |

## Broker or Dealer Details

| Data field                           |  Description                                                        |
| ------------------------------------ |  ------------------------------------------------------------------ |
| Broker or dealer organisation name (mandatory)  |  The organisation name of the broker or dealer acting as the intermediary in arranging the waste movement. |
| Broker or dealer address (optional)            |  The address of the broker or dealer organisation acting as the intermediary in arranging the waste movement. | 
| Broker or dealer post code (mandatory)          |  The postcode of the broker or dealer organisation acting as the intermediary in arranging the waste movement.  
  | Broker or dealer email address (optional)              |  The contact email address of the broker or dealer organisation acting as the intermediary in arranging the waste movement.  
| Broker or dealer phone number (optional)       |  The contact phone number of the broker or dealer organisation acting as the intermediary in arranging the waste movement.
| Broker or dealer registration number (optional) |  The registration number of the broker or dealer organisation acting as the intermediary in arranging the waste movement.  


## Waste Receiver Details

| Data field                                  |  Description                                                                                                                                                                                                                                   |
| ------------------------------------------- |  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Receiver site name (mandatory)   |  The name of the site receiving the waste movement. |
| Receiver email address (optional)              |  The contact email address of the site receiving the waste   |
| Receiver phone number (optional)       |  The contact phone number of the site receiving the waste movement.|   
| Receiver’s authorisation number (mandatory)           |  The permit number of the site receiving the waste allows a site to accept waste for recovery or disposal.                                                                                                   |
| Regulatory position statements (optional)            | The regulatory position statement appropriate for the site    |

## Receipt

| Data field                                                                                                      |  Description                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------- |  --------------------------------------------------------------------------------------------------------------------------------- |
| Receipt address (mandatory)           |  The address of the site receiving the waste movement.             |
| Receipt post code (mandatory)          |  The postcode of the site receiving the waste movement |


## Changelog

You can find the changelog for this document in the [Receipt API v1.0 Data Definitions](https://github.com/DEFRA/waste-tracking-service/wiki/Receipt-API-Data-Definitions) GitHub wiki.
<br/>

Page last updated on August 19th 2026.
