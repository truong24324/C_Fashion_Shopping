package Backend.Domain.Accounts.Service;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class EntityService {

    public <T, ID> T findById(JpaRepository<T, ID> repository, ID id) {
        Optional<T> entity = repository.findById(id);
        return entity.orElse(null);
    }
}
