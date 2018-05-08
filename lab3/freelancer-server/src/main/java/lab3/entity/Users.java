package lab3.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class Users {

    @Id
    private String username;

    private String email;

    private String password;

    private String phone;

    private String aboutme;

    private String image_name;

    private String skills_required;

    public String getSkills_required() {
        return skills_required;
    }

    public void setSkills_required(String skills_required) {
        this.skills_required = skills_required;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAboutme() {
        return aboutme;
    }

    public void setAboutme(String aboutme) {
        this.aboutme = aboutme;
    }

    public String getImage_name() {
        return image_name;
    }

    public void setImage_name(String image_name) {
        this.image_name = image_name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}