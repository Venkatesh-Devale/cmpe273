package lab3.repository;

import lab3.entity.Bids;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BidRepository extends CrudRepository<Bids, Integer> {
    List<Bids> findByFreelancerAndProjectid(String freelancer, String projectid);
}
