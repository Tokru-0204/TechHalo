package vn.fs.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseOrderId;

    private Date updateAt_purchaseOrder;

    private Date createAt_purchaseOrder;


//    @ManyToOne
//    @JoinColumn(name = "categoryId")
//    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplierId")
    private Supplier supplier;

//    @ManyToOne
//    @JoinColumn(name = "productId")
//    private Product product;

    public PurchaseOrder(Date updateAt_purchaseOrder, Date createAt_purchaseOrder, Supplier supplier) {
        this.updateAt_purchaseOrder = updateAt_purchaseOrder;
        this.createAt_purchaseOrder = createAt_purchaseOrder;
        this.supplier = supplier;
    }


}
