/**
 * N8N Automation Service
 * Handles sending order confirmation data to N8N webhook
 */

const N8N_WEBHOOK_URL = 'https://taha123codexx.app.n8n.cloud/webhook-test/confirm';

/**
 * Send order confirmation to N8N
 * N8N will then automatically send confirmation email to the user
 * 
 * @param {Object} orderData - The order information to send
 * @param {string} orderData.customerName - Customer's full name
 * @param {string} orderData.email - Customer's email address
 * @param {string} orderData.phone - Customer's phone number
 * @param {Array} orderData.items - Array of ordered items
 * @param {number} orderData.totalPrice - Total order price
 * @param {string} orderData.orderId - Unique order identifier
 * @returns {Promise<Response>} - The response from N8N webhook
 */
export const sendOrderConfirmationToN8N = async (orderData) => {
    try {
        const payload = {
            email: orderData.email,
            name: orderData.customerName,
            phone: orderData.phone,
            items: orderData.items,
            totalPrice: orderData.totalPrice,
            orderId: orderData.orderId,
            orderDate: new Date().toISOString(),
        };

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`N8N webhook returned status ${response.status}`);
        }

        console.log('✓ Order confirmation sent to N8N successfully');
        return response;
    } catch (error) {
        console.error('✗ Error sending to N8N:', error);
        // Log error but don't throw - allow checkout to succeed even if email fails
        throw error;
    }
};

/**
 * Get N8N webhook URL (useful for debugging or dynamic configuration)
 * @returns {string} The N8N webhook URL
 */
export const getN8NWebhookURL = () => N8N_WEBHOOK_URL;
