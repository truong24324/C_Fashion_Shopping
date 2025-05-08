package Backend.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import Backend.Model.Account;
import Backend.Model.Information;
import Backend.Repository.AccountRepository;
import Backend.Repository.InformationRepository;
import Backend.Request.InformationRequest;
import jakarta.annotation.PostConstruct;

@Service
public class InformationService {
    private final InformationRepository informationRepository;
    private final AccountRepository accountRepository;
    private final Path uploadPath = Paths.get("uploads/avatars");

    public InformationService(InformationRepository informationRepository, AccountRepository accountRepository) {
        this.informationRepository = informationRepository;
        this.accountRepository = accountRepository; // ✅ Đã truyền đúng
    }

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(uploadPath); // Tạo thư mục nếu chưa có
    }

    // ✅ Lấy danh sách thông tin người dùng (có phân trang)
    public Page<Information> getAllInformation(Pageable pageable) {
        return informationRepository.findAll(pageable);
    }

 // ✅ Lấy thông tin cá nhân theo ID tài khoản
    public Information getInformationByAccountId(Long accountId) {
        return informationRepository.findByAccount_AccountId(accountId).orElse(null);
    }

    // ✅ Thêm thông tin cá nhân
    public Information createInformation(InformationRequest request, String avatarPath) {
        Information information = new Information();

     // Tìm đối tượng Account theo ID
        Account account = accountRepository.findByAccountId(request.getAccountId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        information.setAccount(account); // Gán Account thay vì ID
        information.setFullName(request.getFullName());
        information.setBirthday(request.getBirthday());
        information.setGender(request.getGender());
        information.setHomeAddress(request.getHomeAddress());
        information.setOfficeAddress(request.getOfficeAddress());
        information.setNationality(request.getNationality());
        information.setAvatar(avatarPath);
        return informationRepository.save(information);
    }

    // ✅ Cập nhật thông tin cá nhân
    public Information updateInformation(Long accountId, InformationRequest request, String avatarPath) {
        Information information = getInformationByAccountId(accountId);
        information.setFullName(request.getFullName());
        information.setBirthday(request.getBirthday());
        information.setGender(request.getGender());
        information.setHomeAddress(request.getHomeAddress());
        information.setOfficeAddress(request.getOfficeAddress());
        information.setNationality(request.getNationality());

        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            String newAvatarUrl = storeFile(request.getAvatarFile());
            information.setAvatar(newAvatarUrl);
        } else if (request.getAvatar() != null) {
            information.setAvatar(request.getAvatar()); // Giữ nguyên ảnh cũ
        }

        return informationRepository.save(information);
    }

    // ✅ Xóa thông tin cá nhân
    public void deleteInformation(Long accountId) {
        Information information = getInformationByAccountId(accountId);
        informationRepository.delete(information);
    }

    // ✅ Lưu ảnh vào thư mục `uploads/information/` và trả về URL ảnh
    public String storeFile(MultipartFile file) {
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = "Avatar_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "uploads/avatars/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu ảnh thông tin cá nhân!", e);
        }
    }
}
