package Backend.Domain.Accounts.DTO.Response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InformationResponse {
    private String fullName;
    private Date birthday;
    private String gender;
    private String homeAddress;
    private String officeAddress;
    private String nationality;
    private String avatar;
}
