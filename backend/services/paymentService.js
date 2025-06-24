// backend/services/paymentService.js

class PaymentService {
  /**
   * In a real application, this would interact with payment gateways
   * like Stripe, PayPal, etc., and the available methods might change
   * based on the user's country, cart total, etc.
   * @param {object} checkoutInfo - Information about the checkout process.
   * @returns {Array} A list of available payment methods.
   */
  getMethods(checkoutInfo = {}) {
    // For now, we'll return a static list of payment methods.
    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit Card (Stripe)',
        description: 'Pay with your credit card via Stripe.',
        icon: '/assets/icons/payment-stripe.svg', // Example path
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account.',
        icon: '/assets/icons/payment-paypal.svg',
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay with cash upon delivery.',
        icon: '/assets/icons/payment-cod.svg',
      }
    ];

    // Here you could add logic to filter methods based on checkoutInfo
    // For example: if (checkoutInfo.total > 1000) { ... remove COD ... }

    return paymentMethods;
  }
}

// Export a singleton instance
module.exports = new PaymentService(); 