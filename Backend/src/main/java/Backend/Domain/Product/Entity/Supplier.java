package Backend.Domain.Product.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "SUPPLIERS")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPPLIER_ID")
    private Integer supplierId;

    @Column(name = "SUPPLIER_NAME", nullable = false, length = 100)
    private String supplierName;

    @Column(name = "CONTACT_NAME", length = 100)
    private String contactName;

    @Column(name = "PHONE", length = 15)
    private String phone;

    @Column(name = "EMAIL", length = 100)
    private String email;

    @Column(name = "ADDRESS", length = 255)
    private String address;

}
