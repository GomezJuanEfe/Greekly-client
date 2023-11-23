/**
 * This function calculates total price of a new order
 * @param {Array} products cartProduct: Array of Objects
 * @returns {numer} Total price
 */
export const totalPrice = (products) => {
  let sum = 0
  products.forEach(product => sum += product.price)
  return sum
}

/**
 * This function return the price formated in US dollars
 * @param {number} price: number
 * @returns {number} Formated price
 */
export const formatToDollars = (price) => {
  const dollars = (price / 100).toFixed(2);

  return `$${dollars}`;
}
