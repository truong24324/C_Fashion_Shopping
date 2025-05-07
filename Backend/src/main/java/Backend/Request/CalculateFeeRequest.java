package Backend.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CalculateFeeRequest {

    @NotNull(message = "Vui lòng chọn tỉnh gửi")
    private Integer fromProvince;

    @NotNull(message = "Vui lòng chọn quận/huyện gửi")
    private Integer fromDistrict;

    @NotNull(message = "Vui lòng chọn phường/xã gửi")
    private Integer fromWard;

    @NotNull(message = "Vui lòng chọn tỉnh nhận")
    private Integer toProvince;

    @NotNull(message = "Vui lòng chọn quận/huyện nhận")
    private Integer toDistrict;

    @NotNull(message = "Vui lòng chọn phường/xã nhận")
    private Integer toWard;

    @NotNull(message = "Vui lòng nhập khối lượng")
    @Min(value = 1, message = "Khối lượng phải lớn hơn 0 (đơn vị: gram)")
    private Integer weight;
}
