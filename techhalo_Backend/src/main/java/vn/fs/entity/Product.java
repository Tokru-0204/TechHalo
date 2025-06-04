package vn.fs.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("serial")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    private String name;
    private int quantity;
    private Double price;
    private int discount;
    private String image;
    private String image2;
    private String image3;
    private String image4;
    private String image5;
    private String description;
    private LocalDate enteredDate;
    private Boolean status;
    private int sold;
    @Column(name = "code_product", unique = true)
    private String codeProduct;

    @ManyToOne
    @JoinColumn(name = "supplierId")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "categoryId")
    private Category category;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "product_promotion_codes",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_code_id")
    )
    @JsonBackReference
    private Set<PromotionCode> promotionCodes = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        Product product = (Product) o;
        return productId != null && productId.equals(product.productId);
    }

    @Override
    public int hashCode() {
        return 31; // Hoặc bạn có thể sử dụng một công thức băm khác
    }

    @PostPersist
    private void generateCodeProduct() {
        if (productId != null && category != null && supplier != null && (codeProduct == null || codeProduct.isEmpty())) {
            StringBuilder initials = new StringBuilder();

            // Lấy chữ cái đầu từ name của Category
//			if (category.getCategoryName() != null) {
//				String[] categoryWords = category.getCategoryName().split("\\s+");
//				for (String word : categoryWords) {
//					if (!word.isEmpty()) {
//						initials.append(word.charAt(0));
//					}
//				}
//			}
            // Lấy mã nhà cung cấp (nếu có)
//			String supplierCode = supplier != null ? supplier.getName().substring(0, 3).toUpperCase() : "SUP";

            // Tạo mã sản phẩm với các chữ cái đầu và ID
            this.codeProduct = "MSPTH" + String.format("%05d", productId);
        }
    }


}
