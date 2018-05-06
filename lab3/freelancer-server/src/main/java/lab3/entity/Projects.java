package lab3.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;


@Entity
public class Projects {
    @Id
    private String id;
    private String title;
    private String description;
    private String skills_required;
    private String budgetrange;
    private Long number_of_bids;
    private String employer;
    private String worker;
    private Date estimated_completion_date;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSkills_required() {
        return skills_required;
    }

    public void setSkills_required(String skills_required) {
        this.skills_required = skills_required;
    }

    public String getBudgetrange() {
        return budgetrange;
    }

    public void setBudgetrange(String budgetrange) {
        this.budgetrange = budgetrange;
    }

    public Long getNumber_of_bids() {
        return number_of_bids;
    }

    public void setNumber_of_bids(Long number_of_bids) {
        this.number_of_bids = number_of_bids;
    }

    public String getEmployer() {
        return employer;
    }

    public void setEmployer(String employer) {
        this.employer = employer;
    }

    public String getWorker() {
        return worker;
    }

    public void setWorker(String worker) {
        this.worker = worker;
    }

    public Date getEstimated_completion_date() {
        return estimated_completion_date;
    }

    public void setEstimated_completion_date(Date estimated_completion_date) {
        this.estimated_completion_date = estimated_completion_date;
    }
}
