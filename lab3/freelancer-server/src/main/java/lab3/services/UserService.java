package lab3.services;

import lab3.entity.Users;
import lab3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<Users> login(String username, String password) {
        System.out.println(username+ " " + password);
        List<Users> returnedObject = userRepository.findByUsername(username);

        if(returnedObject.size() != 0) {
            Users user = returnedObject.get(0);
            System.out.println("DB Password:" + user.getPassword());
            if (BCrypt.checkpw(password, user.getPassword())) {
                System.out.println("It matches");
                return returnedObject;
            }
            else
                System.out.println("It does not match");
                return null;
        }
        return null;
    }

    public void save(Users user) {
        String passToHash = user.getPassword();
        String hashedPassword = BCrypt.hashpw(passToHash, BCrypt.gensalt(10));
        System.out.println("Password after hashing and before setting password in user service for signup: " + hashedPassword);
        user.setPassword(hashedPassword);
        System.out.println("Password after hashing and after setting password in user service for signup: " + user.getPassword());
        userRepository.save(user);
    }

    public List<Users> getProfile(String username) {
        return userRepository.findByUsername(username);
    }

    public String updateUserProfile(String username, Users user) {
        String email = user.getEmail();
        String aboutme = user.getAboutme();
        String phone = user.getPhone();
        String skills = user.getSkills_required();
        int result = userRepository.updateUserProfile(email, phone, aboutme, skills, username);
        System.out.println("After updating profile in updateUserProfile service result is: " + result);
        if(result == 1)
            return "success";
        else
            return "error";
    }

}
