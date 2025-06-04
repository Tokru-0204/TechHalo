package vn.fs.api;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.fs.entity.Category;
import vn.fs.entity.Product;
import vn.fs.entity.Supplier;
import vn.fs.repository.CategoryRepository;
import vn.fs.repository.ProductRepository;
import vn.fs.service.ProductService;

@CrossOrigin("*")
@RestController
@RequestMapping("api/products")
public class ProductApi {

    @Autowired
    ProductRepository repo;

    @Autowired
    CategoryRepository cRepo;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(repo.findByStatusTrue());
    }

    @GetMapping("bestseller")
    public ResponseEntity<List<Product>> getBestSeller() {
        return ResponseEntity.ok(repo.findByStatusTrueOrderBySoldDesc());
    }

    @GetMapping("bestseller-admin")
    public ResponseEntity<List<Product>> getBestSellerAdmin() {
        return ResponseEntity.ok(repo.findTop10ByOrderBySoldDesc());
    }

    @GetMapping("latest")
    public ResponseEntity<List<Product>> getLasted() {
        return ResponseEntity.ok(repo.findByStatusTrueOrderByEnteredDateDesc());
    }

    @GetMapping("rated")
    public ResponseEntity<List<Product>> getRated() {
        return ResponseEntity.ok(repo.findProductRated());
    }

    @GetMapping("suggest/{categoryId}/{productId}")
    public ResponseEntity<List<Product>> suggest(@PathVariable("categoryId") Long categoryId,
                                                 @PathVariable("productId") Long productId) {
        return ResponseEntity.ok(repo.findProductSuggest(categoryId, productId, categoryId, categoryId));
    }

    @GetMapping("category/{id}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable("id") Long id) {
        if (!cRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Category c = cRepo.findById(id).get();
        return ResponseEntity.ok(repo.findByCategory(c));
    }

    @GetMapping("{id}")
    public ResponseEntity<Product> getById(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repo.findById(id).get());
    }


    @PutMapping("{id}")
    public ResponseEntity<Product> put(@PathVariable("id") Long id, @RequestBody Product product) {
        if (!id.equals(product.getProductId())) {
            return ResponseEntity.badRequest().build();
        }
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repo.save(product));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Product p = repo.findById(id).get();
        p.setStatus(false);
        repo.save(p);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/category-product/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productRepository.findByCategoryCategoryIdAndStatusTrue(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category-product/{categoryId}/{promotionCodeId}")
    public ResponseEntity<List<Product>> getAvailableProductsByCategory(@PathVariable Long categoryId, @PathVariable Long promotionCodeId) {
        List<Product> products = productService.getAvailableProductsByCategory(categoryId, promotionCodeId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/supplier-product/{supplierId}/{promotionCodeId}")
    public ResponseEntity<List<Product>> getAvailableProductsByCompany(@PathVariable Long supplierId, @PathVariable Long promotionCodeId) {
        List<Product> products = productService.getAvailableProductsByCompany(supplierId, promotionCodeId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/supplier-product/{supplierId}")
    public ResponseEntity<List<Product>> getProductsByCompany(@PathVariable Long supplierId) {
        List<Product> products = productRepository.findBySupplierSupplierIdAndStatusTrue(supplierId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/available-products/{promotionCodeId}")
    public ResponseEntity<List<Product>> getAvailableProductsNotInPromotion(@PathVariable Long promotionCodeId) {
        List<Product> products = productRepository.findAvailableProductsNotInPromotion(promotionCodeId);
        return ResponseEntity.ok(products);
    }
    //Gộp

    @PostMapping
    public ResponseEntity<Product> post(@RequestBody Product product) {
        if (repo.existsById(product.getProductId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(repo.save(product));
    }

    // Add product
    @PostMapping("add2")
    public ResponseEntity<Product> post2(@RequestBody Product product) {
        if (repo.existsById(product.getProductId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(repo.save(product));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        boolean status = request.get("status");
        productService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("allproduct")
    public ResponseEntity<List<Product>> getAllProduct() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword, @RequestParam Long currentProductId) {
        String cleanedKeyword = keyword.replaceAll("[^a-zA-Z0-9 ]", "").toLowerCase();
        List<Product> products = productRepository.findByCleanedNameContaining(cleanedKeyword);

        // Loại bỏ sản phẩm hiện tại
        products = products.stream()
                .filter(p -> !p.getProductId().equals(currentProductId))
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }


}