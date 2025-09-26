export const formatCurrency = (amount) => {
    if (!amount) return "0";
    const num =
        typeof amount === "string"
            ? parseFloat(amount.replace(/[^\d]/g, ""))
            : amount;
    return new Intl.NumberFormat("vi-VN").format(num || 0);
};