package vn.fs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.fs.entity.User;
import vn.fs.repository.PromotionCodeRepository;
import vn.fs.repository.UserRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PromotionCodeRepository promotionCodeRepository;

    public List<User> getAvailableUsersNotInPromotion(Long promotionCodeId) {
        return userRepository.findAvailableUsersNotInPromotion(promotionCodeId);
    }

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email).map(user -> user.getUserId()).orElse(null);
    }

    @Transactional
    public void assignPromotionToUser(Long userId, Long promotionCodeId) {
        promotionCodeRepository.addUserToPromotion(promotionCodeId, userId);
    }

    public String getRoleByEmail(String email) {
        List<String> roles = userRepository.findRolesByEmail(email);
        if (!roles.isEmpty()) {
            return roles.get(0); // Trả về vai trò đầu tiên nếu có
        }
        return "No Role Found"; // Vai trò mặc định nếu không tìm thấy
    }

    @Transactional
    public void updateUserRole(Long userId, Long roleId) {
        // Xóa tất cả vai trò cũ của người dùng
        userRepository.deleteRolesByUserId(userId);

        // Thêm vai trò mới
        userRepository.insertUserRole(userId, roleId);
    }
}
