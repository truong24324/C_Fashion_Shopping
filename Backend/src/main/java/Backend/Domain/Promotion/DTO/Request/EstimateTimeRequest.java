package Backend.Domain.Promotion.DTO.Request;

import lombok.Data;

@Data
public class EstimateTimeRequest {
    private int fromDistrict;
    private int toDistrict;
    private String toWard;
    private int serviceId;
}
