package lab3.repository;

import lab3.entity.Projects;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


public interface ProjectRepository extends CrudRepository<Projects, String> {
    @Query(
            value = "select * from projects as p " +
                    "left join ((select projectid, sum(bidamount)/count(projectid) as average " +
                    "from bids " +
                    "group by projectid) as t) " +
                    "on p.id = t.projectid " +
                    "where p.id = ?1",
            nativeQuery = true
    )
    List<Projects> getproject(String projectid);
}
