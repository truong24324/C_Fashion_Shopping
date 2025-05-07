package Backend.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String emailContent = String.format("""
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Xác nhận OTP</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; text-align: center; }
                        .container { max-width: 600px; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: auto; }
                        .header { font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px; }
                        .otp-box { font-size: 36px; font-weight: bold; padding: 15px 20px; border: 2px dashed #007bff; background: #f1f3f5; display: inline-block; margin: 20px 0; border-radius: 8px; }
                        .cta-btn { background: #007bff; color: white; padding: 14px 24px; border: none; font-size: 16px; font-weight: bold; text-transform: uppercase; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; }
                        .cta-btn:hover { background: #0056b3; }
                        .footer { margin-top: 30px; font-size: 14px; color: #666; }
                        .social-icons a { margin: 0 10px; text-decoration: none; color: #007bff; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="header">Xác thực đăng nhập</h2>
                        <p>Chào bạn,</p>
                        <p>Để hoàn tất quá trình đăng nhập, vui lòng nhập mã OTP dưới đây:</p>
                        <div class="otp-box">%s</div>
                        <p>Hoặc nhấn vào nút bên dưới để xác thực ngay:</p>
                        <a href="#" class="cta-btn">Xác nhận ngay</a>
                        <p>Mã OTP có hiệu lực trong vòng <strong>15 phút</strong>.</p>

                        <div class="footer">
                            <p>Liên hệ: <a href="mailto:hotro@thuonghieu.com">hotro@thuonghieu.com</a> | Điện thoại: +84 123 456 789</p>
                            <div class="social-icons">
                                <a href="https://facebook.com">Facebook</a> |
                                <a href="https://instagram.com">Instagram</a> |
                                <a href="https://x.com">Twitter</a> |
                                <a href="https://youtube.com">YouTube</a>
                            </div>
                            <p>© %s Thương Hiệu. Mọi quyền được bảo lưu.</p>
                        </div>
                    </div>
                </body>
                </html>
            """, otp, java.time.Year.now());

            helper.setTo(toEmail);
            helper.setSubject("Mã OTP xác nhận đăng nhập");
            helper.setText(emailContent, true);

            mailSender.send(message);
            logger.info("Đã gửi email OTP thành công đến {}", toEmail);
        } catch (MessagingException e) {
            logger.error("Lỗi khi gửi email OTP đến {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendAccountLockedEmail(String toEmail) {
        String subject = "Tài khoản của bạn đã bị khóa";
        String content = "<p>Xin chào,</p>"
                + "<p>Tài khoản của bạn đã bị khóa do nhập sai mật khẩu quá nhiều lần.</p>"
                + "<p>Vui lòng thử lại sau 30 phút hoặc liên hệ hỗ trợ để mở khóa.</p>";

        sendEmail(toEmail, subject, content);
    }

    private void sendEmail(String toEmail, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
