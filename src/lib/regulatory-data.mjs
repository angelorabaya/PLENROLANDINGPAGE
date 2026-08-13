/**
 * Single source of truth for PLENRO regulatory data
 * (permit types, vehicle/equipment registration fees, and fines & penalties).
 *
 * Deliberately framework-agnostic plain ESM with JSDoc types so it can be reused by:
 *  - the React UI (`regulatory-section.tsx`)
 *  - the Cloudflare Pages chat function (as grounding for the AI assistant)
 *  - Node unit tests
 *
 * IMPORTANT: Keep these figures in sync with the official sources under
 * `public/knowledge/` (Ordinance No. 1571-2022 and RA 7942).
 */

/** @typedef {{ name: string; validity: string; definition?: string }} PermitType */

/** @type {PermitType[]} */
export const permitTypes = [
  {
    name: 'Commercial Sand and Gravel Permit (CSAG)',
    validity: '1 year',
    definition:
      'Any Qualified Person may apply for a Commercial Sand and Gravel Permit with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for the extraction, removal and disposition of sand and gravel and other loose or unconsolidated materials which are used in their natural state without undergoing processing covering an area of not more than five (5) hectares for a term of one (1) year from date of issuance thereof, renewable for like period and in such quantities as may be specified in the Permit: Provided, That only one (1) Permit shall be granted to a Qualified Person in a municipality at any one time under such terms and conditions as provided herein.',
  },
  {
    name: 'Industrial Sand and Gravel Permit (ISAG)',
    validity: '5 years',
    definition:
      'Any Qualified Person may apply for an Industrial Sand and Gravel Permit (MGB Form Nos. 8-1 or 8-1A and 8-2 or 8-2A) with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for the extraction, removal and disposition of sand and gravel and other loose or unconsolidated materials that necessitate the use of mechanical processing covering an area of not more than five (5) hectares at any one time for a term of five (5) years from date of issuance thereof, renewable for like periods but not to exceed a total term of twenty-five (25) years: Provided, That any Qualified Person may apply for an Industrial Sand and Gravel Permit with the Regional Director through the Regional Office for areas covering more than five (5) hectares but not to exceed twenty (20) hectares at any one time for a term of five (5) years from date of issuance thereof, renewable for like periods but not to exceed a total term of twenty-five (25) years: Provided, further, That only one (1) Permit shall be granted to a Qualified Person in a municipality at any one time under such terms and conditions as provided herein.',
  },
  {
    name: 'Quarry Permit (QP)',
    validity: '5 years',
    definition:
      'Any Qualified Person may apply for a Quarry Permit with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for the extraction, removal and disposition of quarry resources covering an area of not more than five (5) hectares, and a production rate of not more than fifty thousand (50,000) tons annually and/or whose project cost is not more than Ten Million Pesos (PhP10,000,000.00), for a term of five (5) years from the date of issuance thereof, renewable for like period but not to exceed a total term of twenty-five (25) years: Provided, That application for renewal shall be filed before the expiry date of the Permit: Provided, further, That the Permit Holder has complied with all the terms and conditions of the Permit as provided herein and has not been found guilty of violation of any provision of the Act and these implementing rules and regulations: Provided, furthermore, That no Quarry Permit shall be issued or granted on any area covered by a Mineral Agreement or FTAA, except on areas where a written consent is granted by the Mineral Agreement or FTAA Contractor: Provided, finally, That existing Quarry Permits at the effectivity of Department Administrative Order No. 99-57 under which the production rate is more than fifty thousand (50,000) tons annually and/or whose project cost is more than Ten Million Pesos (PhP10,000,000.00) shall not be renewed but shall be given preferential right to a Mineral Agreement application which shall be evaluated and approved in accordance with Chapter VI hereof and all other applicable provisions of the Act and these implementing rules and regulations.',
  },
  {
    name: 'Government Gratuitous Permit (GGP)',
    validity: '1 year',
    definition:
      'Any Government entity/instrumentality in need of quarry, sand and gravel or loose/unconsolidated materials in the construction of building(s) and/or infrastructure for public use or other purposes may apply for a Government Gratuitous Permit (MGB Form No. 8-3B) with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for a period coterminous with the construction stage of the project but not to exceed one (1) year in public/private land(s) covering an area of not more than two (2) hectares. The applicant shall submit a project proposal stating where the materials to be taken shall be used and the estimated volume needed.',
  },
  {
    name: 'Private Gratuitous Permit (PGP)',
    validity: '2 months',
    definition:
      'Any landowner may apply for a Private Gratuitous Permit with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for the extraction, removal and utilization of quarry, sand and gravel or loose/unconsolidated materials from his/her land for a non-renewable period of sixty (60) calendar days: Provided, That there is adequate proof of ownership and that the materials shall be for personal use.',
  },
  {
    name: 'Special Permit (EMP)',
    validity: '6 months',
    definition:
      'Any individual who wishes to develop his/her idle land into productive use, wherein, during the course of development, there is a need to extract and dispose of a specific volume of ordinary earth, limestone, sand and gravel, and other quarry materials therefrom, may apply for a Special Permit to Extract and Dispose (Earth Moving Permit) with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board. The permit is only valid for six (6) months from the date of issuance and is not renewable.',
  },
];

