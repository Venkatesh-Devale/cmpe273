package lab3.services;

import lab3.entity.Users;
import lab3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<Users> login(String username, String password) {
        System.out.println(username+ " " + password);
        return userRepository.findByUsernameAndPassword(username, password);
    }

    public void save(Users user) {
        userRepository.save(user);
    }

    public List<Users> getProfile(String username) {
        return userRepository.findByUsername(username);
    }

    public String updateUserProfile(String username, Users user) {
        String response = "";
        if(userRepository.save(user).getUsername().equals(username)) {
            response = "success";
        } else {
            System.out.println("Error is updating userprofile");
            response = "error";
        }
        return response;
    }

}
