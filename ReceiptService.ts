
import { Order } from './types';

export const generateReceipt = (order: Order) => {
    const date = new Date(order.createdAt).toLocaleString();
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - ${order.id}</title>
      <style>
        body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
        .receipt-container { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
        .header { text-align: center; border-bottom: 2px solid #001a1a; padding-bottom: 20px; margin-bottom: 20px; }
        .brand { font-size: 24px; font-weight: bold; color: #001a1a; letter-spacing: -1px; }
        .receipt-title { font-size: 14px; text-transform: uppercase; color: #94a3b8; margin-top: 5px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { text-align: left; border-bottom: 1px solid #eee; padding: 10px; font-size: 12px; text-transform: uppercase; color: #94a3b8; }
        .items-table td { padding: 15px 10px; border-bottom: 1px solid #f9f9f9; font-size: 14px; }
        .total-section { border-top: 2px solid #eee; padding-top: 20px; display: flex; flex-direction: column; align-items: flex-end; }
        .total-row { display: flex; justify-content: space-between; width: 250px; margin-bottom: 10px; font-size: 14px; }
        .total-final { font-size: 20px; font-weight: bold; color: #001a1a; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94a3b8; }
        .notes { margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; font-size: 13px; font-style: italic; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <div class="brand">CRUBS BY ARYAN</div>
          <div class="receipt-title">Official Purchase Receipt</div>
        </div>

        <div class="meta">
          <div>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>M-Pesa Code:</strong> ${order.mpesaCode || 'N/A'}</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.customerPhone}</p>
            <p><strong>Location:</strong> ${order.location}</p>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Options</th>
              <th>Qty</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <div style="font-weight: bold;">${item.name}</div>
                  <div style="font-size: 11px; color: #64748b;">${item.category}</div>
                </td>
                <td style="font-size: 12px;">
                  ${item.selectedColor ? `Color: ${item.selectedColor}<br>` : ''}
                  ${item.selectedSize ? `Size: ${item.selectedSize}<br>` : ''}
                  ${item.selectedStyle ? `Style: ${item.selectedStyle}<br>` : ''}
                  ${item.specialInstructions ? `<span style="color: #d97706; font-style: italic;">Note: ${item.specialInstructions}</span>` : ''}
                </td>
                <td>${item.quantity}</td>
                <td style="text-align: right;">KES ${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>KES ${order.subtotal.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>KES ${order.shippingFee.toLocaleString()}</span>
          </div>
          <div class="total-row total-final">
            <span>TOTAL:</span>
            <span>KES ${order.total.toLocaleString()}</span>
          </div>
        </div>

        ${order.notes ? `
          <div class="notes">
            <strong>Order Notes:</strong><br>
            ${order.notes}
          </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for choosing CRUBS BY ARYAN.</p>
          <p>This is a computer-generated receipt. Quality guaranteed.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${order.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
