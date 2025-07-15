package Backend.Request;

import Backend.Model.PointActionType;
import lombok.Data;

@Data
public class UserPointRequest {
    private Integer accountId;
    private Integer points;
    private PointActionType actionType;
    private String description;
}
