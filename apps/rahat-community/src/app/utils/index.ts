export const calculateNumberOfDays = (startDate: Date, currentDate: Date) => {
  const targetDate = new Date(startDate);
  const timeDiff = Math.abs(targetDate.getTime() - currentDate.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};

export const parseIsoDateToString = (dateIsoString: string) => {
  const date = new Date(dateIsoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const convertDateToISO = (date: string) => {
  return new Date(date).toISOString();
};

export const convertToValidString = (inputString: string) => {
  // Trim leading and trailing whitespace
  const trimmedString = inputString.trim();

  // Replace spaces with underscores and collapse consecutive underscores
  const stringWithUnderscores = trimmedString
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_');

  // Remove special characters using regex
  const stringWithoutSpecialChars = stringWithUnderscores.replace(
    /[^\w\s]/gi,
    '',
  );

  // Remove underscores at the beginning and end of the string
  const stringWithoutLeadingTrailingUnderscores =
    stringWithoutSpecialChars.replace(/^_+|_+$/g, '');

  // Replace consecutive underscores with a single underscore
  const stringWithoutConsecutiveUnderscores =
    stringWithoutLeadingTrailingUnderscores.replace(/_+/g, '_');

  return stringWithoutConsecutiveUnderscores;
};
