package Backend.Domain.Order.Entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ORDER_HISTORY")
public class OrderHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HISTORY_ID")
    private Integer historyId;

    @ManyToOne
    @JoinColumn(name = "ORDER_ID", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "STATUS_ID", nullable = false)
    private OrderStatus orderStatus;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "NOTE", length = 500)
    private String note;
}
