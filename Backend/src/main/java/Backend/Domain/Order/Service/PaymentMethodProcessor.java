package Backend.Domain.Order.Service;

import org.springframework.stereotype.Service;

@Service
public class PaymentMethodProcessor {

    public boolean processPayment(int paymentMethod, int totalPrice) {
        return switch (paymentMethod) {
            case 1 -> processCashOnDelivery(totalPrice);
            case 2 -> processCreditCardPayment(totalPrice);
            default -> throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
        };
    }

    private boolean processCashOnDelivery(int totalPrice) {
        System.out.println("COD - Tổng: " + totalPrice);
        return true;
    }

    private boolean processCreditCardPayment(int totalPrice) {
        System.out.println("Credit Card - Tổng: " + totalPrice);
        return true;
    }
}
