package lab3.controller;


import lab3.entity.Projects;
import lab3.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
        //System.out.println("AFter postproject in ProjectController" + projectService.save(project));
        return projectService.save(project);
    }
}
