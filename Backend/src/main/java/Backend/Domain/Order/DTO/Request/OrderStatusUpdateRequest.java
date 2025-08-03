package Backend.Domain.Order.DTO.Request;

import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private Integer statusId;
    private String note;
}
