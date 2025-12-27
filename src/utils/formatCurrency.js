export const formatCurrency = (amount) => {
  if (!amount) return "0";
  const num =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^\d]/g, ""))
      : amount;
  return new Intl.NumberFormat("vi-VN").format(num || 0);
};

export const getPriceAfterDiscount = (
  total,
  discount_amount,
  discount_percent
) => {
  if (!total) total = 0;
  if (!discount_amount) discount_amount = 0;
  if (!discount_percent) discount_percent = 0;

  // Ưu tiên percent, amount làm cap
  const percent_discount = (total * discount_percent) / 100;
  let discount = percent_discount;
  if (discount_amount > 0) {
    discount = Math.min(percent_discount, discount_amount);
  }
  return total - discount;
};
