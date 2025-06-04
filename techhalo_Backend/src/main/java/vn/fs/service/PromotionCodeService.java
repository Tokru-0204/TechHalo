package vn.fs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.fs.entity.Product;
import vn.fs.entity.PromotionCode;
import vn.fs.entity.User;
import vn.fs.exception.ResourceNotFoundException;
import vn.fs.repository.ProductRepository;
import vn.fs.repository.PromotionCodeRepository;
import vn.fs.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PromotionCodeService {
    @Autowired
    private PromotionCodeRepository promotionCodeRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    public Optional<PromotionCode> findByCode(String code) {
        return promotionCodeRepository.findByCode(code);
    }

    public PromotionCode getPromotionCodeById(Long id) {
        return promotionCodeRepository.findById(id).orElse(null);
    }

    public PromotionCode savePromotionCode(PromotionCode promotionCode) {
        return promotionCodeRepository.save(promotionCode);
    }

    public void deletePromotionCode(Long id) {
        promotionCodeRepository.deleteById(id);
    }

    // Lấy tất cả mã khuyến mãi đang hoạt động
    public List<PromotionCode> getAllActivePromotionCodes() {
        return promotionCodeRepository.findByIsActiveTrue();
    }

    // Cập nhật trạng thái isActive về false
    public void deactivatePromotionCode(Long id) {
        Optional<PromotionCode> promotionCode = promotionCodeRepository.findById(id);
        promotionCode.ifPresent(code -> {
            code.setIsActive(false);
            promotionCodeRepository.save(code);
        });
    }

    // Áp dụng mã khuyến mãi cho tất cả sản phẩm
    public void applyPromotionCodeToProducts(Long promotionCodeId, List<Long> productIds) {
        PromotionCode promotionCode = promotionCodeRepository.findById(promotionCodeId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion code not found"));

        List<Product> productAll = productRepository.findAllById(productIds);
        promotionCode.getProducts().clear();

        for (Product product : productAll) {
            promotionCode.getProducts().add(product);
            product.getPromotionCodes().add(promotionCode);
        }

        promotionCodeRepository.save(promotionCode);
    }

    // Áp dụng mã khuyến mãi cho sản phẩm theo danh mục
    public void applyProductsByCategory(Long promotionCodeId, List<Long> productIds) {

        PromotionCode promotionCode = promotionCodeRepository.findById(promotionCodeId)
                .orElseThrow(() -> new IllegalArgumentException("Promotion code not found"));

        List<Product> productsByCategory = productRepository.findAllById(productIds);
        promotionCode.getProducts().clear();

        for (Product product : productsByCategory) {
            promotionCode.getProducts().add(product);
            product.getPromotionCodes().add(promotionCode);
        }

        promotionCodeRepository.save(promotionCode);
    }

    // Áp dụng mã khuyến mãi cho sản phẩm theo công ty
    public void applyProductsByCompany(Long promotionCodeId, List<Long> productIds) {
        PromotionCode promotionCode = promotionCodeRepository.findById(promotionCodeId)
                .orElseThrow(() -> new IllegalArgumentException("Promotion code not found"));

        List<Product> productsByCompany = productRepository.findAllById(productIds);
        promotionCode.getProducts().clear();

        for (Product product : productsByCompany) {
            promotionCode.getProducts().add(product);
            product.getPromotionCodes().add(promotionCode);
        }

        promotionCodeRepository.save(promotionCode);
    }

    // Áp dụng mã khuyến mãi cho sản phẩm cụ thể
    public void applySpecificProductsToPromotion(Long promotionCodeId, List<Long> productIds) {
        PromotionCode promotionCode = promotionCodeRepository.findById(promotionCodeId)
                .orElseThrow(() -> new IllegalArgumentException("Promotion code not found"));

        List<Product> specificProducts = productRepository.findAllById(productIds);
        promotionCode.getProducts().clear();

        for (Product product : specificProducts) {
            promotionCode.getProducts().add(product);
            product.getPromotionCodes().add(promotionCode);
        }

        promotionCodeRepository.save(promotionCode);
    }

    public List<Product> getProductsByPromotionCode(Long promotionCodeId) {
        return promotionCodeRepository.findProductsByPromotionCodeId(promotionCodeId);
    }

    //User
    public void applyPromotionToAllUsers(Long promotionCodeId) {
        List<Long> userIdsNotApplied = promotionCodeRepository.getUsersNotAppliedForPromotion(promotionCodeId);

        for (Long userId : userIdsNotApplied) {
            promotionCodeRepository.addUserToPromotion(promotionCodeId, userId);
        }
    }

    public void applyPromotionToUsers(Long promotionCodeId, List<Long> userIds) {
        for (Long userId : userIds) {
            promotionCodeRepository.addUserToPromotion(promotionCodeId, userId);
        }
    }

    public List<User> findUsersByPromotionCodeId(Long promotionCodeId) {
        return promotionCodeRepository.findUsersByPromotionCodeId(promotionCodeId);
    }

    public void removeProductFromPromotion(Long promotionCodeId, Long productId) {
        promotionCodeRepository.removeProductFromPromotion(promotionCodeId, productId);
    }

    public void removeUserFromPromotion(Long promotionCodeId, Long userId) {
        promotionCodeRepository.removeUserFromPromotion(promotionCodeId, userId);
    }


    // Add promotion to user
    public boolean savePromotionToUser(Long promotionCodeId, Long userId) {
        if (promotionCodeRepository.existsById(promotionCodeId)) {
            promotionCodeRepository.addUserToPromotion(promotionCodeId, userId);
            return true;
        }
        return false;
    }

    // Get users who applied for a promotion
    public List<Long> getUsersAppliedForPromotion(Long promotionCodeId) {
        return userRepository.getPromotionsAppliedByUser(promotionCodeId);
    }

    // Get list of promotions the user has applied for based on email
    public List<Long> getUsersAppliedForPromotion(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {

            return userRepository.getPromotionsAppliedByUser(user.getUserId());
        }
        return Collections.emptyList();
    }

    public List<PromotionCode> getUserPromotions(String email) {
        // Get user by email
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Get promotion IDs from user_promotion_codes
        List<Long> promotionCodeIds = promotionCodeRepository.getPromotionsAppliedByUser(user.getUserId());

        // Find all promotions using the retrieved IDs
        return promotionCodeRepository.findAllById(promotionCodeIds);
    }

    //Xoa
    @Transactional
    public void removeUsedPromotions(String email, List<Long> promotionCodeIds) {
        promotionCodeRepository.deleteByUserEmailAndPromotionCodeIds(email, promotionCodeIds);
    }

    public void incrementPromotionUsesByAmount(Long promotionCodeId, int amount) {
        promotionCodeRepository.incrementUsesByAmount(promotionCodeId, amount);
    }

    public List<Long> getPromotionsAppliedByProductID(Long productId) {
        return promotionCodeRepository.getPromotionsAppliedByProductID(productId);
    }
}
