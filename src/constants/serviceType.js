// src/constants/serviceType.js
export const ServiceType = Object.freeze({
  HOTEL: 1,
  CAR: 2,
  FLIGHT: 3,
  ACTIVITY: 4
});

export const ServiceTypeLabel = {
  [ServiceType.HOTEL]: "room",
  [ServiceType.CAR]: "car",
  [ServiceType.FLIGHT]: "flight",
  [ServiceType.ACTIVITY]: 'activity'
};

export const PaymentMethod = Object.freeze({
  ONLINE: 1,
  CASH: 2,
});

export const PaymentMethodLabel = {
  [PaymentMethod.ONLINE]: "Online Payment",
  [PaymentMethod.CASH]: "Pay directly at the service provider",
};