const PAID_ORDER_STORAGE_KEY = "foodhub-paid-order-ids";

const readStoredOrderIds = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(PAID_ORDER_STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((orderId) => typeof orderId === "string");
  } catch {
    return [];
  }
};

const saveStoredOrderIds = (orderIds: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const uniqueOrderIds = Array.from(new Set(orderIds));
  window.localStorage.setItem(
    PAID_ORDER_STORAGE_KEY,
    JSON.stringify(uniqueOrderIds)
  );
};

export const getPaidOrderIds = (): string[] => readStoredOrderIds();

export const isOrderMarkedPaid = (orderId?: string) => {
  if (!orderId) {
    return false;
  }

  return readStoredOrderIds().includes(orderId);
};

export const markOrderAsPaid = (orderId: string) => {
  if (!orderId) {
    return;
  }

  const storedOrderIds = readStoredOrderIds();
  if (storedOrderIds.includes(orderId)) {
    return;
  }

  saveStoredOrderIds([...storedOrderIds, orderId]);
};
