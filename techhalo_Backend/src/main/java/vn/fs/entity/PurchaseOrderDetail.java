package vn.fs.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "purchase_order_details")
public class PurchaseOrderDetail implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseOrderDetailId;
    private int quantity;
    private double price;
    private double totalMoney;

    private Date createAt_purchaseOrderDetail;

    @ManyToOne
    @JoinColumn(name = "purchaseOrderId")
    private PurchaseOrder purchaseOrder;

    @OneToOne
    @JoinColumn(name = "productId")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "supplierId")
    private Supplier supplier;


}

