package Backend.Domain.Order.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ORDER_STATUSES")
public class OrderStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STATUS_ID")
    private Integer statusId;

    @Column(name = "STATUS_NAME", nullable = false, unique = true, length = 50)
    private String statusName;

    @Column(name = "STEP_ORDER", nullable = false)
    private Integer stepOrder;

    @Column(name = "IS_FINAL")
    private Boolean isFinal = false;

    @Column(name = "IS_CANCELLABLE")
    private Boolean isCancellable = true;
}
