package Backend.Generator;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class VietQRGenerator {

    public static void main(String[] args) {
        // Thông tin đầu vào
        String bankCode = "vpbank";
        String bankAccount = "624032004";
        String amount = "100000"; // để trống nếu không yêu cầu người gửi nhập sẵn số tiền
        String message = ""; // nội dung chuyển khoản

        // Bản đồ mã BIN theo ngân hàng
        Map<String, String> bankIdByCode = new HashMap<>();
        bankIdByCode.put("vcb", "970436");
        bankIdByCode.put("vietinbank", "970415");
        bankIdByCode.put("vpbank", "970432");
        bankIdByCode.put("tcb", "970407");
        bankIdByCode.put("mb", "970422");
        bankIdByCode.put("acb", "970416");
        bankIdByCode.put("bidv", "970418");
        bankIdByCode.put("agribank", "970405");

        String bankId = bankIdByCode.get(bankCode.toLowerCase());
        if (bankId == null) {
            throw new IllegalArgumentException("Mã ngân hàng không hợp lệ!");
        }

        // EMV - Merchant Account Information (ID 38)
        StringBuilder part12Builder = new StringBuilder()
                .append("00")
                .append(String.format("%02d", bankId.length())).append(bankId)
                .append("01")
                .append(String.format("%02d", bankAccount.length())).append(bankAccount);

        StringBuilder part11Builder = new StringBuilder()
                .append("0010A000000727") // GUID NAPAS
                .append("01")
                .append(String.format("%02d", part12Builder.length())).append(part12Builder)
                .append("0208QRIBFTTA"); // QR Type

        StringBuilder part1Builder = new StringBuilder()
                .append("38")
                .append(String.format("%02d", part11Builder.length())).append(part11Builder);

        // Thêm message nếu có
        StringBuilder part21Builder = new StringBuilder();
        if (message != null && !message.isEmpty()) {
            part21Builder
                .append("08")
                .append(String.format("%02d", message.length()))
                .append(message);
        }

        // Payload Format: Tiền tệ, số tiền, quốc gia, message
        StringBuilder part2Builder = new StringBuilder()
                .append("5303704"); // VND
        if (amount != null && !amount.isEmpty()) {
            part2Builder
                .append("54")
                .append(String.format("%02d", amount.length()))
                .append(amount);
        }
        part2Builder.append("5802VN"); // Quốc gia
        if (part21Builder.length() > 0) {
            part2Builder
                .append("62")
                .append(String.format("%02d", part21Builder.length()))
                .append(part21Builder);
        }

        // Tổng hợp dữ liệu QR
        StringBuilder qrBuilder = new StringBuilder()
                .append("000201") // Payload Format Indicator
                .append("010212") // Point of initiation method
                .append(part1Builder)
                .append(part2Builder)
                .append("6304"); // CRC placeholder

        // Tính mã CRC
        String crc = generateCheckSum(qrBuilder.toString()).toUpperCase();
        String fullQRContent = qrBuilder.append(crc).toString();

        // Tạo ảnh QR
        try {
            generateImage(fullQRContent, "vietqr_" + bankCode + ".png");
            System.out.println("✅ Đã tạo ảnh QR: vietqr_" + bankCode + ".png");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Hàm tính CRC16 (chuẩn EMVCo)
    private static String generateCheckSum(String text) {
        int crc = 0xFFFF;
        int polynomial = 0x1021;
        byte[] bytes = text.getBytes();
        for (byte b : bytes) {
            for (int i = 0; i < 8; i++) {
                boolean bit = ((b >> (7 - i) & 1) == 1);
                boolean c15 = ((crc >> 15 & 1) == 1);
                crc <<= 1;
                if (c15 ^ bit) crc ^= polynomial;
            }
        }
        return String.format("%04X", crc & 0xFFFF);
    }

    // Hàm tạo ảnh QR PNG
    private static void generateImage(String text, String filePath) throws WriterException, IOException {
        int width = 400;
        int height = 400;

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
            }
        }

        ImageIO.write(image, "png", new File(filePath));
    }
}
