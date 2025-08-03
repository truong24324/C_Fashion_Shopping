package Backend.Domain.Accounts.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Accounts.Entity.Information;

@Repository
public interface InformationRepository extends JpaRepository<Information, Integer> {
    Optional<Information> findByAccount_AccountId(Long accountId); // Adjusted to match correct field name

}
