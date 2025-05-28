package Backend.Service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import Backend.Model.OrderStatus;
import Backend.Repository.OrderStatusRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderStatusRepository orderStatusRepository;
    public List<OrderStatus> getAllStatuses() {
        return orderStatusRepository.findAll(Sort.by("stepOrder").ascending());
    }


}
