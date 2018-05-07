package lab3.repository;

import lab3.entity.ProjectsBidsDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectsBidsDTORepository extends Repository<ProjectsBidsDTO, String> {
    @Query(
            value=  "select t2.id, t2.title, t2.description, t2.skills_required, t2.budgetrange, t2.number_of_bids, b.bidamount, b.period, " +
                    "t2.employer, t2.worker, t2.estimated_completion_date, t2.open, " +
                    "t2.average, b.freelancer from bids as b join (select * from projects as p join (select projectid, avg(bidamount) as average from bids group by projectid) as t " +
                    "on p.id = t.projectid) as t2 on b.projectid = t2.id where b.freelancer = :freelancer",
            nativeQuery = true
    )
    List<ProjectsBidsDTO> findMyBiddedProjects(@Param("freelancer") String freelancer);

    @Query(
            value="select * from bids as b join projects as p on b.projectid = p.id where b.projectid = :projectid",
            nativeQuery = true
    )
    List<ProjectsBidsDTO> getAllBidsForThisProject(@Param("projectid") String projectid);
}
