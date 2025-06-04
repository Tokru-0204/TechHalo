package vn.fs.api;

import org.springframework.http.HttpStatus;
import vn.fs.dto.PromotionRequest;
import vn.fs.entity.Product;
import vn.fs.entity.PromotionCode;
import vn.fs.entity.User;
import vn.fs.repository.PromotionCodeRepository;
import vn.fs.repository.UserRepository;
import vn.fs.service.PromotionCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fs.service.UserService;

import java.util.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/promotionCodes")
public class PromotionCodeApi {

    @Autowired
    private PromotionCodeService promotionCodeService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private PromotionCodeRepository promotionCodeRepository;

    @GetMapping
    public ResponseEntity<List<PromotionCode>> getAllActivePromotionCodes() {
        return ResponseEntity.ok(promotionCodeService.getAllActivePromotionCodes());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> deactivatePromotionCode(@PathVariable Long id) {
        promotionCodeService.deactivatePromotionCode(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionCode> getPromotionCodeById(@PathVariable Long id) {
        return ResponseEntity.ok(promotionCodeService.getPromotionCodeById(id));
    }

    @PostMapping
    public ResponseEntity<PromotionCode> createPromotionCode(@RequestBody PromotionCode promotionCode) {
        return ResponseEntity.ok(promotionCodeService.savePromotionCode(promotionCode));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionCode> updatePromotionCode(@PathVariable Long id, @RequestBody PromotionCode promotionCodeDetails) {
        PromotionCode promotionCode = promotionCodeService.getPromotionCodeById(id);
        if (promotionCode != null) {
            // Update properties
            promotionCode.setCode(promotionCodeDetails.getCode());
            promotionCode.setDescription(promotionCodeDetails.getDescription());
            promotionCode.setType(promotionCodeDetails.getType());
            promotionCode.setDiscount(promotionCodeDetails.getDiscount());
            promotionCode.setStartDate(promotionCodeDetails.getStartDate());
            promotionCode.setEndDate(promotionCodeDetails.getEndDate());
            promotionCode.setMinOrderValue(promotionCodeDetails.getMinOrderValue());
            promotionCode.setMaxUses(promotionCodeDetails.getMaxUses());
            return ResponseEntity.ok(promotionCodeService.savePromotionCode(promotionCode));
        }
        return ResponseEntity.notFound().build();
    }


    @PostMapping("/{promotionCodeId}/apply-all-products")
    public ResponseEntity<Void> applyPromotionCodeToAllProducts(@PathVariable Long promotionCodeId, @RequestBody List<Long> productIds) {
        promotionCodeService.applyPromotionCodeToProducts(promotionCodeId, productIds);
        PromotionCode promotionCode = promotionCodeRepository.findById(promotionCodeId)
                .orElseThrow(() -> new RuntimeException("PromotionCode not found with ID: " + promotionCodeId));
        promotionCode.setFormOfApplication("All");
        promotionCodeRepository.save(promotionCode);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/{promotionCodeId}/apply-products-by-category")
    public ResponseEntity<Void> applyProductsByCategory(@PathVariable Long promotionCodeId, @RequestBody List<Long> productIds) {
        promotionCodeService.applyProductsByCategory(promotionCodeId, productIds);
        PromotionCode promotionCode = promotionCodeRepository.findById(promotionCodeId)
                .orElseThrow(() -> new RuntimeException("PromotionCode not found with ID: " + promotionCodeId));
        promotionCode.setFormOfApplication("Specific");
        promotionCodeRepository.save(promotionCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{promotionCodeId}/apply-products-by-company")
    public ResponseEntity<Void> applyProductsByCompany(@PathVariable Long promotionCodeId, @RequestBody List<Long> productIds) {
        promotionCodeService.applyProductsByCompany(promotionCodeId, productIds);
        PromotionCode promotionCode = promotionCodeRepository.findById(promotionCodeId)
                .orElseThrow(() -> new RuntimeException("PromotionCode not found with ID: " + promotionCodeId));
        promotionCode.setFormOfApplication("Specific");
        promotionCodeRepository.save(promotionCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{promotionCodeId}/apply-specific-products")
    public ResponseEntity<Void> applySpecificProductsToPromotion(@PathVariable Long promotionCodeId, @RequestBody List<Long> productIds) {
        promotionCodeService.applySpecificProductsToPromotion(promotionCodeId, productIds);
        PromotionCode promotionCode = promotionCodeRepository.findById(promotionCodeId)
                .orElseThrow(() -> new RuntimeException("PromotionCode not found with ID: " + promotionCodeId));
        promotionCode.setFormOfApplication("Specific");
        promotionCodeRepository.save(promotionCode);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{promotionCodeId}/products")
    public List<Product> getProductsByPromotionCode(@PathVariable Long promotionCodeId) {
        return promotionCodeService.getProductsByPromotionCode(promotionCodeId);
    }

    @DeleteMapping("/{promotionCodeId}/remove-product/{productId}")
    public ResponseEntity<Void> removeProductFromPromotion(@PathVariable Long promotionCodeId, @PathVariable Long productId) {
        promotionCodeService.removeProductFromPromotion(promotionCodeId, productId);
        return ResponseEntity.noContent().build();
    }

    //User
    @PostMapping("/{promotionCodeId}/apply-all-users")
    public ResponseEntity<Void> applyPromotionToAllUsers(@PathVariable Long promotionCodeId) {
        promotionCodeService.applyPromotionToAllUsers(promotionCodeId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{promotionCodeId}/apply-users")
    public ResponseEntity<Void> applyPromotionToUsers(
            @PathVariable Long promotionCodeId, @RequestBody List<Long> userIds) {
        promotionCodeService.applyPromotionToUsers(promotionCodeId, userIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{promotionCodeId}/users")
    public ResponseEntity<List<User>> getUsersByPromotionCode(@PathVariable Long promotionCodeId) {
        List<User> users = promotionCodeService.findUsersByPromotionCodeId(promotionCodeId);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{promotionCodeId}/remove-user/{userId}")
    public ResponseEntity<Void> removeUserFromPromotion(@PathVariable Long promotionCodeId, @PathVariable Long userId) {
        promotionCodeService.removeUserFromPromotion(promotionCodeId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/save-promotion-to-user/{promotionCodeId}")
    public ResponseEntity<Map<String, String>> applyPromotion(
            @RequestBody String email,
            @PathVariable Long promotionCodeId) {
        try {
            Long userId = userService.getUserIdByEmail(email);

            if (userId != null) {
                promotionCodeService.savePromotionToUser(promotionCodeId, userId);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Promotion applied successfully!");
                return ResponseEntity.ok(response); // Return as JSON
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User not found.");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to apply promotion.");
            return ResponseEntity.status(500).body(response);
        }
    }

    //    @GetMapping("/applied-users/{promotionCodeId}")
//    public ResponseEntity<List<Long>> getUsersAppliedForPromotion(@PathVariable Long promotionCodeId) {
//        List<Long> appliedUsers = promotionCodeService.getUsersAppliedForPromotion(promotionCodeId);
//        return ResponseEntity.ok(appliedUsers);
//    }
    @GetMapping("/applied-promotions")
    public ResponseEntity<List<Long>> getUsersAppliedForPromotion(@RequestParam String email) {
        List<Long> appliedPromotions = promotionCodeService.getUsersAppliedForPromotion(email);
        return ResponseEntity.ok(appliedPromotions); // Returns list of promotion IDs user has applied for
    }

    @GetMapping("/user-promotions")
    public List<PromotionCode> getUserPromotions(@RequestParam String email) {
        return promotionCodeService.getUserPromotions(email);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<PromotionCode> getPromotionByCode(@PathVariable String code) {
        Optional<PromotionCode> promotionCode = promotionCodeService.findByCode(code);
        return promotionCode.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Xoa
    @PostMapping("/remove-used-promotions")
    public ResponseEntity<Map<String, String>> removeUsedPromotions(@RequestBody PromotionRequest request) {
        try {
            // Tạo Map để đếm số lần sử dụng cho từng mã giảm giá
            Map<Long, Integer> promotionCodeCount = new HashMap<>();
            for (Long codeId : request.getPromotionCodeIds()) {
                promotionCodeCount.put(codeId, promotionCodeCount.getOrDefault(codeId, 0) + 1);
            }

            // Tăng số lần sử dụng cho từng mã
            for (Map.Entry<Long, Integer> entry : promotionCodeCount.entrySet()) {
                promotionCodeService.incrementPromotionUsesByAmount(entry.getKey(), entry.getValue());
            }

            // Xóa mã khuyến mãi khỏi người dùng
            promotionCodeService.removeUsedPromotions(request.getEmail(), request.getPromotionCodeIds());

            // Phản hồi thành công
            Map<String, String> response = new HashMap<>();
            response.put("message", "Mã giảm giá đã được xóa và cập nhật thành công!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Xử lý lỗi
            Map<String, String> response = new HashMap<>();
            response.put("message", "Có lỗi xảy ra khi xử lý mã giảm giá.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Long>> getPromotionsByProductId(@PathVariable Long productId) {
        try {
            // Gọi service để lấy danh sách mã khuyến mãi
            List<Long> promotionIds = promotionCodeService.getPromotionsAppliedByProductID(productId);

            // Trả về danh sách
            return ResponseEntity.ok(promotionIds);
        } catch (Exception e) {
            // Xử lý lỗi nếu có
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
