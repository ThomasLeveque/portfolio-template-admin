export const formatError = (err: any): string => {
  return err.message || err.toString();
};
