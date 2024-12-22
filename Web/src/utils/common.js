export const getRandomDate = (start, end) => {
  const startTime = start.getTime();
  const endTime = end.getTime();

  if (startTime > endTime) {
    throw new Error("Start date must be before or equal to the end date.");
  }

  const randomTime = Math.random() * (endTime - startTime) + startTime;
  return new Date(randomTime).toISOString();
};
