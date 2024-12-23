export const getRandomDate = (start, end) => {
  const startTime = start.getTime();
  const endTime = end.getTime();

  if (startTime > endTime) {
    throw new Error("Start date must be before or equal to the end date.");
  }

  const randomTime = Math.random() * (endTime - startTime) + startTime;
  return new Date(randomTime).toISOString();
};

export const getRandomNumberInRange = (min, max) => {
  if (min > max) {
    throw new Error("Min value cannot be greater than max value.");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
