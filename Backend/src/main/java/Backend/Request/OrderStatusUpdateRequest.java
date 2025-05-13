package Backend.Request;

import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private Integer statusId;
    private String note;
}
