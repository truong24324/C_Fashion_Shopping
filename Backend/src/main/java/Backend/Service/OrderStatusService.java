package Backend.Service;

import Backend.Model.*;
import lombok.RequiredArgsConstructor;
import Backend.Repository.*;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderStatusRepository orderStatusRepository;
    public List<OrderStatus> getAllStatuses() {
        return orderStatusRepository.findAll(Sort.by("stepOrder").ascending());
    }

   
}
