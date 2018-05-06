package lab3.repository;

import lab3.entity.Users;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserRepository extends CrudRepository<Users, Long> {
    List<Users> findByUsernameAndPassword(String username, String password);
}
