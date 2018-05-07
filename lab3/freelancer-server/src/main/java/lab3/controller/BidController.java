package lab3.controller;


import lab3.entity.Bids;
import lab3.entity.Projects;
import lab3.entity.ProjectsBidsDTO;
import lab3.services.BidService;
import lab3.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.xml.ws.Response;

@Controller
@RequestMapping(path="/bids")
public class BidController {
    @Autowired
    private BidService bidService;
    @Autowired
    private ProjectService projectService;

    @PostMapping(value = "/insertBidAndUpdateNumberOfBids", consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody String insertBidAndUpdateNumberOfBids(@RequestBody Bids bid) {
        String response = "";
        System.out.println("In Bid controller insertBidAndUpdateNumberOfBids: " + bid.getProjectid());
        int result = bidService.checkIfBidAlreadyPresent(bid.getFreelancer(), bid.getProjectid());
        if(result == 0) { //bid already present
            System.out.println("Bid Already Present");
            response = "error";
        }
        else {
            System.out.println("Bid not Present:"+ bid.getProjectid());
            bidService.saveNewBid(bid);
            //update the number_of_bis in projects table
            projectService.updateNumberOfBids(bid.getProjectid());
            response = "success";
        }
        return response;
    }

    @PostMapping(value = "/getAllBidsForThisProject", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectsBidsDTO> getAllBidsForThisProject(@RequestBody Projects project) {
        System.out.println("In bid controller getAllBidsForThisProject:" + project.getId());
        return new ResponseEntity(bidService.getAllBidsForThisProject(project.getId()), HttpStatus.OK);
    }
}
