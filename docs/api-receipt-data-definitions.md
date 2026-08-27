
!!! info
    **`From 1 October 2026, permitted or licenced sites in England and Wales will need to report their waste digitally, using the report receipt of waste service. In Northern Ireland and Scotland this comes into effect on 1 January 2027.`**

# Receipt of Waste - Data Definitions

Are you a waste receiver or software provider and want to get involved? [Sign up for our Digital Waste Tracking Service](api-software-developer-onboarding-process.md)

These data definition tables describe the information we expect to be recorded by the waste tracking service when a receiving site accepts waste.


## Movement Details 

| Data field                                            | Description                                                                                                                                                      |
| ---------------------------------------------------- |  ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Code                                    |  The waste receiver's unique 6-digit code obtained during registration.                                                                                |
| Date/time received                                 |  This is the date and exact time waste was received at the site.                                                                                                  |
| Your unique reference ID                                  |  For example, a weighbridge ticket number or waste transfer note number.
| Other references for movement                                     |  Other references for this movement given by the receiver or others.                                                                                                                               |
| Special handling requirements                          |  Handling instructions for waste that has the potential to cause harm. |
| Reasons for not having a consignment                        |  Reason for not providing a hazardous waste consignment code.|
| Hazardous waste consignment code                     | Hazardous waste consignment code.|

## Waste Items 

| Data field                                                                                                  |  Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- |  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EWC code                                               |   A 6-digit code that classifies and describes the waste item, there could be multiple EWC codes for one item in certain scenarios                                                     |
| Waste description                                   |  A detailed description of the waste item, including physical characteristics, composition and if it’s potentially hazardous.            |
| Physical Form                                                                                               | For example, gas, liquid, solid, powder, sludge or mixed.|
| Number of containers                                                                                          |  Number of containers containing in the waste received                                          |
| Type of containers                                                                                         |  The type of container containing the waste received. For example, large industrial skips.                                                                                        |
| Weight - unit of measurement                                                                                  |  Weight unit of measurement (for example, kilograms, grams or tonnes)                                                                                                                                                                                                                                            |
| Weight - amount                                                                                             | Weight of the waste item.                                                                                                                                                                                                                                               |
| Is the waste weight estimated?                                                                             |  Is the weight of the waste item estimated, true or false. 
 

## POPs Data
| Data field                                                                                                  |  Description|
| ----------------------------------------------------------------------------------------------------------- |  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contains POPs                                                | Does the waste contain persistent organic pollutants (POPs) true or false.                                                            | 
| POP code                                                                                                   | A code related to a POP chemical name, for example, END, HCBC, PCNS, SCCPS.                                                                                                                                                                                            
| Source of Component           |How the POP component details were determined e.g. own testing, from guidance.  |
| POP concentration value                                                                                      | The concentration of the POPS, mg per kg.  |

## Hazardous Waste Data
| Data field                                                                                                  |  Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|Contains hazardous?                                                                                     |Does the waste contain Hazardous components, true or false.              |   
| Hazardous property codes (Haz code)                                                                          |  A code used to classify hazardous waste, for example HP 1 (Explosive waste) or HP 2 (Oxidising waste).|
| Chemical or biological component name                                                                            | For example, Mercury.                                                                                                                                                                      |
| Component concentration value                                                                               |  The concentration of the hazardous component, mg per kg.  For example, 30mg per kg.|

## Disposal or Recovery Codes
| Data field                                                                                                  |  Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- |  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                                                                    |
| Disposal / recovery code  |A code that determines the most appropriate treatment and recovery option for your waste. For each EWC code there must be at least one D or R code. |
| Weight - unit of measurement                                                                                  |  Unit of measurement (Grams, kilograms or tonnes)                                                                                                                                                                                                                                          |
| Weight - amount                                                                                              |  Is the weight of waste covered by the disposal or recovery code estimated, true or false?                                                                                                                                                                                                            |

## Carrier Details

| Data field                                                               |  Description                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |                                                                                         
| Carrier registration number (mandatory but can be null)                                                | The registration number of the carrier delivering the waste movement.|
| Reason for no Registration Number  | Reason for not having the carrier registration number.                                                                                                                                                                            |
| Carrier organisation name                                                | The organisation name of the carrier delivering the waste movement.  |
| Carrier address                                                         |  The address of the carrier organisation delivering the waste movement. |
| Carrier post code                                                       |  The postcode of the carrier organisation delivering the waste movement.  |
| Carrier contact email address                                            |  The contact email address of the carrier organisation delivering the waste movement.     | 
| Carrier contact phone number                                             |  The contact phone number of the carrier organisation delivering the waste movement. |
| Vehicle registration number (conditional)                                             |  The registration number of the vehicle delivering the waste movement |
| Means of transport  | The method of transport used in delivering the waste movement, for example, road, rail, air or sea. |

## Broker or Dealer Details

| Data field                           |  Description                                                        |
| ------------------------------------ |  ------------------------------------------------------------------ |
| Broker or dealer organisation name   |  The organisation name of the broker or dealer acting as the intermediary in arranging the waste movement. |
| Broker or dealer address             |  The address of the broker or dealer organisation acting as the intermediary in arranging the waste movement. | 
| Broker or dealer post code           |  The postcode of the broker or dealer organisation acting as the intermediary in arranging the waste movement.  
  | Broker or dealer email address               |  The contact email address of the broker or dealer organisation acting as the intermediary in arranging the waste movement.  
| Broker or dealer phone number        |  The contact phone number of the broker or dealer organisation acting as the intermediary in arranging the waste movement.
| Broker or dealer registration number  |  The registration number of the broker or dealer organisation acting as the intermediary in arranging the waste movement.  


## Waste Receiver Details

| Data field                                  |  Description                                                                                                                                                                                                                                   |
| ------------------------------------------- |  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Receiver site name    |  The name of the site receiving the waste movement. |
| Receiver email address               |  The contact email address of the site receiving the waste   |
| Receiver phone number        |  The contact phone number of the site receiving the waste movement.|   
| Receiver’s authorisation number            |  The permit number of the site receiving the waste allows a site to accept waste for recovery or disposal.                                                                                                   |
| Regulatory position statements             | The regulatory position statement appropriate for the site    |

## Receipt

| Data field                                                                                                      |  Description                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------- |  --------------------------------------------------------------------------------------------------------------------------------- |
| Receipt address            |  The address of the site receiving the waste movement.             |
| Receipt post code           |  The postcode of the site receiving the waste movement |


## Changelog

You can find the changelog for this document in the [Receipt API v1.0 Data Definitions](https://github.com/DEFRA/waste-tracking-service/wiki/Receipt-API-Data-Definitions) GitHub wiki.
<br/>

Page last updated on August 19th 2026.

