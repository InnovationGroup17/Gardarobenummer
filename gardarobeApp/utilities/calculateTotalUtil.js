export const calculateTotalUtil = (data) => {
  let price = 0;
  let items = 0;
  //look at each item in the data array and calculate the total price and total items
  data.forEach((item) => {
    price += item.price * item.amount;
    items += item.amount;

    //if the amount is greater than 0, set the selected property to true, otherwise set it to false
    if (item.amount > 0) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  });

  return { price, items };
};
