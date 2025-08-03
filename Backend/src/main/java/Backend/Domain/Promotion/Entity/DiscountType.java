package Backend.Domain.Promotion.Entity;

public enum DiscountType {
	PERCENT, // Giảm theo %
    AMOUNT;     // Giảm theo số tiền

	 public static DiscountType fromString(String value) {
	        for (DiscountType type : DiscountType.values()) {
	            if (type.name().equalsIgnoreCase(value)) {
	                return type;
	            }
	        }
	        throw new IllegalArgumentException("Loại giảm giá không hợp lệ! (phải là FIXED hoặc PERCENT)");
	    }
}
