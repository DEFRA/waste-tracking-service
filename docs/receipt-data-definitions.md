[← Back to Top](README.md){ .md-button }

# Receipt of Waste - Data Definitions

<b>Private Beta</b>

Are you a waste receiver or software provider and want to get involved? [Sign up for our Digital Waste Tracking Private Beta test](private-beta-comms-sign-up.md)

These draft data definition tables describe the information we expect to be recorded by the future waste tracking service when a receiving site accepts or rejects waste.

They are a draft and may be updated to reflect changes to policy, legislation and feedback received from those in the waste industry.

## Movement Details

| Data field                                           | Mandatory or optional | Description                                                                                                                                                      |
| ---------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Code                                     | Mandatory             | The waste receiver's unique 6-digit code.                                                                                |
| Date/time received                                   | Mandatory             | This is the date and exact time waste was received at the site.                                                                                                  |
| Your unique reference ID                                  | Optional              | For example, a weighbridge ticket number or waste transfer note number.
| Other references                                     | Optional              | Other references for this movement.                                                                                                                               |
| Special handling requirement                         | Optional              | Handling instructions for waste that has the potential to cause harm. |
| Reasons provided for not having a consignment number                        | Optional              | Reasons provided for not having a consignment number.|
| Hazardous waste consignment code                        | Optional              |Hazardous waste consginment code.|
## Waste Items

| Data field                                                                                                  | Mandatory or optional | Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EWC code (could be multiple EWC codes for one load)                                                         | Mandatory             |  A 6-digit code that classifies and describes the waste.                                                     |
| Waste description                                   | Mandatory             | A detailed description of the waste, including physical characteristics, composition and if it’s potentially hazardous.            |
| Physical form                                                                                               | Mandatory             |For example, gas, liquid, solid, powder, sludge or mixed.
|                                                                                                                                                                              |
| Number of containers                                                                                        | Mandatory             | Not needed                                                                                                                                                                                                           |
| Type of containers                                                                                          | Mandatory             | For example, large industrial skips                                                                                          |
| Weight - unit of measurement                                                                                 | Mandatory             | Weight unit of measurement (for example, kilograms, grams or tonnes)                                                                                                                                                                                                                                            |
| Weight - amount                                                                                              | Mandatory             | Not needed                                                                                                                                                                                                                                                |
| Is the waste weight estimated?                                                                             | Mandatory             | Not needed                                                                                                                                                                                                                         |
## POPs Data
| Data field                                                                                                  | Mandatory or optional | Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does the waste contain persistent organic pollutants (POPs)?                                                | Mandatory             | POPs are poisonous chemical substances that break down slowly and get into food chains.                                                              |
| POP name                                                                                                    | Optional             | For example, Aldrin, Chlordane or Dieldrin.                                                                                                                                                                                                                            |
| POP concentration value                                                                                     | Optional             | For example, 50mg per kg of Chlordane.                                                                                                                                                                                                                                        |
## Hazardous Waste data:
| Data field                                                                                                  | Mandatory or optional | Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| Is the waste hazardous?                                                                                     | Mandatory             |Hazardous waste is any waste that is potentially harmful to human health or the environment.  |
| Hazardous property codes (Haz code)                                                                         | Optional             | A code used to classify hazardous waste, for example HP 1 (Explosive waste) or HP 2 (Oxidising waste).|
| Chemical or biological component                                                                            | Optional             | For example, Mercury.                                                                                                                                                                      |
| Component concentration value                                                                               | Optional             | For example, 30mg per kg.                                                                                                                                                                                                                                                                      |
## Disposal or Recovery Codes:
| Data field                                                                                                  | Mandatory or optional | Description                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                                                                    |
| Disposal / recovery code | Mandatory             |A code that determines the most appropriate treatment and recovery option for your waste. For each EWC code there must be at least one D or R code. |
| Weight - unit of measurement                                                                                 | Mandatory             | Weight unit of measurement (for example, kilograms, grams or tonnes).                                                                                                                                                                                                                                             |
| Weight - amount                                                                                              | Mandatory             | Total weight of waste for disposal or recovery code                                                                                                                                                                                                                                             |
| Is the waste weight estimated?                                                                             | Mandatory             | Is the weight estimated?                                                                                                                                                                                                            |

## Carrier Details

| Data field                                                               | Mandatory or optional | Description                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |                                                                                         
| Carrier registration number                                              | Mandatory             | Required for all businesses and organisations that transport, buy, sell or dispose of waste. |
| If Carrier registration number not applicable, give reason(s)            | Mandatory             | Provide reasons for not having the carrier registration number                                                                                                                                                                            |
| Carrier organisation name                                                | Mandatory             | Not needed                                                                                                                                                             |
| Carrier address                                                          | Optional              | Not needed                                                                                                                                                                                              |
| Carrier post code                                                        | Optional              | Not needed                                                                                                                                                                                    |
| Carrier contact email address                                            | Optional              | Not needed                                                                                                                                                                                                         |
| Carrier contact phone number                                             | Optional              | Not needed                                                                                                                                                                                                |
| Vehicle registration number                                              | Optional             | Not needed                                                                                                                                              |
| Means of transport  | Mandatory             | For example, road, rail, air or sea.                                                                                                                                                                                               |

## Broker or Dealer Details

| Data field                           | Mandatory or optional | Description                                                        |
| ------------------------------------ | --------------------- | ------------------------------------------------------------------ |
| Broker or dealer organisation name   | Optional              | Not needed |
| Broker or dealer address             | Optional              | Not needed             |
| Broker or dealer post code           | Optional              | Not needed           |
| Broker or dealer email               | Optional              | Not needed                        |
| Broker or dealer phone number        | Optional              | Not needed                     |
| Broker or dealer registration number | Optional              | Not needed                  |

## Waste Receiver Details

| Data field                                  | Mandatory or optional | Description                                                                                                                                                                                                                                   |
| ------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Receiver site name   | Optional              | Not needed |
| Receiver email               | Optional              | Not needed                                |
| Receiver phone number        | Optional              | Not needed                      |
| Receiver’s authorisation number             | Mandatory             | A permit or exemption number that allows a site to accept waste for recovery or disposal.                                                                                                   |
| Regulatory position statement               | Optional             | A statement that confirms what activities you do not require a permit for. |

## Receipt

| Data field                                                                                                      | Mandatory or optional | Description                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Receipt address            |  Mandatory              | Not needed           |
| Receipt post code          | Mandatory               | Not needed          |


## Changelog

You can find the changelog for this document in the [Receipt API v1.0 Data Definitions](https://github.com/DEFRA/waste-tracking-service/wiki/Receipt-API-Data-Definitions) GitHub wiki.
<br/>

Page last updated on March 6th 2026.

