# Upcoming API changes

This page summarises upcoming changes to the Receipt of Waste API.

Past changes currently live in production are listed in the [Receipt of Waste API changelog](https://github.com/DEFRA/waste-tracking-service/wiki/Receipt-of-Waste-API-Changelog).

## New SEPA authorisation numbers

**Type:** <strong class="govuk-tag govuk-tag--green">Non-breaking</strong>

**Status:** Planned

**Test environment date:** 19 November 2026 (estimated)

**Production environment date:**  19 November 2026 (estimated)

**Affects:** Receivers submitting movements that include any permit numbers issued by SEPA


### What you need to do

This SEPA receiver authorisation number format is now also accepted:

- EAS/P/9999999

The following SEPA broker or dealer and carrier authorisation number formats are now also accepted:

- WCR/ZZZZZZ – where ZZZZZZ is a 6-character combination of letters and numbers, for example, WCR/02bd5f

- EAS/R/9999999

- SCO/999999/B

- SCO/999999/CB

- SEA/999999/CB

- SNO/999999/CB

- SWE/999999/CB

## New EWC Codes 

**Type:** <strong class="govuk-tag govuk-tag--green">Non-breaking</strong>

**Status:** Planned

**Test environment date:** 19th November 2026 (estimated)

**Production environment date:** 19th November (estimated)

**Affects:**  Waste receiving sites in Northern Ireland

This change introduces European Waste Catalogue (EWC) codes that meet new EU legislation for Northern Ireland. These new codes will also be included in GET ewc-codes method. 

## Report hazardous and POPs concentrations as a threshold

**Type:** <strong class="govuk-tag govuk-tag--green">Non-breaking</strong>

**Status:** Planned

**Test environment date:** 21 October 2026

**Production environment date:** 21 October 2026

**Affects:** Receivers who accept hazardous or POPs waste

This change allows you to report a concentration as a threshold (for example, "greater than 100 mg/kg") as well as an exact value. We've added this because users told us they often only know a limit, and the regulators support the change.

### What you need to do

Your current integration will keep working. If your users receive hazardous or POPs waste, we recommend adding this as soon as possible, so they can report thresholds.

To report a threshold, use the new `concentrationOperator` field on hazardous and POPs components in `wasteItems`:

- put the number in `concentration` (mg/kg, greater than zero, no symbol or unit)
- put the symbol in `concentrationOperator`: `>` for hazardous components, `<` or `>` for POPs

Leave out concentrationOperator when you're reporting an exact value, or when concentration is null. A null concentration will continue to return a 201 response with a warning that a concentration value is recommended when sourceOfComponents is PROVIDED_WITH_WASTE, GUIDANCE or OWN_TESTING.

[Field descriptions and validation rules for `concentrationOperator`](api-specification.md)

### Known issue

If you send both `concentration` and `concentrationOperator` as null, you'll get a 400 response saying the concentration must be specified. Leave out `concentrationOperator` instead. The movement will be created with a 200, but with a warning that a concentration value is recommended.

<!-- Template for a breaking change. Delete this comment and the example when adding real entries.

## Change title

**Type:** <strong class="govuk-tag govuk-tag--orange">Breaking</strong>

**Status:** Planned

**Test environment date:** [date]

**Production environment date:** [date]

**Affects:** [who]

[What is changing and why.]

### What you need to do

[Your current integration will stop working unless you update it before the production date. Say what to change.]

-->

Past changes currently in production appear in the [Receipt of Waste API changelog](https://github.com/DEFRA/waste-tracking-service/wiki/Receipt-of-Waste-API-Changelog).

<br>Page last updated on November 10th.

