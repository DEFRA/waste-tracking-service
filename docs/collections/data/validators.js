// Lightweight validator helpers for the documentation-side Receipt Joi schema.
// Source of truth remains the live service schemas and reference data in
// waste-movement-external-api.

export const UK_POSTCODE_REGEX =
	/^((GIR 0A{2})|((([A-Z]\d{1,2})|(([A-Z][A-HJ-Y]\d{1,2})|(([A-Z]\d[A-Z])|([A-Z][A-HJ-Y]\d?[A-Z])))) \d[A-Z]{2}))$/i

export const IRL_POSTCODE_REGEX =
	/^(?:D6W|[AC-FHKNPRTV-Y]\d{2}) ?[0-9AC-FHKNPRTV-Y]{4}$/i

const ENGLAND_CARRIER_REGISTRATION_NUMBER_REGEX = /^CBD[LU]\d{3,}$/i
const SEPA_CARRIER_REGISTRATION_NUMBER_REGEX =
	/^((WCR\/R\/\d{7})|((SCO|SEA|SNO|SWE|WCR)\/\d{6}))$/i
const NRU_CARRIER_REGISTRATION_NUMBER_REGEX =
	ENGLAND_CARRIER_REGISTRATION_NUMBER_REGEX
const NI_CARRIER_REGISTRATION_NUMBER_REGEX = /^ROC\W*[UL]T\W*\d{1,5}$/i

const ALL_SITE_AUTHORISATION_NUMBER_REGEXES = [
	/^[A-Z]{2}\d{4}[A-Z]{2}$/i,
	/^[A-Z]{2}\d{4}[A-Z]{2}\/D\d{4}$/i,
	/^EPR\/[A-Z]{2}\d{4}[A-Z]{2}$/i,
	/^EPR\/[A-Z]{2}\d{4}[A-Z]{2}\/D\d{4}$/i,
	/^EAWML\d{6}$/i,
	/^WML\d{6}$/i,
	/^PPC\/[AWEN]\/\d{7}$/i,
	/^WML\/[LWEN]\/\d{7}$/i,
	/^WML\/[LWEN]\/\d{7}\/\d{2}$/i,
	/^PPC\/A\/SEPA\d{4}-\d{4}$/i,
	/^WML\/L\/SEPA\d{4}-\d{4}$/i,
	/^EAS\/P\/\d{6}$/i,
	/^P\d{4}\/\d{2}[A-Z]$/i,
	/^P\d{4}\/\d{2}[A-Z]\/V\d+$/i,
	/^WPPC \d{2}\/\d{2}$/i,
	/^WPPC \d{2}\/\d{2}\/V\d+$/i,
	/^WML \d{2}\/\d+(\/T)? LN\/\d{2}\/\d+(\/([MTCN]|V\d+))*$/i,
	/^WML \d{2}\/\d+ PAC\/\d{4}\/WCL\d{3}$/i
]

const EA_NRW_CONSIGNMENT_CODE_REGEX = /^[A-Za-z0-9]{2,}\/[A-Za-z0-9]{5}[A-Za-z]?$/
const SEPA_CONSIGNMENT_CODE_REGEX = /^S[ABC]\d{7}$/
const NIEA_CONSIGNMENT_CODE_REGEX = /^D[ABC]\d{7}$/

const VALID_CONTAINER_TYPES = new Set([
	'BAG',
	'BAL',
	'BOX',
	'CAN',
	'CAR',
	'CAS',
	'CON',
	'DRU',
	'FIB',
	'IBC',
	'LOO',
	'PAL',
	'ROR',
	'SKI',
	'TAN',
	'WBI'
])

const VALID_DISPOSAL_OR_RECOVERY_CODES = new Set([
	'R1',
	'R2',
	'R3',
	'R4',
	'R5',
	'R6',
	'R7',
	'R8',
	'R9',
	'R10',
	'R11',
	'R12',
	'R13',
	'D1',
	'D2',
	'D3',
	'D4',
	'D5',
	'D6',
	'D7',
	'D8',
	'D9',
	'D10',
	'D11',
	'D12',
	'D13',
	'D14',
	'D15'
])

const VALID_POP_CODES = new Set([
	'END',
	'HCBD',
	'PCNS',
	'SCCPS',
	'TETRABDE',
	'PENTABDE',
	'HEXABDE',
	'HEPTABDE',
	'DECABDE',
	'PBDES',
	'PFOS',
	'PCDD_PCDF',
	'DDT',
	'CHL',
	'HCH',
	'DLD',
	'ENDN',
	'HPT',
	'HCB',
	'CLD',
	'ALD',
	'PECBZ',
	'PCB',
	'MRX',
	'TOX',
	'HBB',
	'HBCD',
	'PCP',
	'PFOA',
	'DCF',
	'PFHXS'
])

// Documentation-side subset. Keep this broad enough for worked examples and tests
// in the docs repo; the live API remains the canonical source of truth.
const VALID_EWC_CODES = new Set([
	'010101',
	'170504',
	'200101',
	'200102',
	'200103',
	'200121'
])

const HAZARDOUS_EWC_CODES = new Set(['200121'])

const PHONE_CHARACTERS_REGEX = /^\+?[0-9()\-\s]+$/

const normalize = (value) => String(value ?? '').trim()
const normalizeCode = (value) => normalize(value).replace(/\s/g, '')
const digitCount = (value) => normalize(value).replace(/\D/g, '').length

