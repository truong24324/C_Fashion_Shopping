package Backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import Backend.Model.Account;
import Backend.Model.Information;
import Backend.Repository.AccountRepository;
import Backend.Request.InformationRequest;
import Backend.Response.AccountInfoResponse;
import Backend.Response.ApiResponse;
import Backend.Response.InformationResponse;
import Backend.Service.InformationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/information")
public class InformationController {
    private final InformationService informationService;
    private final AccountRepository accountRepository;

    // ✅ Lấy thông tin cá nhân theo ID tài khoản
    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Customer', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<AccountInfoResponse>> getMyInformation(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        Information information = informationService.getInformationByAccountId(account.getAccountId());
        if (information == null) {
            InformationRequest defaultInfo = new InformationRequest();
            defaultInfo.setAccountId(account.getAccountId());
            defaultInfo.setFullName(account.getEmail());
            defaultInfo.setBirthday(null);
            defaultInfo.setGender("Không xác định");
            defaultInfo.setHomeAddress("Chưa cập nhật");
            defaultInfo.setOfficeAddress("Chưa cập nhật");
            defaultInfo.setNationality("Chưa cập nhật");

            information = informationService.createInformation(defaultInfo, null);
        }

        AccountInfoResponse response = new AccountInfoResponse();
        response.setUserCode(account.getUserCode());
        response.setEmail(account.getEmail());
        response.setPhone(account.getPhone());
        response.setRole(account.getRoleName());
        response.setDeviceName(account.getDeviceName());
        response.setLoginTime(account.getLoginTime());
        response.setLogoutTime(account.getLogoutTime());
        response.setIpAddress(account.getIpAddress());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        response.setPasswordChangedAt(account.getPasswordChangedAt());
        response.setActive(account.isActive());

        response.setFullName(information.getFullName());
        response.setBirthday(information.getBirthday());
        response.setGender(information.getGender());
        response.setHomeAddress(information.getHomeAddress());
        response.setOfficeAddress(information.getOfficeAddress());
        response.setNationality(information.getNationality());
        response.setAvatar(information.getAvatar());

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin thành công", response));
    }

    // ✅ Thêm mới thông tin cá nhân
    @PostMapping("/{accountId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Customer', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<InformationResponse>> createInformation(
            @ModelAttribute @Valid InformationRequest request) {

        // 🛑 Kiểm tra file ảnh (nếu có)
        String avatarPath = null;
        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            String validationMessage = validateImageFile(request.getAvatarFile());
            if (validationMessage != null) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, validationMessage, null));
            }

            // 🟢 Lưu file vào hệ thống (cần viết service xử lý)
            avatarPath = informationService.storeFile(request.getAvatarFile());
        }

        Information createInfo = informationService.createInformation(request, avatarPath);
        InformationResponse response = new InformationResponse(
                createInfo.getFullName(),
                createInfo.getBirthday(),
                createInfo.getGender(),
                createInfo.getHomeAddress(),
                createInfo.getOfficeAddress(),
                createInfo.getNationality(),
                createInfo.getAvatar());
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm thông tin thành công", response)); // ✅
    }

    // ✅ Cập nhật thông tin cá nhân
    @PutMapping("/me")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Customer', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<InformationResponse>> updateInformation(
            @ModelAttribute @Valid InformationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String avatarPath = request.getAvatar(); // Ban đầu gán lại ảnh cũ
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        Long accountId = account.getAccountId();

        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            String validationMessage = validateImageFile(request.getAvatarFile());
            if (validationMessage != null) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, validationMessage, null));
            }

            // Nếu có ảnh mới => ghi đè avatarPath
            avatarPath = informationService.storeFile(request.getAvatarFile());
        }

        Information updatedInfo = informationService.updateInformation(accountId, request, avatarPath);
        InformationResponse response = new InformationResponse(
                updatedInfo.getFullName(),
                updatedInfo.getBirthday(),
                updatedInfo.getGender(),
                updatedInfo.getHomeAddress(),
                updatedInfo.getOfficeAddress(),
                updatedInfo.getNationality(),
                updatedInfo.getAvatar());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thành công", response));

    }

    // ✅ Xóa thông tin cá nhân
    @DeleteMapping("/{accountId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteInformation(@PathVariable Long accountId) {
        informationService.deleteInformation(accountId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Xóa thông tin thành công", "Đã xóa thông tin của accountId = " + accountId));
    }

    private String validateImageFile(MultipartFile file) {
        List<String> allowedTypes = List.of("image/jpeg", "image/png", "image/webp");

        if (!allowedTypes.contains(file.getContentType())) {
            return "Ảnh phải có định dạng .jpg, .jpeg, .png hoặc .webp!";
        }

        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            return "Dung lượng ảnh không được vượt quá 5MB!";
        }

        return null;
    }

}
