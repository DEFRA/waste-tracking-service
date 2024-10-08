import * as constraints from './constraints';

export const numeric = '0-9';
export const alphabetic = 'a-zA-Z';
export const alphaNumeric = `${alphabetic}${numeric}`;

export const referenceRegex = new RegExp(
  `^[${alphaNumeric}\\-\\/\\\\_ ]{${constraints.ReferenceChar.min},${constraints.ReferenceChar.max}}$`,
);

export const postcodeRegex = new RegExp(
  `^[${alphabetic}]{1,2}\\d{1,2}[${alphabetic}]?\\s?\\d[${alphabetic}]{2}$`,
);

export const emailRegex = new RegExp(
  `^[${alphaNumeric}._%+-]+@[${alphaNumeric}.-]+\\.[${alphabetic}]{2,}$`,
);

export const phoneRegex = new RegExp(
  '^((\\+ 44|\\+ \\(44|\\+\\(44|\\+44|0044|00 44|00-44|00\\(44|00 \\(44)[1-9 \\-()][( -\\d)]{6,18}[\\d]|[0][(1-9][( -\\d)]{8,18}[\\d])$',
);

export const faxRegex = phoneRegex;
