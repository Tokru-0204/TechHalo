package vn.fs.entity;

import java.io.Serializable;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("serial")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cartDetails")
public class CartDetail implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartDetailId;
    private int quantity;
    private Double price;
    private Double discountProductCart;

    @OneToOne
    @JoinColumn(name = "promotionId")
    private PromotionCode promotionCode;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "cartId")
    private Cart cart;

}
