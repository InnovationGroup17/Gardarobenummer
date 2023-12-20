// Function to calculate the total price and total items based on data
export const calculateTotalUtil = (data) => {
  let price = 0; // Initialize the total price to 0
  let items = 0; // Initialize the total items to 0

  // Loop through each item in the data array and calculate the total price and total items
  data.forEach((item) => {
    price += item.price * item.amount; // Multiply item price by its quantity and add to total price
    items += item.amount; // Add the item's quantity to the total items count

    // If the amount is greater than 0, set the 'selected' property to true, otherwise set it to false
    if (item.amount > 0) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  });

  // Return an object containing the calculated total price and total items
  return { price, items };
};
