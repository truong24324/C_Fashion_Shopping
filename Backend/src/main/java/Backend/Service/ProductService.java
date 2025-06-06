package Backend.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import Backend.Exception.ResourceNotFoundException;
import Backend.Model.*;
import Backend.Repository.*;
import Backend.Request.ProductRequest;
import Backend.Request.ProductUpdateRequest;
import Backend.Response.ProductCardResponse;
import Backend.Response.ProductDetailResponse;
import Backend.Response.ProductOverviewResponse;
import Backend.Response.ProductSuggestResponse;
import Backend.Response.TopSellingProductNameResponse;
import Backend.Response.TopSellingProductResponse;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;
	private final BrandRepository brandRepository;
	private final CategoryRepository categoryRepository;
	private final SupplierRepository supplierRepository;
	private final ProductStatusRepository productStatusRepository;
	private final ProductImageRepository productImageRepository;
	private final VariantRepository variantRepository;
	private final OrderDetailRepository orderDetailRepository;

	private final Path productUploadPath = Path.of("uploads/products");

	public List<ProductCardResponse> getLatestProducts() {
		List<Product> products = productRepository.findTop50ByOrderByCreatedAtDesc();
		List<ProductCardResponse> productDTOs = new ArrayList<>();

		for (Product product : products) {
			ProductCardResponse dto = new ProductCardResponse();
			dto.setProductId(product.getProductId());
			dto.setProductName(product.getProductName());
			dto.setModel(product.getModel());

			// Lấy hình ảnh loại MAIN & SECONDARY
			List<ProductImage> mainAndSecondaryImages = product.getImages().stream().filter(
					image -> image.getImageType() == ImageType.MAIN || image.getImageType() == ImageType.SECONDARY)
					.collect(Collectors.toList());

			List<String> imageUrls = new ArrayList<>();
			List<String> imageTypes = new ArrayList<>();
			for (ProductImage image : mainAndSecondaryImages) {
				imageUrls.add(image.getImageUrl());
				imageTypes.add(image.getImageType().name());
			}
			dto.setImage(imageUrls);
			dto.setImageTypes(imageTypes);

			// Giá thấp nhất
			List<Tuple> result = variantRepository.findMinPriceByProduct(product);
			if (!result.isEmpty()) {
				BigDecimal minPrice = (BigDecimal) result.get(0).get("minPrice");
				dto.setPrice(minPrice);
			}

			// === Thêm danh sách mã màu, size, chất liệu từ các variant ===
			List<String> colorCodes = new ArrayList<>();
			List<String> sizeNames = new ArrayList<>();
			List<String> materialNames = new ArrayList<>();
			List<ProductCardResponse.VariantSummaryResponse> variantResponses = new ArrayList<>();

			for (Variant variant : product.getVariants()) {
				ProductCardResponse.VariantSummaryResponse vr = dto.new VariantSummaryResponse();

				if (variant.getColor() != null) {
					vr.setColorCode(variant.getColor().getColorCode());
				}
				if (variant.getSize() != null) {
					vr.setSizeName(variant.getSize().getSizeName());
				}
				if (variant.getMaterial() != null) {
					vr.setMaterialName(variant.getMaterial().getMaterialName());
				}
				vr.setPrice(variant.getPrice());
				vr.setStock(variant.getStock());

				variantResponses.add(vr);

				// Lưu các mã màu, size, chất liệu
				if (variant.getColor() != null && !colorCodes.contains(variant.getColor().getColorCode())) {
					colorCodes.add(variant.getColor().getColorCode());
				}
				if (variant.getSize() != null && !sizeNames.contains(variant.getSize().getSizeName())) {
					sizeNames.add(variant.getSize().getSizeName());
				}
				if (variant.getMaterial() != null && !materialNames.contains(variant.getMaterial().getMaterialName())) {
					materialNames.add(variant.getMaterial().getMaterialName());
				}
			}

			dto.setColorCodes(colorCodes);
			dto.setSizeNames(sizeNames);
			dto.setMaterialNames(materialNames);
			dto.setVariants(variantResponses);

			productDTOs.add(dto);
		}

		return productDTOs;
	}

	public List<TopSellingProductResponse> getTop10BestSellingProducts() {
		// Bước 1: Lấy toàn bộ OrderDetail của đơn đã thanh toán
List<OrderDetail> paidOrderDetails = orderDetailRepository.findAllByOrder_PaymentStatusIn(
    List.of("Đã thanh toán", "Thanh toán thành công")
);

		// Bước 2: Gom nhóm theo product
		Map<Product, Integer> productSalesMap = new HashMap<>();

		for (OrderDetail od : paidOrderDetails) {
			Product product = od.getProduct();
			int quantity = od.getQuantity();

			productSalesMap.merge(product, quantity, Integer::sum);
		}

		// Bước 3: Sắp xếp giảm dần theo tổng số lượng bán
		List<Map.Entry<Product, Integer>> sortedTop = productSalesMap.entrySet().stream()
				.sorted(Map.Entry.<Product, Integer>comparingByValue().reversed())
				.limit(10)
				.collect(Collectors.toList());

		// Bước 4: Tạo danh sách kết quả
		List<TopSellingProductResponse> responses = new ArrayList<>();

		for (Map.Entry<Product, Integer> entry : sortedTop) {
			Product product = entry.getKey();
			Integer totalSold = entry.getValue();

			TopSellingProductResponse dto = new TopSellingProductResponse();
			dto.setProductId(product.getProductId());
			dto.setProductName(product.getProductName());
			dto.setModel(product.getModel());
			dto.setTotalSold(totalSold);

			// Hình ảnh MAIN và SECONDARY
			List<ProductImage> filteredImages = product.getImages().stream()
					.filter(img -> img.getImageType() == ImageType.MAIN || img.getImageType() == ImageType.SECONDARY)
					.collect(Collectors.toList());

			dto.setImage(filteredImages.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()));
			dto.setImageTypes(
					filteredImages.stream().map(img -> img.getImageType().name()).collect(Collectors.toList()));

			// Giá thấp nhất
			List<Tuple> result = variantRepository.findMinPriceByProduct(product);
			if (!result.isEmpty()) {
				BigDecimal minPrice = (BigDecimal) result.get(0).get("minPrice");
				dto.setPrice(minPrice);
			}

			// Variant summary
			List<String> colorCodes = new ArrayList<>();
			List<String> sizeNames = new ArrayList<>();
			List<String> materialNames = new ArrayList<>();
			List<TopSellingProductResponse.VariantSummaryResponse> variantResponses = new ArrayList<>();

			for (Variant variant : product.getVariants()) {
				TopSellingProductResponse.VariantSummaryResponse vr = dto.new VariantSummaryResponse();

				if (variant.getColor() != null) {
					String colorCode = variant.getColor().getColorCode();
					vr.setColorCode(colorCode);
					if (!colorCodes.contains(colorCode)) {
						colorCodes.add(colorCode);
					}
				}

				if (variant.getSize() != null) {
					String size = variant.getSize().getSizeName();
					vr.setSizeName(size);
					if (!sizeNames.contains(size)) {
						sizeNames.add(size);
					}
				}

				if (variant.getMaterial() != null) {
					String material = variant.getMaterial().getMaterialName();
					vr.setMaterialName(material);
					if (!materialNames.contains(material)) {
						materialNames.add(material);
					}
				}

				vr.setPrice(variant.getPrice());
				vr.setStock(variant.getStock());

				variantResponses.add(vr);
			}

			dto.setColorCodes(colorCodes);
			dto.setSizeNames(sizeNames);
			dto.setMaterialNames(materialNames);
			dto.setVariants(variantResponses);

			responses.add(dto);
		}

		return responses;
	}

	public List<ProductOverviewResponse> getAllProductOverviews() {
		List<Product> products = productRepository.findAll();

		return products.stream().map(product -> {
			ProductOverviewResponse dto = new ProductOverviewResponse();
			dto.setProductId(product.getProductId());
			dto.setProductName(product.getProductName());
			dto.setWarrantyPeriod(product.getWarrantyPeriod());
			dto.setSupplierName(product.getSupplier().getSupplierName());
			dto.setBrandName(product.getBrand().getBrandName());
			dto.setModel(product.getModel());

			// Lấy ảnh MAIN và SECONDARY
			List<ProductImage> filteredImages = product.getImages().stream()
					.filter(img -> img.getImageType() == ImageType.MAIN || img.getImageType() == ImageType.SECONDARY)
					.collect(Collectors.toList());

			dto.setImage(filteredImages.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()));

			dto.setImageTypes(
					filteredImages.stream().map(img -> img.getImageType().name()).collect(Collectors.toList()));

			// Tổng hợp thông tin variant
			dto.setColorNames(product.getVariants().stream().map(Variant::getColor).filter(Objects::nonNull)
					.map(color -> color.getColorCode() + "|" + color.getColorName()).collect(Collectors.toSet())
					.stream().toList());

			dto.setColorCodes(product.getVariants().stream().map(Variant::getColor).filter(Objects::nonNull)
					.map(Color::getColorCode).collect(Collectors.toSet()).stream().toList());

			dto.setSizeNames(product.getVariants().stream().map(Variant::getSize).filter(Objects::nonNull)
					.map(Size::getSizeName).collect(Collectors.toSet()).stream().toList());

			dto.setMaterialNames(product.getVariants().stream().map(Variant::getMaterial).filter(Objects::nonNull)
					.map(Material::getMaterialName).collect(Collectors.toSet()).stream().toList());

			dto.setPrice(product.getVariants().stream().map(Variant::getPrice).filter(Objects::nonNull).findFirst()
					.orElse(null)); // hoặc .min() nếu muốn lấy giá nhỏ nhất

			return dto;
		}).collect(Collectors.toList());
	}

	public List<ProductSuggestResponse> getProductsSuggest() {
		List<Product> products = productRepository.findRandomProducts();
		List<ProductSuggestResponse> productDTOs = new ArrayList<>();

		for (Product product : products) {
			ProductSuggestResponse dto = new ProductSuggestResponse();
			dto.setProductId(product.getProductId());
			dto.setProductName(product.getProductName());

			// Lấy hình ảnh loại MAIN
			product.getImages().stream().filter(image -> image.getImageType() == ImageType.MAIN).findFirst()
					.ifPresent(mainImage -> {
						dto.setImage(mainImage.getImageUrl());
						dto.setImageTypes(mainImage.getImageType().name());
					});

			// Giá thấp nhất
			List<Tuple> result = variantRepository.findMinPriceByProduct(product);
			if (!result.isEmpty()) {
				BigDecimal minPrice = (BigDecimal) result.get(0).get("minPrice");
				dto.setPrice(minPrice);
			}

			// Biến thể: màu, size, chất liệu, chi tiết
			Set<String> colorCodes = new HashSet<>();
			Set<String> sizeNames = new HashSet<>();
			Set<String> materialNames = new HashSet<>();
			List<ProductSuggestResponse.VariantDTO> variantDTOs = new ArrayList<>();

			for (Variant variant : product.getVariants()) {
				// Collect các giá trị duy nhất
				if (variant.getColor() != null) {
					colorCodes.add(variant.getColor().getColorCode());
				}
				if (variant.getSize() != null) {
					sizeNames.add(variant.getSize().getSizeName());
				}
				if (variant.getMaterial() != null) {
					materialNames.add(variant.getMaterial().getMaterialName());
				}

				// Build DTO cho biến thể
				ProductSuggestResponse.VariantDTO variantDTO = new ProductSuggestResponse.VariantDTO();
				variantDTO.setVariantId(variant.getVariantId());
				variantDTO.setColorName(variant.getColor() != null ? variant.getColor().getColorName() : null);
				variantDTO.setColorCode(variant.getColor() != null ? variant.getColor().getColorCode() : null);
				variantDTO.setMaterialName(
						variant.getMaterial() != null ? variant.getMaterial().getMaterialName() : null);
				variantDTO.setSizeName(variant.getSize() != null ? variant.getSize().getSizeName() : null);
				variantDTO.setStock(variant.getStock());
				variantDTO.setPrice(variant.getPrice());
				variantDTOs.add(variantDTO);
			}

			// Gán vào DTO chính
			dto.setColorCodes(new ArrayList<>(colorCodes));
			dto.setSizeNames(new ArrayList<>(sizeNames));
			dto.setMaterialNames(new ArrayList<>(materialNames));
			dto.setVariants(variantDTOs);

			productDTOs.add(dto);
		}

		return productDTOs;
	}

	@PostConstruct
	public void init() throws IOException {
		Files.createDirectories(productUploadPath); // Tạo thư mục nếu chưa có
	}

	// ✅ Lấy danh sách sản phẩm có phân trang
	public Page<Product> getAllProducts(Pageable pageable) {
		return productRepository.findAll(pageable);
	}

	// ✅ Tìm kiếm sản phẩm theo tên
	public Page<Product> searchProducts(String keyword, Pageable pageable) {
		return productRepository.findByProductNameContainingIgnoreCase(keyword, pageable);
	}

	private <T> T findEntityById(Integer id, JpaRepository<T, Integer> repository, String entityName) {
		return repository.findById(id).orElseThrow(() -> new RuntimeException(entityName + " không tồn tại"));
	}

	// ✅ Thêm sản phẩm mới
	@Transactional
	public Product createProduct(ProductRequest request) {

		if (request.getDescription() != null && request.getDescription().matches(".*<[^>]+>.*")) {
			throw new IllegalArgumentException("Mô tả không được chứa mã HTML");
		}

		// Kiểm tra trùng tên sản phẩm
		if (productRepository.existsByProductNameIgnoreCase(request.getProductName())) {
			throw new IllegalArgumentException("Tên sản phẩm đã tồn tại");
		}

		Product product = new Product();
		product.setProductName(request.getProductName());
		product.setDescription(request.getDescription());
		product.setBarcode(request.getBarcode());
		product.setModel(request.getModel());
		product.setWarrantyPeriod(request.getWarrantyPeriod());
		product.setCreatedAt(LocalDateTime.now());
		product.setUpdatedAt(LocalDateTime.now());

		// Tìm và gán các đối tượng khóa ngoại từ ID
		product.setBrand(findEntityById(request.getBrand(), brandRepository, "Brand"));
		product.setCategory(findEntityById(request.getCategory(), categoryRepository, "Category"));
		product.setSupplier(findEntityById(request.getSupplier(), supplierRepository, "Supplier"));
		product.setStatus(findEntityById(request.getStatus(), productStatusRepository, "ProductStatus"));

		return productRepository.save(product);
	}

	@Transactional
	public void uploadProductImage(Integer productId, MultipartFile imageFile, String imageType) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm"));

		try {
			// Giả sử bạn lưu ảnh ở thư mục local hoặc cloud storage
			String imageUrl = saveImage(imageFile);

			ProductImage productImage = new ProductImage();
			productImage.setProduct(product);
			productImage.setImageUrl(imageUrl);
			productImage.setImageType(ImageType.valueOf(imageType.toUpperCase()));

			productImageRepository.save(productImage);
		} catch (Exception e) {
			throw new RuntimeException("Lỗi khi lưu ảnh", e);
		}
	}

	// ✅ Cập nhật sản phẩm
	@Transactional
	public Product updateProduct(Integer productId, ProductUpdateRequest request) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

		if (request.getDescription() != null && request.getDescription().matches(".*<[^>]+>.*")) {
			throw new IllegalArgumentException("Mô tả không được chứa mã HTML");
		}

		// Chỉ cập nhật nếu có giá trị mới hoặc giá trị không trống
		if (request.getProductName() != null && !request.getProductName().equals(product.getProductName())) {
			product.setProductName(request.getProductName());
		}
		if (request.getDescription() != null && !request.getDescription().equals(product.getDescription())) {
			product.setDescription(request.getDescription());
		}
		if (request.getBarcode() != null && !request.getBarcode().equals(product.getBarcode())) {
			product.setBarcode(request.getBarcode());
		}
		if (request.getModel() != null && !request.getModel().equals(product.getModel())) {
			product.setModel(request.getModel());
		}
		if (request.getWarrantyPeriod() != null && !request.getWarrantyPeriod().equals(product.getWarrantyPeriod())) {
			product.setWarrantyPeriod(request.getWarrantyPeriod());
		}

		product.setUpdatedAt(LocalDateTime.now());

		return productRepository.save(product);
	}

	public ProductDetailResponse getProductDetail(Integer productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		ProductDetailResponse response = new ProductDetailResponse();
		response.setBrandName(product.getBrand().getBrandName());
		response.setCategoryName(product.getCategory().getCategoryName());
		response.setProductName(product.getProductName());
		response.setDescription(product.getDescription());
		response.setBarcode(product.getBarcode());
		response.setModel(product.getModel());
		response.setWarrantyPeriod(product.getWarrantyPeriod());
		response.setSupplierName(product.getSupplier().getSupplierName());

		// Image
		List<ProductDetailResponse.ImageDTO> imageDTOs = product.getImages().stream().map(img -> {
			ProductDetailResponse.ImageDTO dto = new ProductDetailResponse.ImageDTO();
			dto.setImageUrl(img.getImageUrl());
			dto.setImageType(img.getImageType().toString());
			return dto;
		}).collect(Collectors.toList());
		response.setImages(imageDTOs);

		// Variant
		List<ProductDetailResponse.VariantDTO> variantDTOs = new ArrayList<>();
		Set<String> colorNames = new HashSet<>();
		Set<String> sizeNames = new HashSet<>();
		Set<String> materialNames = new HashSet<>();

		for (Variant variant : product.getVariants()) {
			ProductDetailResponse.VariantDTO dto = new ProductDetailResponse.VariantDTO();
			dto.setVariantId(variant.getVariantId());
			dto.setColorName(variant.getColor().getColorName());
			dto.setColorCode(variant.getColor().getColorCode());
			dto.setMaterialName(variant.getMaterial().getMaterialName());
			dto.setSizeName(variant.getSize().getSizeName());
			dto.setStock(variant.getStock());
			dto.setPrice(variant.getPrice());
			variantDTOs.add(dto);

			colorNames.add(variant.getColor().getColorName());
			sizeNames.add(variant.getSize().getSizeName());
			materialNames.add(variant.getMaterial().getMaterialName());
		}

		response.setVariants(variantDTOs);
		response.setColorNames(new ArrayList<>(colorNames));
		response.setSizeNames(new ArrayList<>(sizeNames));
		response.setMaterialNames(new ArrayList<>(materialNames));

		return response;
	}

	// ✅ Xóa sản phẩm
	@Transactional
	public void deleteProduct(Integer productId) {
		if (!productRepository.existsById(productId)) {
			throw new RuntimeException("Sản phẩm không tồn tại");
		}

		if (productRepository.existsById(productId)) {
			// Trả về thông báo lỗi nếu thương hiệu đang được sử dụng
			throw new IllegalStateException("Sản phẩm này đang được sử dụng, không thể xóa.");
		}

	}

	private String saveImage(MultipartFile file) {
		try {
			Path uploadDir = Path.of("uploads/products");
			if (!Files.exists(uploadDir)) {
				Files.createDirectories(uploadDir);
			}

			String fileName = "Product_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
			Path filePath = productUploadPath.resolve(fileName);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			String imagePath = "uploads/products/" + fileName; // Không có dấu `/` ở đầu
			return imagePath; // Đảm bảo khi lưu vào DB là đúng đường dẫn thư mục
		} catch (IOException e) {
			throw new RuntimeException("Lỗi khi lưu ảnh sản phẩm!", e);
		}
	}

	 public List<TopSellingProductNameResponse> getTopSellingProductNames() {
        return orderDetailRepository.findTopSellingProductsByName();
    }
}