package lab3.services;

import lab3.entity.Bids;
import lab3.entity.ProjectsBidsDTO;
import lab3.repository.BidRepository;
import lab3.repository.ProjectsBidsDTORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;
    @Autowired
    private ProjectsBidsDTORepository projectsBidsDTORepository;

    public int checkIfBidAlreadyPresent(String freelancer, String projectid) {
        System.out.println("Printing in checkIfBidAlreadyPresent in BidService method:"+ freelancer);
        List<Bids> tempBids = bidRepository.findByFreelancerAndProjectid(freelancer, projectid);
        if(tempBids.size() == 0) {
            return 1;
        }
        else
            return 0;
    }

    public void saveNewBid(Bids bid) {
        System.out.println("Printing in Save method:" + bid.getProjectid());
        bidRepository.save(bid);
    }

    public List<ProjectsBidsDTO> getAllBidsForThisProject(String projectid) {
        System.out.println("In bid service getAllBidsForThisProject:" + projectid);
        return projectsBidsDTORepository.getAllBidsForThisProject(projectid);
    }

}
