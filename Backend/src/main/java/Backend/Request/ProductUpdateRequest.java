package Backend.Request;

import java.util.List;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductUpdateRequest {

	@Size(max = 255, message = "Tên sản phẩm không được dài hơn 255 ký tự")
	@Pattern(regexp = "^[^\\d].*", message = "Tên sản phẩm không được bắt đầu bằng số")
	private String productName;

	@Pattern(regexp = "^\\d{8,13}$", message = "Mã vạch phải chứa từ 8 đến 13 chữ số")
	private String barcode;

	@Size(max = 500, message = "Mô tả không được dài hơn 500 ký tự")
	private String description;

	@Positive(message = "Thương hiệu không hợp lệ")
	private Integer brand;

	@Positive(message = "Danh mục không hợp lệ")
	private Integer category;

	@Positive(message = "Nhà cung cấp không hợp lệ")
	private Integer supplier;

	@Positive(message = "Trạng thái không hợp lệ")
	private Integer status;

	@Size(max = 100, message = "Model không được dài hơn 100 ký tự")
	private String model;

	@Size(max = 50, message = "Thời gian bảo hành không được dài hơn 50 ký tự")
	@Pattern(regexp = "^(\\d+ (Tháng|Năm))|Không bảo hành$", message = "Thời gian bảo hành phải có định dạng: '12 tháng', '1 năm' hoặc 'Không bảo hành'")
	private String warrantyPeriod;

	// Xử lý khoảng trắng tránh lỗi validation
	public void setProductName(String productName) {
		this.productName = productName != null ? productName.trim() : null;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode != null ? barcode.trim() : null;
	}

	public void setDescription(String description) {
		this.description = description != null ? description.trim() : null;
	}

	public void setModel(String model) {
		this.model = model != null ? model.trim() : null;
	}

	public void setWarrantyPeriod(String warrantyPeriod) {
		this.warrantyPeriod = warrantyPeriod != null ? warrantyPeriod.trim() : null;
	}

	private List<ImageRequest> images;

	public List<ImageRequest> getImages() {
		return images;
	}

}
