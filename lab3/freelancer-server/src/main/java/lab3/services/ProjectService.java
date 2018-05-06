package lab3.services;

import lab3.entity.Projects;
import lab3.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

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

}
