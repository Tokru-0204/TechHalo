package vn.fs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "promotion_codes")
public class PromotionCode implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long promotionCodeId; // ID của mã khuyến mãi

    @Column(nullable = false, unique = true)
    private String code; // Mã khuyến mãi (ví dụ: "SUMMER2024")

    @Column(nullable = false)
    private String description; // Mô tả mã khuyến mãi

    @Column(nullable = false)
    private String type; // Loại mã khuyến mãi: "percentage" hoặc "fixed"

    private String formOfApplication;

    @Column(nullable = false)
    private Double discount; // Giá trị giảm giá

    @Column(nullable = false)
    private LocalDate startDate; // Ngày bắt đầu áp dụng mã

    @Column(nullable = false)
    private LocalDate endDate; // Ngày kết thúc áp dụng mã

    @Column(nullable = false)
    private Double minOrderValue; // Giá trị đơn hàng tối thiểu để áp dụng mã

    @Column(nullable = false)
    private Integer maxUses; // Số lần sử dụng tối đa của mã

    private Integer currentUses = 0; // Số lần đã sử dụng hiện tại

    @Column(nullable = false)
    private Boolean isActive = true;
    ; // Trạng thái kích hoạt của mã (true/false)


    @ManyToMany(mappedBy = "promotionCodes", fetch = FetchType.LAZY)
    @JsonManagedReference
    @JsonIgnore
    private Set<Product> products = new HashSet<>();

    @ManyToMany(mappedBy = "promotionCodes", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PromotionCode)) return false;
        PromotionCode that = (PromotionCode) o;
        return promotionCodeId != null && promotionCodeId.equals(that.promotionCodeId);
    }

    @Override
    public int hashCode() {
        return promotionCodeId != null ? promotionCodeId.hashCode() : 0;
    }


}
