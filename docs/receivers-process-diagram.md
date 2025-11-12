# Receipt of Waste - process diagram

!!! Note "Private Beta"
    Are you a waste receiver or software provider and want to get involved? [Sign up for our Digital Waste Tracking Private Beta test](private-beta-comms-sign-up.md)

The waste arrangement and collection stays As-Is, using the current Consignment Note or Waste Transfer Note, when the waste is received a digital record is created.
This first phase of the digital waste tracking rollout will focus on capturing all the data of the waste movement at the point of receipt. We believe that receiving sites are more technologically mature and therefore more likely to be able to achieve this by October '26. This then gives an additional year for carriers to onboard. The process outlined below utilises half of the as-is process with a digital record being created at the weightbridge (or receiving site).

[![REC2A: Receipt of waste](rec2a-receipt-of-waste.png)](rec2a-receipt-of-waste.png)

## Receiving waste - Scenarios included in this diagram

High-level process:
- producer, carrier, receiver are all the same
- producer, carrier, receiver are all different
- carrier and receiver are the same, but producer is different

Multiple collections where:

- all parties are the same company
- all parties are different

Movements where:

- there is a rejection or part rejection before the waste is weighed
- updates are made after the waste has moved

## Steps
### Step 1: before the waste moves
#### Broker or dealer (or other waste operator outsourcing the transit of their waste)

1 Creates a waste movement record/ticket.
2 Passes the waste transfer note/consignment note to the waste carrier.
3 Passes the waste movement record/ticket to the waste carrier.

#### Carrier (back-office employee, typically)
Creates round for driver

### Step 2: waste collection
#### Driver (on behalf of carrier)

1 Arrives at the waste collection point (multiple collection points if collecting in a ‘round’).
2 Load lifts waste onto vehicle.
3 Updates waste movement ‘ticket’ via load lift
4 Passes waste transfer note/consignment note to producer

#### Producer

1 Updates Waste Movement ‘ticket’ via outgoing weighbridge
2 Creates waste transfer note/consignment note

### Step 3: waste transit
#### Driver (on behalf of carrier)

1 Leaves waste collection point.
2 Transports waste (sometimes via other sites for additional collections – repeat step 2: waste collection).
3 Arrives at waste receiving site.

### Step 4: waste receipt

#### Driver (on behalf of carrier)
Passes waste transfer note/consignment note to receiver

#### Waste receiver (usually a waste receiving facility/site)
1. Accepts all or part of the waste.
2. Rejects all or part of the waste. If waste is rejected, it is either sent back to the producer or sent to another site that might be able to accept it.
3. If waste is accepted, the movement ‘ticket’ is updated at incoming weighbridge (software sends data to DWT service).
4. End of waste movement.

#### DWT service

1. Receives waste movement data from receiver’s software via API POST ReceiptDataset() method.
2. If validation fails, error message(s) is sent back to receiver’s software.
3. If validation passes, success confirmation is sent to receiver’s software, including a WT-ID

#### DWT data
The following data is recorded against the WT-ID:

- carrier details
  - contact
  - permits
  - vehicle registration number
  - receiver details 
  - contact
  - permits
- waste classification
  - weight and containers (estimate or actual)
  - EWC code
  - POPs
  - hazardous or non-hazardous
- waste acceptance (yes or no)
- treatment process (recovery and disposal ‘D’ or ‘R’ codes)
- receipt details (date and time)

### Step 5: after the waste has moved
#### Carrier
1. Updates waste ‘ticket’ with actual data, if applicable.
#### Producer
1. Checks on the ‘fate of the waste’
2. Contact carrier, broker or dealer for receipt details of waste  
#### Receiver
1. Updates the waste ‘ticket’ with actual data.

#### DWT service
1 PATCH method can be called by the receiver’s software to make updates to the waste movement ‘ticket’:

- ReceiptDataset()

A GET method is also available for use by the producer to check the fate of their waste.
#### DWT Data
1 dataset is available to be queried by receivers’ software:

- Receipt dataset

Waste movement details are also available for the producer to access (and to check the fate of their waste). 