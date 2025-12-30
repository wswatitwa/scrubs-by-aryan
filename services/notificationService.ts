
/**
 * Mock Notification Service
 * production: Integrates with Twilio or WhatsApp Business API
 */

export const notifyStaffOfNewOrder = (orderId: string) => {
  return {
    type: 'whatsapp',
    message: `Order #${orderId} has been successfully paid.`,
    timestamp: new Date().toLocaleTimeString()
  };
};

export const notifyCustomerOfShipping = (customerPhone: string, orderId: string) => {
  return {
    type: 'sms',
    message: `Shipment confirmed for Order #${orderId}. Track your delivery in the portal.`,
    timestamp: new Date().toLocaleTimeString()
  };
};
