package vn.fs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.fs.entity.Category;
import vn.fs.entity.Product;
import vn.fs.entity.Supplier;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {


    List<Product> findByCategoryCategoryIdAndStatusTrue(Long categoryId);

    @Query(value = "SELECT * FROM products p WHERE p.category_id = :categoryId AND p.status = true AND p.product_id NOT IN (SELECT pp.product_id FROM product_promotion_codes pp WHERE pp.promotion_code_id = :promotionCodeId)", nativeQuery = true)
    List<Product> findAvailableProductsByCategoryAndStatusTrue(@Param("categoryId") Long categoryId, @Param("promotionCodeId") Long promotionCodeId);

    @Query(value = "SELECT * FROM products p WHERE p.supplier_id = :supplierId AND p.status = true AND p.product_id NOT IN (SELECT pp.product_id FROM product_promotion_codes pp WHERE pp.promotion_code_id = :promotionCodeId)", nativeQuery = true)
    List<Product> findAvailableProductsBySupplierAndStatusTrue(
            @Param("supplierId") Long supplierId,
            @Param("promotionCodeId") Long promotionCodeId
    );

    // Tìm tất cả sản phẩm chưa được áp dụng mã giảm giá
    @Query(value = "SELECT * FROM products p WHERE p.status = true AND p.product_id NOT IN (SELECT pp.product_id FROM product_promotion_codes pp WHERE pp.promotion_code_id = :promotionCodeId)", nativeQuery = true)
    List<Product> findAvailableProductsNotInPromotion(@Param("promotionCodeId") Long promotionCodeId);

    // Lấy danh sách sản phẩm theo tên công ty và trạng thái
    List<Product> findBySupplierSupplierIdAndStatusTrue(Long supplierId);

    List<Product> findByStatusTrue();

    List<Product> findByStatusTrueOrderBySoldDesc();

    List<Product> findTop10ByOrderBySoldDesc();

    List<Product> findByStatusTrueOrderByQuantityDesc();

    List<Product> findByStatusTrueOrderByEnteredDateDesc();

    List<Product> findByCategory(Category category);

    List<Product> findBySupplier(Supplier supplier);

    Product findByProductIdAndStatusTrue(Long id);

    @Query(value = "Select p.* From products p \r\n"
            + "left join rates r on p.product_id = r.product_id\r\n"
            + "group by p.product_id , p.name\r\n"
            + "Order by  avg(r.rating) desc, RAND()", nativeQuery = true)
    List<Product> findProductRated();

    @Query(value = "(Select p.*, avg(r.rating) Rate From products p \r\n"
            + "left join rates r on p.product_id = r.product_id\r\n"
            + "Where (p.category_id = ?) and (p.product_id != ?)\r\n"
            + "group by p.product_id , p.name)\r\n"
            + "union\r\n"
            + "(Select p.*, avg(r.rating) Rate From products p \r\n"
            + "left join rates r on p.product_id = r.product_id\r\n"
            + "Where p.category_id != ?\r\n"
            + "group by p.product_id , p.name)\r\n"
            + "Order by category_id = ? desc, Rate desc", nativeQuery = true)
    List<Product> findProductSuggest(Long id, Long id2, Long id3, Long id4);

    @Query("SELECT p FROM Product p WHERE LOWER(REPLACE(REPLACE(p.name, '/', ''), '-', '')) LIKE %:keyword% AND p.status = true")
    List<Product> findByCleanedNameContaining(@Param("keyword") String keyword);
}
