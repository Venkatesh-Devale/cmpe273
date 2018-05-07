package lab3.services;

import lab3.entity.Projects;
import lab3.entity.ProjectsBidsDTO;
import lab3.repository.ProjectRepository;
import lab3.repository.ProjectsBidsDTORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectsBidsDTORepository projectsBidsDTORepository;

    public Iterable<Projects> findAll() {
        return projectRepository.findAll();
    }

    public String save(Projects project) {
        String response = "";
        if(projectRepository.save(project).getId() != "") {
            response = "success";
        } else {
            response = "error";
            System.out.println("There are some error in post project save");
        }
        return response;
    }

    public List<Projects> getProjectById(String projectid) {
        System.out.println("In Project Service for getproject: " + projectid);
        return projectRepository.getProjectById(projectid);
    }

    public void updateNumberOfBids(String projectid) {
        List<Projects> tempProjects = projectRepository.findProjectsById(projectid);
        Projects project = tempProjects.get(0);
        System.out.println("Current bids:" + project.getNumber_of_bids());
        int currentBids = project.getNumber_of_bids();
        int updatedBids = currentBids + 1;
        projectRepository.updateBids(projectid, updatedBids);
    }

    public List<Projects> getMyPublishedProjects(String employer) {
        System.out.println("In Project Service for getMyPublishedProjects: " + employer);
        return projectRepository.findMyPublishedProjects(employer);
    }

    public List<ProjectsBidsDTO> getMyBiddedProjects(String freelancer) {
        System.out.println("In Project Service for getMyBiddedProjects: " + freelancer);
        //return projectRepository.findMyBiddedProjects(freelancer);
        return projectsBidsDTORepository.findMyBiddedProjects(freelancer);
    }



}
