package Backend.Domain.Product.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "COLORS")
public class Color {
    public static final java.awt.Color BLACK = null;

    public static final java.awt.Color WHITE = null;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COLOR_ID")
    private Integer colorId;

    @Column(name = "COLOR_NAME", unique = true, nullable = false)
    private String colorName;

    @Column(name = "COLOR_CODE", unique = true, nullable = false)
    private String colorCode;
}
