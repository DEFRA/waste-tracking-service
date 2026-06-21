/**
 * Example payloads for the Record Drop-off event.
 * POST /transfers → 201 with transferId
 *
 * The Transfer ID returned here may be passed to an official receiver
 * so the receipt can be recorded via POST /transfers/{transferId}/receipt,
 * where applicable.
 *
 * Receiver details are NOT on this payload. The drop-off place is a lighter
 * carrier-declared site model than the receipt receiver. A receipt event may
 * not always follow a drop-off, for example when waste is left at an exempt place.
 */

export { carrier } from './creationEvent.js'

import { carrier } from './creationEvent.js'

// ---------------------------------------------------------------------------
// Sub-objects
// ---------------------------------------------------------------------------

export const dropOff = {
  siteName: 'Test Drop-off Site',
  // Optional; include when the place operates under an exemption, e.g. a WEX number.
  // This is distinct from receiver.authorisationNumber.
  exemptionNumber: 'WEX123456',
  address: {
    fullAddress: '99 Receiver Road, Test City',
    postcode: 'TE1 3RX'
  }
}

// ---------------------------------------------------------------------------
// Single-collection drop-off (one Movement ID)
// ---------------------------------------------------------------------------

export const singleMovementPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  movementIds: ['25HRA0B2'],
  actualDateTimeDropOff: '2025-09-15T11:15:00Z',
  isDeleted: false,
  carrier,
  dropOff
  // receiver details not present — receipt may not always follow a drop-off
}

// ---------------------------------------------------------------------------
// Multi-collection drop-off (multiple non-hazardous Movement IDs)
// Only permitted when all listed Movements carry non-hazardous waste (D-010)
// ---------------------------------------------------------------------------

export const multiMovementPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  movementIds: ['25HRA0B2', '25TKP3C9', '25ZWQ7D1'],
  actualDateTimeDropOff: '2025-09-15T11:15:00Z',
  yourUniqueReference: 'DRIVER-RUN-AM-001',
  specialHandlingRequirements: 'Keep segregated until receipt confirmation.',
  otherReferencesForMovement: [
    {
      label: 'routeSheetNumber',
      reference: 'RS-20250915-01'
    }
  ],
  isDeleted: false,
  carrier,
  dropOff
}

// ---------------------------------------------------------------------------
// Hazardous single-movement drop-off
// Exactly one Movement ID — multi-movement aggregation is forbidden (D-010)
// ---------------------------------------------------------------------------

export const hazardousSingleMovementPostBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  movementIds: ['25HRA0B2'], // One Movement ID only — hazardous constraint (D-010)
  actualDateTimeDropOff: '2025-09-15T11:15:00Z',
  isDeleted: false,
  carrier,
  dropOff: {
    siteName: 'Hazardous Waste Drop-off Site',
    address: {
      fullAddress: '99 Receiver Road, Test City',
      postcode: 'TE1 3RX'
    }
  }
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

// Server mints and returns the Transfer ID (D-012, D-013)
// The driver may pass this to the receiver to enable POST /transfers/{transferId}/receipt, where applicable.
export const recordDropOffResponse = {
  transferId: '25XMN4F7'
}

export const recordDropOffResponseWithWarnings = {
  transferId: '25XMN4F7',
  validation: {
    warnings: [
      {
        key: 'movementIds',
        errorType: 'BusinessRuleViolation',
        message: 'One or more Movement IDs may require a separate drop-off record under the hazardous waste aggregation rule.'
      }
    ]
  }
}

// ---------------------------------------------------------------------------
// 404 shape — Transfer ID not found
// ---------------------------------------------------------------------------

export const transferNotFoundError = {
  code: 'TRANSFER_NOT_FOUND',
  message: 'No transfer found for the provided transferId.'
}

// ---------------------------------------------------------------------------
// Update Drop-off — PUT /transfers/{transferId}
//
// A recorded drop-off is immutable except for soft-delete (D-017). The update
// body carries ONLY apiCode and isDeleted; every other field is rejected as
// NotAllowed. To correct a recorded drop-off, soft-delete it and record a fresh
// one via POST /transfers.
// ---------------------------------------------------------------------------

// Soft-delete an existing drop-off (transfer)
export const updateDropOffSoftDeleteBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  isDeleted: true
}

// Restore a previously soft-deleted drop-off
export const updateDropOffRestoreBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  isDeleted: false
}

// Rejected: a PUT carrying any field other than apiCode/isDeleted (here
// movementIds and dropOff) is not allowed — the drop-off is immutable except
// for soft-delete (D-017).
export const updateDropOffForbiddenFieldBody = {
  apiCode: '25b14080-5e77-4f91-9957-2482a0cb8775',
  isDeleted: false,
  movementIds: ['25HRA0B2'],
  dropOff
}

export const updateDropOffForbiddenFieldError = {
  validation: {
    errors: [
      {
        key: 'movementIds',
        errorType: 'NotAllowed',
        message: 'Field is not permitted on a drop-off update — a recorded drop-off is immutable except for isDeleted (D-017).'
      },
      {
        key: 'dropOff',
        errorType: 'NotAllowed',
        message: 'Field is not permitted on a drop-off update — a recorded drop-off is immutable except for isDeleted (D-017).'
      }
    ]
  }
}

// 200 — validation envelope only, no identifier (it is in the path)
export const updateDropOffResponse = {
  validation: {
    warnings: []
  }
}