package vn.fs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fs.entity.Product;
import vn.fs.entity.PromotionCode;
import vn.fs.entity.User;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionCodeRepository extends JpaRepository<PromotionCode, Long> {
    List<PromotionCode> findByIsActiveTrue();


    Optional<PromotionCode> findByCode(String code);

    @Modifying
    @Query(value = "INSERT INTO product_promotion_codes (promotion_code_id, product_id) VALUES (:promotionCodeId, :productId)", nativeQuery = true)
    void addProductToPromotion(Long promotionCodeId, Long productId);

    @Query("SELECT u FROM User u JOIN u.promotionCodes pc WHERE pc.promotionCodeId = :promotionCodeId")
    List<User> findUsersByPromotionCodeId(@Param("promotionCodeId") Long promotionCodeId);


    @Query("SELECT p FROM Product p JOIN p.promotionCodes pc WHERE pc.promotionCodeId = :promotionCodeId")
    List<Product> findProductsByPromotionCodeId(@Param("promotionCodeId") Long promotionCodeId);

    @Modifying
    @Query(value = "DELETE FROM product_promotion_codes WHERE promotion_code_id = :promotionCodeId AND product_id = :productId", nativeQuery = true)
    void removeProductFromPromotion(@Param("promotionCodeId") Long promotionCodeId, @Param("productId") Long productId);

    @Query(value = "SELECT * FROM users u WHERE u.user_id NOT IN (SELECT up.user_id FROM user_promotion_codes up WHERE up.promotion_code_id = :promotionCodeId)", nativeQuery = true)
    List<Long> getUsersNotAppliedForPromotion(@Param("promotionCodeId") Long promotionCodeId);

    @Modifying
    @Query(value = "INSERT IGNORE INTO user_promotion_codes (promotion_code_id, user_id) VALUES (:promotionCodeId, :userId)", nativeQuery = true)
    void addUserToPromotion(@Param("promotionCodeId") Long promotionCodeId, @Param("userId") Long userId);

    @Modifying
    @Query(value = "DELETE FROM user_promotion_codes WHERE promotion_code_id = :promotionCodeId AND user_id = :userId", nativeQuery = true)
    void removeUserFromPromotion(@Param("promotionCodeId") Long promotionCodeId, @Param("userId") Long userId);

    @Query(value = "SELECT up.promotion_code_id FROM user_promotion_codes up WHERE up.user_id = :userId", nativeQuery = true)
    List<Long> getPromotionsAppliedByUser(@Param("userId") Long userId);

    //Xóa
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_promotion_codes " +
            "WHERE user_id = (SELECT user_id FROM users WHERE email = :email) " +
            "AND promotion_code_id IN (:promotionCodeIds)", nativeQuery = true)
    void deleteByUserEmailAndPromotionCodeIds(@Param("email") String email, @Param("promotionCodeIds") List<Long> promotionCodeIds);

//    @Modifying
//    @Transactional
//    @Query(value = "UPDATE promotion_codes " +
//            "SET current_uses = current_uses + 1 " +
//            "WHERE promotion_code_id IN (:promotionCodeIds)", nativeQuery = true)
//    void incrementCurrentUses(@Param("promotionCodeIds") List<Long> promotionCodeIds);
    @Modifying
    @Query("UPDATE PromotionCode p SET p.currentUses = p.currentUses + :amount WHERE p.promotionCodeId = :promotionCodeId")
    void incrementUsesByAmount(@Param("promotionCodeId") Long promotionCodeId, @Param("amount") int amount);


    @Query(value = "SELECT pp.promotion_code_id FROM product_promotion_codes pp WHERE pp.product_id = :productId", nativeQuery = true)
    List<Long> getPromotionsAppliedByProductID(@Param("productId") Long productId);

}
