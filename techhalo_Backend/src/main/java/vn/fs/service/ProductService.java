package vn.fs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.fs.entity.Category;
import vn.fs.entity.Product;
import vn.fs.exception.ResourceNotFoundException;
import vn.fs.repository.CategoryRepository;
import vn.fs.repository.ProductRepository;
import vn.fs.repository.PromotionCodeRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    private PromotionCodeRepository promotionCodeRepository;

    public List<Product> getAvailableProductsByCategory(Long categoryId, Long promotionCodeId) {
        return productRepository.findAvailableProductsByCategoryAndStatusTrue(categoryId, promotionCodeId);
    }

    public List<Product> getAvailableProductsByCompany(Long supplierId, Long promotionCodeId) {
        return productRepository.findAvailableProductsBySupplierAndStatusTrue(supplierId, promotionCodeId);
    }

    @Transactional
    public List<Product> getProductsByCategoryId(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + categoryId));
        return productRepository.findByCategory(category);
    }

    //Gộp
    public void updateStatus(Long id, boolean status) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        product.setStatus(status);
        productRepository.save(product);
    }

    public Optional<Product> findById(Long productId) {
        return productRepository.findById(productId);
    }


}
