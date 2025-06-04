package vn.fs.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.fs.entity.User;

import javax.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByStatusTrue();

    Boolean existsByEmail(String email);

    Optional<User> findByEmail(String username);

    User findByToken(String token);

    @Query(value = "SELECT * FROM users u WHERE u.user_id NOT IN (SELECT up.user_id FROM user_promotion_codes up WHERE up.promotion_code_id = :promotionCodeId)", nativeQuery = true)
    List<User> findAvailableUsersNotInPromotion(@Param("promotionCodeId") Long promotionCodeId);

    @Query(value = "SELECT up.promotion_code_id FROM user_promotion_codes up WHERE up.user_id = :userId", nativeQuery = true)
    List<Long> getPromotionsAppliedByUser(@Param("userId") Long userId);

    @Query(value = "SELECT r.name FROM users u " +
            "JOIN user_roles ur ON u.user_id = ur.user_id " +
            "JOIN app_roles r ON ur.role_id = r.id " +
            "WHERE u.email = :email", nativeQuery = true)
    List<String> findRolesByEmail(@Param("email") String email);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_roles WHERE user_id = :userId", nativeQuery = true)
    void deleteRolesByUserId(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO user_roles (user_id, role_id) VALUES (:userId, :roleId)", nativeQuery = true)
    void insertUserRole(@Param("userId") Long userId, @Param("roleId") Long roleId);
}
