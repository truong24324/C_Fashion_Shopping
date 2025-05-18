package Backend.Request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductReviewRequest {

	private Integer reviewId;

	
	private Integer orderDetailId;

	
	private Integer accountId;

	@NotNull(message = "rating không được để trống")
	@Min(value = 1, message = "rating tối thiểu là 1")
	@Max(value = 5, message = "rating tối đa là 5")
	private Integer rating;

	@NotBlank(message = "title không được để trống")
	@Size(max = 100, message = "title tối đa 100 ký tự")
	@Pattern(regexp = "^[\\p{L}0-9\\s.,!?\\-()']+$", message = "title chứa ký tự không hợp lệ")
	private String title;

	@NotBlank(message = "content không được để trống")
	@Size(max = 1000, message = "content tối đa 1000 ký tự")
	@Pattern(regexp = "^[\\p{L}0-9\\s.,!?\\-()']+$", message = "content chứa ký tự không hợp lệ")
	private String content;

	//private MultipartFile imageUrl;
}
