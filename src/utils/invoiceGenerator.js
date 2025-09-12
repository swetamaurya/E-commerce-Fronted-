// Currency formatting function
const formatCurrency = (amount) => {
  return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
};

// Invoice generation utility
export const generateInvoice = async (order) => {
  try {
    // Dynamic import for jsPDF
    const { jsPDF } = await import('jspdf');
    
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Set font
    doc.setFont('helvetica');
    
    // Invoice Header
    doc.setFontSize(24);
    doc.setTextColor(13, 148, 136); // Teal color
    doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Order #${order.orderId || order._id?.slice(-8) || 'N/A'}`, pageWidth / 2, yPosition + 8, { align: 'center' });
    
    yPosition += 25;
    
    // Draw line under header
    doc.setDrawColor(13, 148, 136);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;
    
    // Invoice Details Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Bill To section
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text('BILL TO:', 20, yPosition);
    doc.setFontSize(9);
    doc.text(`${order.customerName || 'N/A'}`, 20, yPosition + 5);
    doc.text(`${order.customerEmail || 'N/A'}`, 20, yPosition + 10);
    doc.text(`Phone: ${order.customerPhone || 'N/A'}`, 20, yPosition + 15);
    
    if (order.shippingAddress) {
      doc.text(`${order.shippingAddress.street || order.shippingAddress.addressLine1 || ''}`, 20, yPosition + 20);
      doc.text(`${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.pincode || ''}`, 20, yPosition + 25);
      doc.text(`${order.shippingAddress.country || 'India'}`, 20, yPosition + 30);
    }
    
    // Invoice Details (right side)
    const currentDate = new Date().toLocaleDateString('en-IN');
    const orderDate = new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN');
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text('INVOICE DETAILS:', pageWidth - 90, yPosition);
    doc.setFontSize(9);
    doc.text(`Invoice Date: ${currentDate}`, pageWidth - 90, yPosition + 5);
    doc.text(`Order Date: ${orderDate}`, pageWidth - 90, yPosition + 10);
    doc.text(`Payment: ${order.paymentMethod || 'COD'}`, pageWidth - 90, yPosition + 15);
    doc.text(`Status: ${order.status || 'Order Received'}`, pageWidth - 90, yPosition + 20);
    
    if (order.trackingNumber) {
      doc.text(`Tracking: ${order.trackingNumber}`, pageWidth - 90, yPosition + 25);
    }
    
    yPosition += 40;
    
    // Order Items Table
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('ORDER ITEMS', 20, yPosition);
    yPosition += 10;
    
    // Table headers
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(13, 148, 136);
    doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    
    doc.text('Item', 22, yPosition);
    doc.text('Price', pageWidth - 100, yPosition);
    doc.text('Qty', pageWidth - 70, yPosition);
    doc.text('Total', pageWidth - 40, yPosition);
    
    yPosition += 8;
    
    // Table content
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    
    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Draw row border
        doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
        
        // Item name (allow longer names)
        const itemName = (item.productName || item.title || 'Product').substring(0, 40);
        doc.text(itemName, 22, yPosition);
        
        // Price
        doc.text(formatCurrency(item.price || 0), pageWidth - 100, yPosition);
        
        // Quantity
        doc.text(`${item.quantity || 0}`, pageWidth - 70, yPosition);
        
        // Total
        const total = (item.quantity || 0) * (item.price || 0);
        doc.text(formatCurrency(total), pageWidth - 40, yPosition);
        
        yPosition += 8;
      });
    } else {
      doc.text('No items found', 22, yPosition);
      yPosition += 8;
    }
    
    yPosition += 10;
    
    // Order Summary
    doc.setDrawColor(13, 148, 136);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Summary rows
    const subtotal = order.totalAmount || order.subtotal || 0;
    const tax = order.taxAmount || 0;
    const discount = order.discountAmount || 0;
    const total = order.totalAmount || order.total || 0;
    
    doc.text('Subtotal:', pageWidth - 90, yPosition);
    doc.text(formatCurrency(subtotal), pageWidth - 50, yPosition);
    yPosition += 5;
    
    doc.text('Shipping:', pageWidth - 90, yPosition);
    doc.text('Free', pageWidth - 50, yPosition);
    yPosition += 5;
    
    doc.text('Tax:', pageWidth - 90, yPosition);
    doc.text(formatCurrency(tax), pageWidth - 50, yPosition);
    yPosition += 5;
    
    if (discount > 0) {
      doc.text('Discount:', pageWidth - 90, yPosition);
      doc.text(`-${formatCurrency(discount)}`, pageWidth - 50, yPosition);
      yPosition += 5;
    }
    
    // Total row
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - 90, yPosition - 2, pageWidth - 20, yPosition - 2);
    doc.text('TOTAL:', pageWidth - 90, yPosition);
    doc.text(formatCurrency(total), pageWidth - 50, yPosition);
    
    yPosition += 20;
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });
    doc.text('This is a computer-generated invoice.', pageWidth / 2, yPosition + 5, { align: 'center' });
    doc.text(`Generated on ${currentDate}`, pageWidth / 2, yPosition + 10, { align: 'center' });
    
    // Download the PDF
    const fileName = `Invoice_${order.orderId || order._id?.slice(-8) || 'N/A'}_${currentDate.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

const generateInvoiceHTML = (order) => {
  const currentDate = new Date().toLocaleDateString('en-IN');
  const orderDate = new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN');
  
  return `
    <div class="invoice-header">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-subtitle">Order #${order.orderId || order._id?.slice(-8) || 'N/A'}</div>
    </div>

    <div class="invoice-details">
      <div class="invoice-section">
        <div class="section-title">Bill To</div>
        <div class="section-content">
          <strong>${order.customerName || 'N/A'}</strong><br>
          ${order.customerEmail || 'N/A'}<br>
          Phone: ${order.customerPhone || 'N/A'}<br>
          ${order.shippingAddress ? `
            ${order.shippingAddress.street || order.shippingAddress.addressLine1 || ''}<br>
            ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.pincode || ''}<br>
            ${order.shippingAddress.country || 'India'}
          ` : 'Address not available'}
        </div>
      </div>
      
      <div class="invoice-section">
        <div class="section-title">Invoice Details</div>
        <div class="section-content">
          Invoice Date: ${currentDate}<br>
          Order Date: ${orderDate}<br>
          Payment Method: ${order.paymentMethod || 'Cash on Delivery'}<br>
          Order Status: ${order.status || 'Pending'}<br>
          ${order.trackingNumber ? `Tracking: ${order.trackingNumber}<br>` : ''}
          ${order.estimatedDelivery ? `Est. Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}<br>` : ''}
        </div>
      </div>
    </div>

    <div class="order-items">
      <div class="section-title">Order Items</div>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th class="text-right">Price</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items && order.items.length > 0 ? 
            order.items.map(item => `
              <tr>
                <td>${item.productName || item.title || 'Product'}</td>
                <td>SKU: ${item.productId || 'N/A'}</td>
                <td class="text-right">₹${item.price || 0}</td>
                <td class="text-right">${item.quantity || 0}</td>
                <td class="text-right">₹${(item.quantity || 0) * (item.price || 0)}</td>
              </tr>
            `).join('') : 
            '<tr><td colspan="5" style="text-align: center;">No items found</td></tr>'
          }
        </tbody>
      </table>
    </div>

    <div class="order-summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>₹${order.totalAmount || order.subtotal || 0}</span>
      </div>
      <div class="summary-row">
        <span>Shipping:</span>
        <span>Free</span>
      </div>
      <div class="summary-row">
        <span>Tax:</span>
        <span>₹${order.taxAmount || 0}</span>
      </div>
      <div class="summary-row">
        <span>Discount:</span>
        <span>-₹${order.discountAmount || 0}</span>
      </div>
      <div class="summary-row total">
        <span>Total Amount:</span>
        <span>₹${order.totalAmount || order.total || 0}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>This is a computer-generated invoice.</p>
      <p>Generated on ${currentDate}</p>
    </div>
  `;
};
