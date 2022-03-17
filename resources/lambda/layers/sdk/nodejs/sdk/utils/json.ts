/* eslint-disable no-param-reassign */
const isEmptyObject = (obj: any) =>
  Object.keys(obj).length === 0 &&
  ![String, Number, Boolean, Array, RegExp, Function, Date].includes(obj.constructor);

export const clean = (obj: any): any => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      clean(obj[key]);
    }
    if (obj[key] === null || obj[key] === undefined || obj[key] === '' || isEmptyObject(obj[key])) {
      delete obj[key];
    }
  });
  return obj;
};

export const groupBy = (objArray: any[], property: string): Record<string, any[]> =>
  objArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
