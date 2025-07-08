package Backend.Request;

import java.time.LocalDate;
import java.time.Period;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InformationRequest {

    private Long accountId;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ và ít nhất 18 tuổi")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthday;

    @Size(max = 20, message = "Giới tính không được vượt quá 20 ký tự")
    private String gender;

    @Size(max = 255, message = "Địa chỉ nhà không được vượt quá 255 ký tự")
    private String homeAddress;

    @Size(max = 255, message = "Địa chỉ cơ quan không được vượt quá 255 ký tự")
    private String officeAddress;

    @NotBlank(message = "Quốc tịch không được để trống")
    @Size(max = 50, message = "Quốc tịch không được vượt quá 50 ký tự")
    private String nationality = "Việt Nam";
//
//    @NotNull(message = "Ảnh đại diện không được để trống")
//    private MultipartFile avatarFile;

    private MultipartFile avatarFile;

    private String avatar; // Dùng để giữ ảnh cũ nếu không có file mới

    // Kiểm tra tuổi tối thiểu 18 tuổi
    public boolean isValidAge() {
        if (birthday == null) {
			return false;
		}
        LocalDate birthDate = new java.sql.Date(birthday.getTime()).toLocalDate();
        return Period.between(birthDate, LocalDate.now()).getYears() >= 18;
    }
}