/** @typedef {{ particular: string; fee: string }} RegistrationFee */

/** @type {RegistrationFee[]} */
export const registrationFeesData = [
  { particular: 'Allowable Loading Capacity per Truckload', fee: '14 cu.m.' },
  { particular: 'Charges for Excess Load', fee: '₱500.00/cu.m.' },
  { particular: 'Payment for Vehicle Stickers', fee: '₱150.00' },
  { particular: 'Trucks with 10 to 14 Cubic Meters Maximum Capacity', fee: '₱850.00/Unit/Year' },
  { particular: 'Trucks with 7 to 9 Cubic Meters Capacity', fee: '₱750.00/Unit/Year' },
  { particular: 'Trucks with 5 to 9 Cubic Meters Maximum Capacity', fee: '₱500.00/Unit/Year' },
  { particular: 'Trucks/Vehicle with Below 5 Cubic Meters Maximum Capacity', fee: '₱300.00/Unit/Year' },
  { particular: 'Pay Loader', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Bulldozer', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Backhoe', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Crane', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Aggregates Crusher and/or Separator', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Limestone Crusher and/or Pulverizer', fee: '₱2,500.00/Unit/Year' },
];

/** @typedef {{ section: string; fine: string; charge: string }} Fine */

/** @type {Fine[]} */
export const finesData = [
  { section: 'Section 37 (a)', fine: 'Late Submission of Report', charge: '₱2,000.00' },
  { section: 'Section 37 (b)', fine: 'Non-Submission of Report (1 month from the prescribed period)', charge: '₱2,000.00' },
  { section: 'Section 37 (c)', fine: 'Failure to carry "Delivery Receipts" on the transport of sand and gravel and other quarry resources', charge: '₱5,000.00' },
  { section: 'Section 37 (d)', fine: 'Failure to carry "Ore Transport Permit" in the Transport/Delivery of Minerals', charge: '₱5,000.00' },
  { section: 'Section 37 (e)', fine: 'Extraction and/or Hauling of Sand and Gravel and other Quarry Resources without Permit', charge: '₱500.00' },
  { section: 'Section 37 (f)', fine: 'Extraction and/or Hauling of Minerals without Permit', charge: '₱1,500.00' },
  { section: 'Section 37 (g)', fine: 'Any unregistered vehicle/equipment used in the extraction/hauling/transport of mineral resources', charge: '₱3,000.00' },
  { section: 'Section 37 (h)', fine: 'Any Extraction and Removal or Sale of Materials Outside the Permit Area (Basic Fine)', charge: '₱5,000.00' },
  { section: 'Section 37 (i)', fine: 'Late Filing of Application for Renewal of Permit', charge: '₱5,000.00' },
  { section: 'Section 37 (j)', fine: 'Buying/Selling of Illegally-Sourced Quarry/Mineral Resource', charge: '₱5,000.00' },
  { section: 'Section 37 (k)', fine: 'Buying/Selling/Recycling/Misused of Required Transport/Delivery/Hauling Documents', charge: '₱5,000.00' },
  { section: 'Section 37 (l)', fine: 'Any Processor, Trader, Hauler, Dealer or Retailer Found to Process or Transport Quarry, Mineral Products and By-Products without required Governors Registration', charge: '₱5,000.00' },
  { section: 'Section 37 (m)', fine: 'Any Person Who Refuses, Obstruct or Hampers Lawful Inspection of the Quarrying/Mining Areas, Stockpile or Any Premises where Quarrying/Mineral/Mineral Products and By-Products are being stored stockpiled or dumped', charge: '₱5,000.00' },
  { section: 'Section 37 (n)', fine: 'Illegal Transport of Quarry/Mineral Resources imposable against the Owner and Driver of the Apprehended Trucks', charge: '₱5,000.00' },
  { section: 'Section 37 (o)', fine: 'Over Extraction based on the volume and type of materials computed on actual (Basic Fine)', charge: '₱5,000.00' },
  { section: 'Section 37 (p)', fine: 'Any transportation of processed mineral/mineral products without the required valid transport/hauling documents', charge: '₱5,000.00' },
  { section: 'Section 36 (i)', fine: 'Allowable Loading Capacity per Truckload - Charges for Excess Load', charge: '₱500.00' },
];

/**
 * Render a compact, plain-text digest of the structured regulatory data.
 * Used to ground the AI assistant so its answers stay consistent with the UI tables.
 * @returns {string}
 */
export function buildRegulatorySummary() {
  const lines = [];

  lines.push('PERMIT TYPES AND VALIDITY:');
  for (const permit of permitTypes) {
    lines.push(`- ${permit.name} — Validity: ${permit.validity}`);
  }

  lines.push('');
  lines.push('VEHICLE AND EQUIPMENT REGISTRATION FEES:');
  for (const item of registrationFeesData) {
    lines.push(`- ${item.particular}: ${item.fee}`);
  }

  lines.push('');
  lines.push('FINES AND PENALTIES (SELECTED):');
  for (const item of finesData) {
    lines.push(`- ${item.section} — ${item.fine}: ${item.charge}`);
  }

  return lines.join('\n');
}
