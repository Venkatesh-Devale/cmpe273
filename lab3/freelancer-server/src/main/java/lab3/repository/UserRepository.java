package lab3.repository;

import lab3.entity.Users;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

public interface UserRepository extends CrudRepository<Users, String> {
    List<Users> findByUsernameAndPassword(String username, String password);
    List<Users> findByUsername(String username);

    @Modifying
    @Transactional
    @Query(
            value="update users set email = :email, phone = :phone, aboutme = :aboutme, skills_required = :skills where username = :username",
            nativeQuery = true
    )
    int updateUserProfile(@Param("email") String email, @Param("phone") String phone, @Param("aboutme") String aboutme,
                             @Param("skills") String skills, @Param("username") String username);
}
