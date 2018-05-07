package lab3.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class ProjectsBidsDTO {
    @Id
    private String id;
    private String freelancer;
    private int period;
    private int bidamount;
    private String title;
    private String description;
    private String skills_required;
    private String budgetrange;
    private Integer number_of_bids;
    private String employer;
    private String worker;
    private Date estimated_completion_date;
    private Double averagebid;
    private String open;

    public String getProjectid() {
        return id;
    }

    public void setProjectid(String projectid) {
        this.id = projectid;
    }

    public String getFreelancer() {
        return freelancer;
    }

    public void setFreelancer(String freelancer) {
        this.freelancer = freelancer;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }

    public int getBidamount() {
        return bidamount;
    }

    public void setBidamount(int bidamount) {
        this.bidamount = bidamount;
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

    public Integer getNumber_of_bids() {
        return number_of_bids;
    }

    public void setNumber_of_bids(Integer number_of_bids) {
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

    public Double getAveragebid() {
        return averagebid;
    }

    public void setAveragebid(Double averagebid) {
        this.averagebid = averagebid;
    }

    public String getOpen() {
        return open;
    }

    public void setOpen(String open) {
        this.open = open;
    }
}
