package Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

}
