export const isEmpty = (value: any): boolean => {
  if (value === '' || value === undefined || value === null) {
    return true;
  }
  return false;
};
