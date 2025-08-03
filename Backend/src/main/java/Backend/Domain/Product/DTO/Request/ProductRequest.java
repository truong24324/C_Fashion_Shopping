package Backend.Domain.Product.DTO.Request;

import java.util.List;

import Backend.Domain.Accounts.DTO.Request.ImageRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequest {

	@NotBlank(message = "Tên sản phẩm không được để trống")
	@Size(max = 255, message = "Tên sản phẩm không được dài hơn 255 ký tự")
	@Pattern(regexp = "^[^\\d].*", message = "Tên sản phẩm không được bắt đầu bằng số")
	private String productName;

	@NotBlank(message = "Mã vạch không được để trống")
	@Pattern(regexp = "^\\d{8,13}$", message = "Mã vạch phải chứa từ 8 đến 13 chữ số")
	private String barcode;

	private String description;

	@NotNull(message = "Thương hiệu không được để trống")
	@Positive(message = "Thương hiệu không hợp lệ")
	private Integer brand;

	@NotNull(message = "Danh mục không được để trống")
	@Positive(message = "Danh mục không hợp lệ")
	private Integer category;

	@NotNull(message = "Nhà cung cấp không được để trống")
	@Positive(message = "Nhà cung cấp không hợp lệ")
	private Integer supplier;

	@NotNull(message = "Trạng thái không được để trống")
	@Positive(message = "Trạng thái không hợp lệ")
	private Integer status;

	@Size(max = 100, message = "Model không được dài hơn 100 ký tự")
	private String model;

	@NotBlank(message = "Thời gian bảo hành không được để trống")
	@Size(max = 50, message = "Thời gian bảo hành không được dài hơn 50 ký tự")
	@Pattern(regexp = "^(\\d+ (Tháng|Năm|tháng|năm))|Không bảo hành$", message = "Thời gian bảo hành phải có định dạng: '12 tháng', '1 năm' hoặc 'Không bảo hành'")
	private String warrantyPeriod;

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
