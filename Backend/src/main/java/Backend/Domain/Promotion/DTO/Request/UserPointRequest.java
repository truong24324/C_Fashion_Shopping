package Backend.Domain.Promotion.DTO.Request;

import Backend.Domain.Promotion.Entity.PointActionType;
import lombok.Data;

@Data
public class UserPointRequest {
    private Integer accountId;
    private Integer points;
    private PointActionType actionType;
    private String description;
}
