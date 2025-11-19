[← Back](https://defra.github.io/waste-tracking-service){ .md-button }


# Service vision - process diagram
<b>Private Beta</b>
Are you a waste receiver or software provider and want to get involved? [Sign up for our Digital Waste Tracking Private Beta test](private-beta-comms-sign-up.md)
## Moving and receiving waste - high level digital waste tracking process
The Waste Tracking ID (WT-ID) is created in advance of the waste being moved and is subsequently passed downstream.

The current assumption is that job routes and waste tickets are already created ahead of time in the as-is process (before digital waste tracking is introduced). The to-be process in digital waste tracking (DWT) is designed to shadow this approach, capturing the necessary data seamlessly in the background.

This methodology accommodates a broad spectrum of operational maturity, from highly advanced organisations equipped with weighbridges and automated load-lift technologies, to less technologically mature entities that rely on manually updating waste movements after the events have occurred in sequence.

### Use case diagram
[![View 'moving and receiving waste' use case diagram (.jpg file)](../basic-process-flow.jpg)](../basic-process-flow.jpg)

### In-scope
High level process:

* producer, carrier and receiver are all the same
* producer, carrier, and receiver are *all different*
* carrier and receiver are the same, but *producer is different*

Multiple collections where:

* all parties are the same company
* all parties are different *companies*

Movements where:

* there is a rejection or part rejection before the waste is weighed
* there are brokers or dealers who operate outside the waste movement
* updates are made *after* the waste has moved

### List of steps
* [Step 1: before the waste moves](#step-1-before-the-waste-moves)
* [Step 2: waste collection](#step-2-waste-collection)
* [Step 3: waste transit](#step-3-waste-transit)
* [Step 4: waste receipt](#step-4-waste-receipt)
* [Step 5: after the waste has moved](#step-5-after-the-waste-has-moved)

### Step 1: before the waste moves
#### Broker or dealer (or other waste operator outsourcing the transit of their waste)
1. Creates a waste movement record in their software.
2. Passes the WT-ID to the waste producer.
3. Passes the WT-ID to the waste carrier.

#### Carrier (back-office employee, typically)
1. Creates a waste movement record (if not already created, by a broker or dealer for example) in their software.
2. Passes WT-ID to the waste producer.
3. Creates a ‘job’ (including a route) for the driver.

#### Defra digital waste tracking (DWT) service 
1. Receives POST data from broker, dealer or carrier software via the API POST CreationData() method.
2. If validation fails, error message(s) sent back to broker, dealer or carrier’s software.
3. If validation passes, success confirmation and a WT-ID is sent to broker, dealer or carrier’s software (format [YY] + 6 alphanumeric characters, e.g. 25 1A3BC6).

#### DWT data 
The following data is recorded:

* production and/or collection details
	* contact
	* permits
* carrier details
	* contact
	* permits
* waste classification
	* weight & containers (estimated or actual)
	* European Waste Catalogue (EWC) code
	* persistent organic pollutants (POPs)
	* hazardous or non-hazardous
* special handling requirements

### Step 2: waste collection

#### Driver (on behalf of carrier)
1. Arrives at the waste collection point (multiple collection points if collecting in a ‘round’).
2. Receives WT-ID from producer.
3. Load lifts waste onto vehicle.
4. Updates waste movement ‘ticket’ via load lift (software sends data to DWT service).

#### Producer
1. Passes WT-ID to driver (in any form, but verbally and manually noted down as a minimum).
2. Updates waste movement ‘ticket’ as driver passes through weighbridge with the waste load (software sends data to DWT service).

#### DWT service
1. Receives waste movement data from carrier’s software via API POST CollectionDataset() method.
2. If validation fails, error message(s) sent back to carrier’s software.
3. If validation passes, success confirmation is sent to carrier’s software.

#### DWT data
The following data is recorded against the WT-ID:

* carrier details
	* contact
	* permits
	* vehicle registration number
* receiver details
	* contact
	* permits
* waste classification
	* weight and containers (estimate or actual)
	* EWC code
	* POPs
	* hazardous or non-hazardous
* collection details (date and time)

### Step 3: waste transit

#### Driver (on behalf of carrier)
1. Leaves waste collection point.
2. Transports waste (sometimes via other sites for additional collections – repeat step 2: waste collection).
3. Arrives at waste receiving site.

### Step 4: waste receipt

#### Driver (on behalf of carrier)
1. Passes WT-ID(s) to the receiver. This can be done in any form, but at a minimum it should be done verbally and manually recorded. It could be made easier by software vendors; QR codes, vehicle registration, email etc.

#### Waste receiver (usually a waste receiving facility/site)

1. Accepts all or part of the waste.
2. Rejects all of part of the waste. If waste is rejected it is either sent back to the producer, or sent to another site that might be able to accept it.
3. If waste is accepted, the movement ‘ticket’ is updated at incoming weighbridge (software sends data to DWT service).
4. End of waste movement.

#### DWT service

1. Receives waste movement data from carrier’s software via API POST ReceiptDataset() method.
2. If validation fails, error message(s) sent back to receiver’s software.
3. If validation passes, success confirmation is sent to receiver’s software.

#### DWT data
The following data is recorded against the WT-ID:

* carrier details
	* contact
	* permits
	* vehicle registration number
* receiver details
	* contact
	* permits
* waste classification
	* weight and containers (estimate or actual)
	* EWC code
	* POPs
	* hazardous or non-hazardous
* waste acceptance (yes or no)
* treatment process (recovery and disposal ‘D’ or ‘R’ codes)
* receipt details (date and time)

### Step 5: after the waste has moved

#### Carrier
Updates waste ‘ticket’ with actual data.

#### Producer
Checks on the ‘fate of the waste’, using the WT-ID to get details of the waste movement.

#### Receiver
Updates the waste ‘ticket’ with actual data.

#### DWT service
3 PATCH methods can be called by the carrier or receiver’s software to make updates to the waste movement ‘ticket’:

* CreationDataset()
* CollectionDataset()
* ReceiptDataset()

A GET method is also available for use by the producer to check the fate of their waste.

#### DWT Data
3 datasets are available to be queried by the carrier or receiver’s software:

* Creation dataset
* Collection dataset
* Receipt dataset

Waste movement details are also available for the producer to access (and to check the fate of their waste).

<br/>Page last updated on 5 June 2025.