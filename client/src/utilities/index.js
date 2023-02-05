export const roundToTwo = (num) => {
  return +(Math.round(num + "e+2") + "e-2");
};

export const getError = (error) =>
  error.message && error.response.data.message
    ? error.response.data.message
    : error.message;
