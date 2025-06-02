package Backend.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class VietQRService {

    private static final Map<String, String> bankIdByCode = new HashMap<>();
    static {
        bankIdByCode.put("vcb", "970436");
        bankIdByCode.put("vietinbank", "970415");
        bankIdByCode.put("vpbank", "970432");
        bankIdByCode.put("tcb", "970407");
        bankIdByCode.put("mb", "970422");
        bankIdByCode.put("acb", "970416");
        bankIdByCode.put("bidv", "970418");
        bankIdByCode.put("agribank", "970405");
    }

    public String generateQR(String bankCode, String accountNumber, BigDecimal amount, String message,
            String orderCode) {
        String bankId = bankIdByCode.get(bankCode.toLowerCase());
        if (bankId == null) {
            throw new IllegalArgumentException("Mã ngân hàng không hợp lệ!");
        }

        String amountStr = amount != null ? amount.toPlainString() : "";

        StringBuilder part12Builder = new StringBuilder()
                .append("00").append(String.format("%02d", bankId.length())).append(bankId)
                .append("01").append(String.format("%02d", accountNumber.length())).append(accountNumber);

        StringBuilder part11Builder = new StringBuilder()
                .append("0010A000000727")
                .append("01").append(String.format("%02d", part12Builder.length())).append(part12Builder)
                .append("0208QRIBFTTA");

        StringBuilder part1Builder = new StringBuilder()
                .append("38").append(String.format("%02d", part11Builder.length())).append(part11Builder);

        StringBuilder part21Builder = new StringBuilder();
        if (message != null && !message.isEmpty()) {
            part21Builder.append("08")
                    .append(String.format("%02d", message.length()))
                    .append(message);
        }

        StringBuilder part2Builder = new StringBuilder()
                .append("5303704");
        if (!amountStr.isEmpty()) {
            part2Builder.append("54")
                    .append(String.format("%02d", amountStr.length()))
                    .append(amountStr);
        }
        part2Builder.append("5802VN");

        if (part21Builder.length() > 0) {
            part2Builder.append("62")
                    .append(String.format("%02d", part21Builder.length()))
                    .append(part21Builder);
        }

        StringBuilder qrBuilder = new StringBuilder()
                .append("000201")
                .append("010212")
                .append(part1Builder)
                .append(part2Builder)
                .append("6304");

        String crc = generateCRC16(qrBuilder.toString()).toUpperCase();
        return qrBuilder.append(crc).toString();
    }

    private String generateCRC16(String text) {
        int crc = 0xFFFF;
        int polynomial = 0x1021;
        byte[] bytes = text.getBytes();
        for (byte b : bytes) {
            for (int i = 0; i < 8; i++) {
                boolean bit = ((b >> (7 - i) & 1) == 1);
                boolean c15 = ((crc >> 15 & 1) == 1);
                crc <<= 1;
                if (c15 ^ bit)
                    crc ^= polynomial;
            }
        }
        return String.format("%04X", crc & 0xFFFF);
    }

    public void generateQRImage(String text, String path) throws IOException, WriterException {
        int width = 400, height = 400;
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = writer.encode(text, BarcodeFormat.QR_CODE, width, height);

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++)
            for (int y = 0; y < height; y++)
                image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);

        ImageIO.write(image, "png", new File(path));
    }
}
