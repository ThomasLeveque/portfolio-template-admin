export const toCapitalize = (lowerCaseString: string): string => {
  return lowerCaseString?.charAt(0).toUpperCase() + lowerCaseString?.slice(1);
};
