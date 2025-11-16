// src/constants/serviceType.js
export const ServiceType = Object.freeze({
  HOTEL: 1,
  CAR: 2,
  FLIGHT: 3,
  ACTIVITY: 4,
  HANDBOOK: 5
});

export const ServiceTypeLabel = {
  [ServiceType.HOTEL]: "room",
  [ServiceType.CAR]: "car",
  [ServiceType.FLIGHT]: "flight",
  [ServiceType.ACTIVITY]: 'activity',
  [ServiceType.HANDBOOK]: 'handbook'
};

export const ServiceTypeLabelVi = {
  [ServiceType.HOTEL]: "Phòng",
  [ServiceType.CAR]: "Xe",
  [ServiceType.FLIGHT]: "Máy bay",
  [ServiceType.ACTIVITY]: 'Hoạt động',
  [ServiceType.HANDBOOK]: 'Cẩm nang'
};

export const PAYMENT_STATUS = {
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
  CANCELLED: 4,
  UNPAID: 5,
  PAID: 6,
};

export const PAYMENT_STATUS_VI = {
  [PAYMENT_STATUS.PENDING + ""]: "Đang chờ xử lý",
  [PAYMENT_STATUS.SUCCESS + ""]: "Thành công",
  [PAYMENT_STATUS.FAILED + ""]: "Thất bại",
  [PAYMENT_STATUS.CANCELLED + ""]: "Đã hủy",
  [PAYMENT_STATUS.UNPAID + ""]: "Chưa thanh toán",
  [PAYMENT_STATUS.PAID + ""]: "Đã thanh toán",
};

export const PaymentMethod = Object.freeze({
  ONLINE: 1,
  CASH: 2,
});

export const PaymentMethodLabel = {
  [PaymentMethod.ONLINE]: "Online Payment",
  [PaymentMethod.CASH]: "Pay directly at the service provider",
};