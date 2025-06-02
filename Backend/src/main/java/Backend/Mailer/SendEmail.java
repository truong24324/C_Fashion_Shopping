package Backend.Mailer;

import org.springframework.stereotype.Service;

import Backend.Model.Order;
import Backend.Model.OrderDetail;
import Backend.Service.EmailService;

@Service
public class SendEmail {

	private EmailService emailService; // Make sure to initialize this or inject via constructor

	public void sendOrderConfirmationEmail(String toEmail, Order order) {
		String subject = "🎉 Đặt hàng thành công - Mã đơn #" + order.getOrderCode();

		StringBuilder body = new StringBuilder();

		body.append("<div style='font-family: Arial, sans-serif; max-width: 700px; margin: auto;'>");

		// Header
		body.append("<div style='text-align: center; padding: 20px;'>")
				.append("<h2 style='color: #16a34a;'>🎉 Đặt hàng thành công!</h2>")
				.append("<p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>")
				.append("</div>");

		// Order Info
		body.append("<div style='border: 1px solid #ddd; border-radius: 10px; padding: 20px; margin-top: 20px;'>")
				.append("<h3>🔖 Thông tin đơn hàng</h3>")
				.append("<ul style='list-style: none; padding: 0; line-height: 1.6;'>")
				.append("<li><strong>Mã đơn hàng:</strong> ")
				.append(order.getOrderCode() != null ? order.getOrderCode() : "#" + order.getOrderId())
				.append("</li>")
				.append("<li><strong>Ngày đặt:</strong> ")
				.append(order.getOrderDate() != null ? order.getOrderDate().toString() : "Chưa cập nhật")
				.append("</li>")
				.append("<li><strong>Phương thức thanh toán:</strong> ")
				.append(order.getPaymentMethod() != null ? order.getPaymentMethod() : "Chưa cập nhật")
				.append("</li>")
				.append("<li><strong>Trạng thái thanh toán:</strong> ")
				.append(order.getPaymentStatus() != null ? order.getPaymentStatus() : "Chưa cập nhật")
				.append("</li>")
				.append("<li><strong>Trạng thái đơn hàng:</strong> ")
				.append(order.getOrderStatus() != null ? order.getOrderStatus().toString() : "Chờ xác nhận")
				.append("</li>")
				.append("<li><strong>Người nhận:</strong> ").append(order.getFullName()).append("</li>")
				.append("<li><strong>Email:</strong> ").append(order.getEmail()).append("</li>")
				.append("<li><strong>Số điện thoại:</strong> ").append(order.getPhone()).append("</li>")
				.append("<li><strong>Địa chỉ giao hàng:</strong> ").append(order.getShippingAddress()).append("</li>")
				.append("</ul>")
				.append("</div>");

		// Order Details Table
		body.append("<div style='margin-top: 30px;'>")
				.append("<h3>🛒 Chi tiết sản phẩm</h3>")
				.append("<table style='width: 100%; border-collapse: collapse; font-size: 14px;'>")
				.append("<thead>")
				.append("<tr style='background-color: #f3f4f6;'>")
				.append("<th style='padding: 8px; border: 1px solid #ccc;'>Sản phẩm</th>")
				.append("<th style='padding: 8px; border: 1px solid #ccc;'>Chi tiết</th>")
				.append("<th style='padding: 8px; border: 1px solid #ccc;'>Số lượng</th>")
				.append("<th style='padding: 8px; border: 1px solid #ccc;'>Giá</th>")
				.append("<th style='padding: 8px; border: 1px solid #ccc;'>Tổng</th>")
				.append("</tr>")
				.append("</thead><tbody>");

		for (OrderDetail item : order.getOrderDetails()) {
			body.append("<tr>")
					.append("<td style='padding: 8px; border: 1px solid #ccc;'>")
					.append(item.getVariant().getProduct().getProductName())
					.append("</td>")
					.append("<td style='padding: 8px; border: 1px solid #ccc;'>")
					.append("Màu: ").append(item.getVariant().getColor().getColorName())
					.append(" • Size: ").append(item.getVariant().getSize().getSizeName())
					.append(" • Chất liệu: ").append(item.getVariant().getMaterial().getMaterialName())
					.append("</td>")
					.append("<td style='padding: 8px; border: 1px solid #ccc; text-align: center;'>")
					.append(item.getQuantity())
					.append("</td>")
					.append("<td style='padding: 8px; border: 1px solid #ccc; text-align: right;'>")
					.append(String.format("%,d VND", item.getProductPrice().longValue()))
					.append("</td>")
					.append("<td style='padding: 8px; border: 1px solid #ccc; font-weight: bold; text-align: right;'>")
					.append(String.format("%,d VND", item.getTotalPrice().longValue()))
					.append("</td>")
					.append("</tr>");
		}

		body.append("</tbody></table>")
				.append("</div>");

		// Total Payment Summary
		body.append("<div style='margin-top: 30px; text-align: right;'>")
				.append("<table style='float: right; font-size: 15px;'>")
				.append("<tr><td style='padding: 4px 8px;'><strong>Tổng tiền:</strong></td>")
				.append("<td style='padding: 4px 8px; text-align: right;'>")
				.append(String.format("%,d VND", order.getTotalAmount().longValue()))
				.append("</td></tr>")
				.append("<tr><td style='padding: 4px 8px;'><strong>Phí vận chuyển:</strong></td>")
				.append("<td style='padding: 4px 8px; text-align: right;'>")
				.append(String.format("%,d VND", order.getShippingFee().longValue()))
				.append("</td></tr>")
				.append("<tr><td style='padding: 4px 8px; font-size: 16px;'><strong>Thành tiền:</strong></td>")
				.append("<td style='padding: 4px 8px; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;'>")
				.append(String.format("%,d VND", order.getTotalAmount().add(order.getShippingFee()).longValue()))
				.append("</td></tr>")
				.append("</table>")
				.append("</div>");

		// Footer
		body.append("<div style='clear: both; padding-top: 50px;'>")
				.append("<p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi. Xin cảm ơn!</p>")
				.append("</div>")
				.append("</div>");

		emailService.sendOrderConfirmation(toEmail, subject, body.toString());
	}

}