export function isValidAuthorisationNumber(authorisationNumber) {
	const trimmed = normalize(authorisationNumber)
	if (!trimmed) {
		return false
	}

	return ALL_SITE_AUTHORISATION_NUMBER_REGEXES.some((regex) =>
		regex.test(trimmed)
	)
}

export function isValidCarrierRegistrationNumber(registrationNumber) {
	const trimmed = normalize(registrationNumber)
	if (!trimmed) {
		return false
	}

	return [
		ENGLAND_CARRIER_REGISTRATION_NUMBER_REGEX,
		SEPA_CARRIER_REGISTRATION_NUMBER_REGEX,
		NRU_CARRIER_REGISTRATION_NUMBER_REGEX,
		NI_CARRIER_REGISTRATION_NUMBER_REGEX
	].some((regex) => regex.test(trimmed))
}

export function isValidContainerType(containerType) {
	return VALID_CONTAINER_TYPES.has(normalize(containerType).toUpperCase())
}

export function isValidDisposalOrRecoveryCode(code) {
	return VALID_DISPOSAL_OR_RECOVERY_CODES.has(normalize(code).toUpperCase())
}

export function isValidEwcCode(code) {
	const normalized = normalizeCode(code)
	if (!/^\d{6}$/.test(normalized)) {
		return false
	}

	return VALID_EWC_CODES.has(normalized)
}

export function isHazardousEwcCode(code) {
	const normalized = normalizeCode(code)
	return HAZARDOUS_EWC_CODES.has(normalized)
}

export function isValidHazardousWasteConsignmentCode(code) {
	const trimmed = normalize(code)
	if (!trimmed) {
		return false
	}

	return [
		EA_NRW_CONSIGNMENT_CODE_REGEX,
		SEPA_CONSIGNMENT_CODE_REGEX,
		NIEA_CONSIGNMENT_CODE_REGEX
	].some((regex) => regex.test(trimmed))
}

export function isValidPhoneNumber(phoneNumber) {
	const trimmed = normalize(phoneNumber)
	if (!trimmed) {
		return false
	}

	if (!PHONE_CHARACTERS_REGEX.test(trimmed)) {
		return false
	}

	const digits = digitCount(trimmed)
	return digits >= 7 && digits <= 15
}

export function isValidPopCode(code) {
	return VALID_POP_CODES.has(normalize(code).toUpperCase())
}

// ---------------------------------------------------------------------------
// Soft-delete business rule helpers (D-009)
// ---------------------------------------------------------------------------
// These functions return the standard { key, errorType, message } validation
// envelope for each D-009 rule violation. They are called from the service
// layer (which has datastore access) rather than from within the Joi schemas
// (which only see a single request body at validation time).

/**
 * Warning returned when isDeleted: true is supplied on a POST (create).
 * The service layer accepts the request, forces isDeleted to false, and
 * includes this warning in the response envelope.
 */
export function isDeletedOnCreateWarning() {
	return {
		key: 'isDeleted',
		errorType: 'NotAllowed',
		message: 'isDeleted cannot be set to true when creating a new record.'
	}
}

/**
 * Error returned when PUT attempts to soft-delete a Movement that already
 * has a Collection recorded against it (regardless of whether that Collection
 * is itself deleted — the stricter reading of D-009).
 */
export function movementHasCollectionError() {
	return {
		key: 'isDeleted',
		errorType: 'BusinessRuleViolation',
		message: 'Cannot delete this movement: a collection has already been recorded against it.'
	}
}

/**
 * Error returned when PUT attempts to soft-delete a Collection whose parent
 * Movement has already been referenced in a Drop-off.
 */
export function collectionMovementInDropOffError() {
	return {
		key: 'isDeleted',
		errorType: 'BusinessRuleViolation',
		message: 'Cannot delete this collection: this movement has already been included in a drop-off.'
	}
}

/**
 * Error returned when PUT attempts to soft-delete a Drop-off (Transfer) that
 * already has a Receipt recorded against it.
 */
export function dropOffHasReceiptError() {
	return {
		key: 'isDeleted',
		errorType: 'BusinessRuleViolation',
		message: 'Cannot delete this transfer: a receipt has already been recorded against it.'
	}
}

/**
 * Error returned when a Collection is recorded or updated against a Movement
 * that is currently isDeleted: true.
 */
export function deletedMovementBlocksCollectionError() {
	return {
		key: 'movementId',
		errorType: 'BusinessRuleViolation',
		message: 'Cannot record a collection: this movement is marked as deleted.'
	}
}

/**
 * Error returned when a Drop-off includes a movementId whose Movement record
 * is currently isDeleted: true.
 */
export function deletedMovementBlocksDropOffError(movementId) {
	return {
		key: 'movementIds',
		errorType: 'BusinessRuleViolation',
		message: `Cannot include movementId ${movementId} in this drop-off: it is marked as deleted.`
	}
}

/**
 * Error returned when a Drop-off includes a movementId whose Collection is
 * currently isDeleted: true.
 */
export function deletedCollectionBlocksDropOffError(movementId) {
	return {
		key: 'movementIds',
		errorType: 'BusinessRuleViolation',
		message: `Cannot include movementId ${movementId} in this drop-off: its collection is marked as deleted.`
	}
}

/**
 * Error returned when a Receipt is recorded or updated against a Transfer
 * that is currently isDeleted: true.
 */
export function deletedTransferBlocksReceiptError() {
	return {
		key: 'transferId',
		errorType: 'BusinessRuleViolation',
		message: 'Cannot record a receipt: this transfer is marked as deleted.'
	}
}
