package lab3.controller;


import com.fasterxml.jackson.databind.util.JSONPObject;
import lab3.entity.Bids;
import lab3.entity.Projects;
import lab3.entity.ProjectsBidsDTO;
import lab3.entity.Users;
import lab3.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.print.attribute.standard.Media;
import java.util.List;

@Controller
@RequestMapping(path="/project")
public class ProjectController{
    @Autowired
    private ProjectService projectService;

    @GetMapping(value = "/getallopenprojects", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Projects> getAllOpenProjects() {
        return new ResponseEntity(projectService.findAll(), HttpStatus.OK);
    }

    @PostMapping(value = "/postproject", consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody String postProject(@RequestBody Projects project) {
        return projectService.save(project);
    }

    @PostMapping(value = "/getproject", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Projects> getproject(@RequestBody Projects project) {
        String projectid = project.getId();
        System.out.println("In Project Controller for getproject: " + projectid);
        return new ResponseEntity(projectService.getProjectById(projectid), HttpStatus.OK);
    }

    @PostMapping(value = "/getmypublishedprojects", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Projects> getmypublishedprojects(@RequestBody Users user) {
        String employer = user.getUsername();
        System.out.println("In Project Controller for getmypublishedprojects: " + employer);
        return new ResponseEntity(projectService.getMyPublishedProjects(employer), HttpStatus.OK);
    }

    @PostMapping(value = "/getmybiddedprojects", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectsBidsDTO> getmybiddedprojects(@RequestBody Users user) {
        String freelancer = user.getUsername();
        System.out.println("In Project Controller for getmybiddedprojects: " + freelancer);

        return new ResponseEntity(projectService.getMyBiddedProjects(freelancer), HttpStatus.OK);
    }

}
