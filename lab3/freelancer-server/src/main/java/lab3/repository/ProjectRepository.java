package lab3.repository;

import lab3.entity.Projects;
import org.springframework.data.repository.CrudRepository;

public interface ProjectRepository extends CrudRepository<Projects, Long> {

}
