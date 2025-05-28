package Backend.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Backend.Request.CalculateFeeRequest;
import Backend.Request.EstimateTimeRequest;
import Backend.Response.ApiResponse;
import Backend.Service.GHNService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class GHNController {

	private final GHNService ghnService;

	// Lấy danh sách tỉnh
	@GetMapping("/provinces")
	public ResponseEntity<?> getProvinces() {
		return ResponseEntity.ok(ghnService.getProvinces());
	}

	// Lấy danh sách quận theo tỉnh đã chọn
	@GetMapping("/districts")
	public ResponseEntity<?> getDistricts(@RequestParam String provinceId) {
		try {
			// Chuyển provinceId sang kiểu int
			int provinceIdInt = Integer.parseInt(provinceId);

			// Gọi service để lấy danh sách quận
			return ResponseEntity.ok(ghnService.getDistricts(provinceIdInt));
		} catch (NumberFormatException e) {
			// Xử lý lỗi nếu provinceId không thể chuyển thành số nguyên
			return ResponseEntity.badRequest().body("Province ID không hợp lệ");
		}
	}

	@GetMapping("/wards")
	public ResponseEntity<?> getWards(@RequestParam String districtId) {
		try {
			// Chuyển districtId sang kiểu int
			int districtIdInt = Integer.parseInt(districtId);

			// Gọi service để lấy danh sách phường theo districtId
			return ResponseEntity.ok(ghnService.getWards(districtIdInt));
		} catch (NumberFormatException e) {
			// Xử lý lỗi nếu districtId không thể chuyển thành số nguyên
			return ResponseEntity.badRequest().body("District ID không hợp lệ");
		}
	}

	@PostMapping("/calculate-fee")
	public ResponseEntity<ApiResponse<?>> calculateShippingFee(@Valid @RequestBody CalculateFeeRequest request) {
	    try {
	        Map<String, Object> feeResponse = ghnService.calculateShippingFee(request);

	        if (feeResponse.containsKey("error")) {
	            ApiResponse<String> errorResponse = new ApiResponse<>(false, "Có lỗi xảy ra trong quá trình tính phí vận chuyển", (String) feeResponse.get("error"));
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	        }

	        ApiResponse<Map<String, Object>> successResponse = new ApiResponse<>(true, "Tính phí vận chuyển thành công", feeResponse);
	        return ResponseEntity.ok(successResponse);

	    } catch (Exception e) {
	        e.printStackTrace();
	        ApiResponse<String> errorResponse = new ApiResponse<>(false, "Có lỗi xảy ra trong quá trình tính phí vận chuyển", e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	    }
	}

	@PostMapping("/estimate-delivery-time")
	public ResponseEntity<ApiResponse<?>> estimateDeliveryTime(@Valid @RequestBody EstimateTimeRequest request) {
	    try {
	        Map<String, Object> response = ghnService.estimateDeliveryTime(request);

	        if (response.containsKey("error")) {
	            ApiResponse<String> errorResponse = new ApiResponse<>(false, "Lỗi khi ước tính thời gian giao hàng", (String) response.get("error"));
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	        }

	        ApiResponse<Map<String, Object>> successResponse = new ApiResponse<>(true, "Ước tính thời gian giao hàng thành công", response);
	        return ResponseEntity.ok(successResponse);
	    } catch (Exception e) {
	        e.printStackTrace();
	        ApiResponse<String> errorResponse = new ApiResponse<>(false, "Lỗi hệ thống khi ước tính thời gian giao hàng", e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	    }
	}

}
