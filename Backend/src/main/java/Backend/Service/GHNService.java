package Backend.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import Backend.Request.CalculateFeeRequest;
import Backend.Request.EstimateTimeRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GHNService {

	@Value("${ghn.api.token}")
	private String apiToken;

	@Value("${ghn.api.url}")
	private String apiUrl;

	private final RestTemplate restTemplate;

	// Lấy danh sách tỉnh
	public Map<String, Object> getProvinces() {
		String url = apiUrl + "/shiip/public-api/master-data/province";

		HttpHeaders headers = new HttpHeaders();
		headers.set("Token", apiToken);

		HttpEntity<Void> entity = new HttpEntity<>(headers);

		ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
		return response.getBody();
	}

	// Lấy danh sách quận theo tỉnh
	public Map<String, Object> getDistricts(int provinceIdInt) {
		String url = apiUrl + "/shiip/public-api/master-data/district";

		HttpHeaders headers = new HttpHeaders();
		headers.set("Token", apiToken);
		headers.setContentType(MediaType.APPLICATION_JSON);

		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("province_id", provinceIdInt);

		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

		ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
		return response.getBody();
	}

	// Lấy danh sách phường theo quận và phường
	public Map<String, Object> getWards(int districtId) {
		String url = apiUrl + "/shiip/public-api/master-data/ward";

		HttpHeaders headers = new HttpHeaders();
		headers.set("Token", apiToken);
		headers.setContentType(MediaType.APPLICATION_JSON);

		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("district_id", districtId);

		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

		ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
		return response.getBody();
	}

	public Map<String, Object> calculateShippingFee(CalculateFeeRequest request) {
	    try {
	        // Sử dụng URL chính xác từ cấu hình
	        String url = this.apiUrl + "/shiip/public-api/v2/shipping-order/fee"; // Đảm bảo đường dẫn API đúng

	        // Tạo headers
	        HttpHeaders headers = new HttpHeaders();
	        headers.set("Token", apiToken); // Dùng token từ cấu hình
	        headers.setContentType(MediaType.APPLICATION_JSON); // Thiết lập Content-Type là application/json

	        // Tạo request body từ DTO
	        Map<String, Object> requestBody = new HashMap<>();
	        requestBody.put("from_district_id", request.getFromDistrict());
	        requestBody.put("to_district_id", request.getToDistrict());
	        requestBody.put("to_ward_code", String.valueOf(request.getToWard()));
	        requestBody.put("weight", request.getWeight());
	        requestBody.put("height", 15);
	        requestBody.put("length", 15);
	        requestBody.put("width", 15);
	        requestBody.put("service_type_id", 2);

	        // Tạo HttpEntity với headers và body
	        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

	        // Gửi yêu cầu POST đến API
	        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

	        if (response.getStatusCode() == HttpStatus.OK) {
	            Map<String, Object> body = response.getBody();
	            if (body != null && body.containsKey("data")) {
	                Map<String, Object> data = (Map<String, Object>) body.get("data");
	                if (data != null && data.containsKey("total")) {
	                    return Map.of("total", data.get("total"));
	                } else {
	                    return Map.of("error", "Không tìm thấy phí vận chuyển trong dữ liệu trả về.");
	                }
	            } else {
	                return Map.of("error", "Không có dữ liệu trả về từ API.");
	            }
	        } else {
	            throw new RuntimeException("Lỗi khi gọi API tính phí vận chuyển: " + response.getStatusCode());
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return Map.of("error", "Lỗi hệ thống khi tính phí vận chuyển: " + e.getMessage());
	    }
	}

	public Map<String, Object> estimateDeliveryTime(EstimateTimeRequest request) {
	    try {
	        String url = this.apiUrl + "/shiip/public-api/v2/shipping-order/leadtime";

	        HttpHeaders headers = new HttpHeaders();
	        headers.set("Token", apiToken);
	        headers.setContentType(MediaType.APPLICATION_JSON);

	        Map<String, Object> requestBody = new HashMap<>();
	        requestBody.put("from_district_id", request.getFromDistrict());
	        requestBody.put("to_district_id", request.getToDistrict());
	        requestBody.put("to_ward_code", String.valueOf(request.getToWard()));
	        requestBody.put("service_id", request.getServiceId());

	        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

	        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

	        if (response.getStatusCode() == HttpStatus.OK) {
	            Map<String, Object> body = response.getBody();
	            if (body != null && body.containsKey("data")) {
	                Map<String, Object> data = (Map<String, Object>) body.get("data");
	                if (data != null && data.containsKey("leadtime")) {
	                    long leadtime = Long.parseLong(data.get("leadtime").toString());
	                    String formattedDate = Instant.ofEpochSecond(leadtime)
	                            .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
	                            .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"));

	                    return Map.of(
	                        "leadtime", leadtime,
	                        "estimatedDelivery", formattedDate
	                    );
	                }
	            }
	            return Map.of("error", "Không có thời gian giao hàng trong dữ liệu trả về.");
	        } else {
	            return Map.of("error", "Lỗi gọi API GHN: " + response.getStatusCode());
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return Map.of("error", "Lỗi hệ thống khi gọi API GHN: " + e.getMessage());
	    }
	}

}