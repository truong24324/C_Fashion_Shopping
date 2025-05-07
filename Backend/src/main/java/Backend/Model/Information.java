package Backend.Model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "INFORMATION")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // ✅ Bỏ qua proxy khi serialize
public class Information {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INFORMATION_ID")
    private Integer informationId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ACCOUNT_ID", nullable = false, unique = true)
    private Account account; // Liên kết với bảng ACCOUNTS

    @Column(name = "FULLNAME", length = 100, nullable = false)
    private String fullName;

    @Column(name = "BIRTHDAY")
    @Temporal(TemporalType.DATE)
    private Date birthday;

    @Column(name = "GENDER", length = 20)
    private String gender;

    @Column(name = "HOME_ADDRESS", length = 255)
    private String homeAddress;

    @Column(name = "OFFICE_ADDRESS", length = 255)
    private String officeAddress;

    @Column(name = "NATIONALITY", length = 50, nullable = false)
    private String nationality = "Việt Nam"; // Mặc định là Việt Nam

    @Column(name = "AVATAR", length = 225)
    private String avatar;

    @Column(name = "UPDATED_AT", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt = new Date(); // Mặc định là ngày hiện tại


}