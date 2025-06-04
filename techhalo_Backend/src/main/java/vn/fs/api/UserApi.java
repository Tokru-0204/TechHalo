package vn.fs.api;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import vn.fs.config.JwtUtils;
import vn.fs.dto.JwtResponse;
import vn.fs.dto.LoginRequest;
import vn.fs.dto.MessageResponse;
import vn.fs.dto.SignupRequest;
import vn.fs.entity.AppRole;
import vn.fs.entity.Cart;
import vn.fs.entity.User;
import vn.fs.repository.AppRoleRepository;
import vn.fs.repository.CartRepository;
import vn.fs.repository.UserRepository;
import vn.fs.service.SendMailService;
import vn.fs.service.UserService;
import vn.fs.service.implement.UserDetailsImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("api/auth")
public class UserApi {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    AppRoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    SendMailService sendMailService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userRepository.findByStatusTrue());
    }

    @GetMapping("{id}")
    public ResponseEntity<User> getOne(@PathVariable("id") Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userRepository.findById(id).get());
    }

    @GetMapping("email/{email}")
    public ResponseEntity<User> getOneByEmail(@PathVariable("email") String email) {
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.ok(userRepository.findByEmail(email).get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<User> post(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.notFound().build();
        }
        if (userRepository.existsById(user.getUserId())) {
            return ResponseEntity.badRequest().build();
        }

        Set<AppRole> roles = new HashSet<>();
        roles.add(new AppRole(1, null));

        user.setRoles(roles);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setToken(jwtUtils.doGenerateToken(user.getEmail()));
        User u = userRepository.save(user);
        Cart c = new Cart(0L, 0.0, u.getAddress(), u.getPhone(), 0.0, u);
        cartRepository.save(c);
        return ResponseEntity.ok(u);
    }

    @PutMapping("{id}")
    public ResponseEntity<User> put(@PathVariable("id") Long id, @RequestBody User user) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (!id.equals(user.getUserId())) {
            return ResponseEntity.badRequest().build();
        }

        User temp = userRepository.findById(id).get();

        if (!user.getPassword().equals(temp.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        Set<AppRole> roles = new HashSet<>();
        roles.add(new AppRole(1, null));

        user.setRoles(roles);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("admin/{id}")
    public ResponseEntity<User> putAdmin(@PathVariable("id") Long id, @RequestBody User user) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (!id.equals(user.getUserId())) {
            return ResponseEntity.badRequest().build();
        }
        Set<AppRole> roles = new HashSet<>();
        roles.add(new AppRole(2, null));

        user.setRoles(roles);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        User u = userRepository.findById(id).get();
        u.setStatus(false);
        userRepository.save(u);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Validated @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getName(),
                userDetails.getEmail(), userDetails.getPassword(), userDetails.getPhone(), userDetails.getAddress(),
                userDetails.getGender(), userDetails.getStatus(), userDetails.getImage(), userDetails.getRegisterDate(),
                roles));

    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Validated @RequestBody SignupRequest signupRequest) {

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is alreadv in use!"));
        }

        // create new user account
        User user = new User(signupRequest.getName(), signupRequest.getEmail(),
                passwordEncoder.encode(signupRequest.getPassword()), signupRequest.getPhone(),
                signupRequest.getAddress(), signupRequest.getGender(), signupRequest.getStatus(),
                signupRequest.getImage(), signupRequest.getRegisterDate(),
                jwtUtils.doGenerateToken(signupRequest.getEmail()));
        Set<AppRole> roles = new HashSet<>();
        roles.add(new AppRole(1, null));

        user.setRoles(roles);
        userRepository.save(user);
        Cart c = new Cart(0L, 0.0, user.getAddress(), user.getPhone(), 0.0, user);
        cartRepository.save(c);

        // Gửi mã giảm giá mặc định cho người dùng (ví dụ: promotion_code_id = 1)
        Long defaultPromotionCodeId = 1L; // Thay bằng mã giảm giá mặc định của bạn
        userService.assignPromotionToUser(user.getUserId(), defaultPromotionCodeId);
        return ResponseEntity.ok(new MessageResponse("Đăng kí thành công"));

    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("send-mail-forgot-password-token")
    public ResponseEntity<String> sendToken(@RequestBody String email) {

        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.notFound().build();
        }
        User user = userRepository.findByEmail(email).get();
        String token = user.getToken();
        sendMaiToken(email, token, "Reset mật khẩu");
        return ResponseEntity.ok().build();

    }

    public void sendMaiToken(String email, String token, String title) {
        String body = "\r\n" + "    <h2>Hãy nhấp vào link để thay đổi mật khẩu của bạn</h2>\r\n"
                + "    <a href=\"http://localhost:8080/forgot-password/" + token + "\">Đổi mật khẩu</a>";
        sendMailService.queue(email, title, body);
    }

    @GetMapping("/available-not-in-promotion/{promotionCodeId}")
    public ResponseEntity<List<User>> getAvailableUsersNotInPromotion(@PathVariable Long promotionCodeId) {
        List<User> users = userService.getAvailableUsersNotInPromotion(promotionCodeId);
        return ResponseEntity.ok(users);
    }


    @GetMapping("/getUserIdByEmail")
    public ResponseEntity<Long> getUserIdByEmail(@RequestParam String email) {
        Long userId = userService.getUserIdByEmail(email);

        if (userId != null) {
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.status(404).body(null); // If user not found
        }
    }

    //Role
    @GetMapping("/role-by-email")
    public ResponseEntity<Map<String, String>> getRoleByEmail(@RequestParam String email) {
        List<String> roles = userRepository.findRolesByEmail(email);
        Map<String, String> response = new HashMap<>();
        if (roles.isEmpty()) {
            response.put("role", "No Role Found");
        } else {
            response.put("role", roles.get(0)); // Trả về vai trò đầu tiên
        }
        return ResponseEntity.ok(response); // Trả về JSON thay vì chuỗi
    }

    @PutMapping("/{userId}/update-role-direct")
    public ResponseEntity<Map<String, String>> updateUserRoleDirect(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        String newRole = body.get("newRole");

        if (!newRole.equals("ROLE_EMPLOYEE") && !newRole.equals("ROLE_USER")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vai trò không hợp lệ!"));
        }

        // Gọi service để cập nhật vai trò
        userService.updateUserRole(userId, newRole.equals("ROLE_EMPLOYEE") ? 3L : 1L);

        return ResponseEntity.ok(Map.of("message", "Vai trò đã được cập nhật thành công!"));
    }


}
