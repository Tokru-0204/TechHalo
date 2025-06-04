package vn.fs.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("serial")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ordersId;
    //set kieu du lieu cho orderDate lDatetime
    @Column(columnDefinition = "TIMESTAMP")
    private Date orderDate;
    private Double amount;
    private double discountOrder;
    private String address;
    private String phone;
    private int status;
    private int paymentMethod;
    @Column(name = "code_order", unique = true)
    private String codeOrder;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @PostPersist
    private void generateCodeProduct() {
        if (codeOrder == null || codeOrder.isEmpty()) {
            this.codeOrder = "MHDTH" + String.format("%05d", ordersId);
        }
    }


}
