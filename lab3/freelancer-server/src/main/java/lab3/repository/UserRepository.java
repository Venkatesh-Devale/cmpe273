package lab3.repository;

import lab3.entity.Users;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

public interface UserRepository extends CrudRepository<Users, String> {
    List<Users> findByUsernameAndPassword(String username, String password);
    List<Users> findByUsername(String username);
}
