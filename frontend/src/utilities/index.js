export const getError = (error) => {
  return error.message && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const roundToTwo = (num) => {
  return +(Math.round(num + "e+2") + "e-2");
};
