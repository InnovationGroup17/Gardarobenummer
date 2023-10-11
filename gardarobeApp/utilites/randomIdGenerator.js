//make a function that generates a random id

export const randomIdGenerator = () => {
  return Math.random().toString(36).substr(2, 150);
};
