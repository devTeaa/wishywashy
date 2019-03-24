import numeral from "numeral";

// Update TransactionForm 363
export function calculateService(quantity, unit = null, price, isExpress, expressPrice) {
  quantity = unit === "kg" && quantity < 3 ? 3 : Math.ceil(quantity * 2) / 2;

  return numeral(quantity * (price + (isExpress ? expressPrice : 0))).format("0,0");
}

export function calculateServiceNumber(quantity, price, isExpress, expressPrice) {
  return quantity * (price + (isExpress ? expressPrice : 0));
}
