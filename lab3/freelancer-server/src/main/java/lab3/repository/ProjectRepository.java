package lab3.repository;

import lab3.entity.Projects;
import lab3.entity.ProjectsBidsDTO;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface ProjectRepository extends CrudRepository<Projects, String> {

    @Query(value="select p.id, p.title, p.description, p.skills_required, p.budgetrange, p.number_of_bids, p.employer, p.worker, p.estimated_completion_date, t.averagebid, p.open" +
            " from projects as p left join (select projectid, avg(bidamount) as averagebid from bids where projectid = :projectid group by projectid) as t on p.id = t.projectid where p.id = :projectid", nativeQuery = true)
    List<Projects> getProjectById(@Param("projectid") String projectid);

    List<Projects> findProjectsById(String projectid);

    @Modifying
    @Transactional
    @Query(
            value="update projects set number_of_bids = :updatedBids where id = :projectid",
            nativeQuery = true
    )
    void updateBids(@Param("projectid") String projectid, @Param("updatedBids") int updatedBids);


    @Query(
            value="select p.id, p.title, p.description, p.skills_required, p.budgetrange, p.number_of_bids, p.employer, p.worker, p.estimated_completion_date, t.averagebid, p.open " +
                    "from projects as p left join (select projectid, avg(bidamount) as averagebid from bids group by projectid) " +
                    "as t on p.id = t.projectid where p.employer = :employer",
            nativeQuery = true
    )
    List<Projects> findMyPublishedProjects(@Param("employer") String employer);



}
