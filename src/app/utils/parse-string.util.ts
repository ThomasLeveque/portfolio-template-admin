export const toCapitalize = (lowerCaseString: string): string => {
  return lowerCaseString?.charAt(0).toUpperCase() + lowerCaseString?.slice(1);
};

export const getDomain = (url: string): string => {
  return url?.replace(/^https?:\/\//i, '').split('/')[0];
};
