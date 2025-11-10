# Service vision – storyboard

## Private Beta
Are you a waste receiver or software provider and want to get involved? [Sign up for our Digital Waste Tracking Private Beta test](private-beta-comms-sign-up.md)

[![View a visual image of the storyboard (.png file)](../wt-storyboard-carriers-receiver.png)](../wt-storyboard-carriers-receiver.png)
## Scenario
The carrier uses their software to record waste movements, which automatically creates a Waste Tracking (WT) record and generates a unique WT ID.

The receiver also uses software to review the details submitted by the carrier, using the WT ID provided by the carrier. They also provide information via their software that links into WT.

The producer does not input any information into the WT system. Instead, they can view the carrier’s and receiver’s records, either through their own software or via a GOV.UK interface, by using the WT ID shared by the carrier.

## Before the waste movement

### 1. Planning a waste movement
The waste producer's compliance manager initiates a request for a waste movement via the carrier's app. A manager at the carrier picks up the request, starts planning and records the job in their company software.

Who's involved:

* compliance manager, from the waste producer
* a coordinator, from the carrier
* the driver moving the waste

What they do:

1. The waste producer contacts the carrier to request a waste collection job, and provides estimated waste details.
2. The coordinator allocates the job to a driver and creates the route. They add information about the waste movement into the company software. The information is automatically sent to WT. WT sends back a unique WT generated ID. They create a ticket for the driver that includes the WT ID. The WT ID is also shared with the waste producer
3. The coordinator shares the ticket that includes the WT ID to the driver, and the driver checks the details.

#### Waste tracking interactions

WT reads the data and runs a validation check against schema. If no errors, WT generates a WT ID and sends back to carrier software.

Data entered into carrier's software and sent to waste tracking:

* Production and/or Collection Details
    * Contact
    * Permits (if applicable)
* Carrier Details
    * Contact
    * Permits
* Receiver Details
    * Contact
    * Permits
* Waste Classification
    * Weight & Containers (Est. or Act.)
    * EWC
    * POPs
    * Haz/Non-Haz
* Special Handling Requirements

Data passed back to carrier's software from waste tracking:

* Waste Tracking ID (year + 6 digit alphanumeric code)

### 2. Collecting the waste
The carrier arrives at the waste producer's collection point.

Who's involved:

* the driver moving the waste

What they do:

1. The carrier arrives at the waste producer's collection point. They check the waste matches with the ticket and they take it away.

## During the waste movement

### 3. Moving the waste
The driver travels to the receiving site, presents the WT ID and documents at the weighbridge.

Who's involved:

* the driver moving the waste

What they do:

1. The driver leaves the collection point and drives to the receiving site.
2. The driver arrives at the receiving site. They drive to the incoming weighbridge and pass the relevant documentation to staff, which includes the WT ID.

### 4. Accepting the waste
The weighbridge operator verifies waste movement details and accesses WT data. After accepting the waste, they record the receipt in their company software.

Who's involved:

* weighbridge operator, at the receiving site

What they do:

1. The weighbridge operator at the receiving site checks the details of the waste movement on their system against the data held on the WT service.
2. They accept the waste. They add information about the receipt of the waste movement into the company software, including the WT ID provided by the carrier. The information is automatically sent to WT.

**Note:** The WT record should be updated by the receiver within two working days from when the waste is accepted.

#### Waste tracking interactions

1. WT reads the WT ID and matches it to a record. It displays some data about the waste movement.

Data is entered into carrier's software:

* Waste Tracking ID

Data from waste tracking is submitted to the carrier's software:

* Carrier Details
* Waste Classification
    * Weight & Containers (Est. or Act.)
    * EWC
    * POPs
    * Haz/Non-Haz
    * Special Handling Requirements

2. Data from the carrier's software is sent to waste tracking:

* Waste Tracking ID
* Carrier Details
    * Contact
    * Permits
    * Vehicle Reg 
* Receiver Details
    * Contact
    * Permits
* Waste Classification
    * Weight & Containers (Est. or Act.)
    * EWC
    * POPs
    * Haz/Non-Haz
* Waste Acceptance (Yes/No)
* Receipt Details (Date & Time)

## After the waste movement
### 5. Updating the collection record
The driver reports to the coordinator, who updates their company software with collection details.

Who's involved:

* the driver moving the waste
* a coordinator, from the carrier

What they do:

1. Driver returns to base and reports back to the coordinator about the collection.
2. The carrier coordinator updates their company software with collection information provided by the driver. The updated information automatically feeds into the WT record.

**Note:** The WT record should be updated by the receiver within two working days from when the waste is collected.

#### Waste tracking interactions
Data is sent from the carrier's software to waste tracking:

* Waste Tracking ID
* Producer Details
    * Contact
    * Permits (if applicable)
* Carrier Details
    * Contact
    * Permits
    * Vehicle Reg 
* Receiver Details
    * Contact
    * Permits
* Waste Classification
    * Weight & Containers (Est. or Act.)
    * EWC
    * POPs
    * Haz/Non-Haz
* Collection Details (Date & Time)

### 6. Checking the fate of the waste
The waste producer checks on the fate of their waste, to remain complaint with their duty of care obligations.

Who's involved:

* compliance manager, from the waste producer

What they do:

1. Waste producers with their own software could access the fate of their waste via their software using the WT ID provided to them by the carrier. Waste producers without software can use GOV.UK.

#### Waste tracking interactions
WT reads the WT ID and matches it to a record. It displays some data about the waste movement.

Data from waste tracking is viewed by the producer in their software or on GOV.UK:

* Carrier Details
    * Contact
    * Permits 
* Receiver Details
    * Contact
    * Permits
* Waste Classification
    * Weight & Containers (Est. or Act.)
    * EWC
    * POPs
    * Haz/Non-Haz
* Collection Details (Date & Time)

<br/>Page last updated on 20 May 2025.
