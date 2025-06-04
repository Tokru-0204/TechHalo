package vn.fs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.fs.entity.Product;
import vn.fs.entity.PurchaseOrder;
import vn.fs.entity.PurchaseOrderDetail;
import vn.fs.entity.Supplier;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderDetailRepository extends JpaRepository<PurchaseOrderDetail, Long> {

    List<PurchaseOrderDetail> findByPurchaseOrder(PurchaseOrder purchaseOrder);

    //Gộp

    // Lấy chi tiết đơn hàng theo đơn hàng và sản phẩm
    @Query("SELECT pod FROM PurchaseOrderDetail pod WHERE pod.purchaseOrder.purchaseOrderId = :purchaseOrderId AND pod.product.productId = :productId")
    PurchaseOrderDetail findByPurchaseOrderAndProduct(@Param("purchaseOrderId") Long purchaseOrderId, @Param("productId") Long productId);

    // Thêm sản phẩm vào chi tiết đơn hàng
    @Modifying
    @Query(value = "INSERT INTO purchase_order_details (purchase_order_id, product_id, quantity, price, total_money) VALUES (:purchaseOrderId, :productId, :quantity, :price, :totalMoney)", nativeQuery = true)
    void addProductToPurchaseOrderDetail(@Param("purchaseOrderId") Long purchaseOrderId,
                                         @Param("productId") Long productId,
                                         @Param("quantity") int quantity,
                                         @Param("price") double price,
                                         @Param("totalMoney") double totalMoney);
//    // Lấy danh sách đơn hàng theo supplierId
//    @Query("SELECT pod FROM PurchaseOrderDetail pod WHERE pod.purchaseOrder.supplier.supplierId = :supplierId")
//    List<PurchaseOrderDetail> findDetailsBySupplierId(@Param("supplierId") Long supplierId);

    List<PurchaseOrderDetail> findBySupplier(Supplier supplier);




    // Xóa sản phẩm khỏi chi tiết đơn hàng
    @Modifying
    @Query(value = "DELETE FROM purchase_order_details WHERE purchase_order_detail_id = :purchaseOrderDetailId", nativeQuery = true)
    void removeProductFromPurchaseOrderDetail(@Param("purchaseOrderDetailId") Long purchaseOrderDetailId);

    // Cập nhật thông tin chi tiết đơn hàng (số lượng, giá, tổng tiền)
    @Modifying
    @Query(value = "UPDATE purchase_order_details SET quantity = :quantity, price = :price, total_money = :totalMoney WHERE purchase_order_detail_id = :purchaseOrderDetailId", nativeQuery = true)
    void updatePurchaseOrderDetail(@Param("purchaseOrderDetailId") Long purchaseOrderDetailId,
                                   @Param("quantity") int quantity,
                                   @Param("price") double price,
                                   @Param("totalMoney") double totalMoney);

    // Lấy danh sách sản phẩm từ một đơn hàng
    @Query("SELECT pod.product FROM PurchaseOrderDetail pod WHERE pod.purchaseOrder.purchaseOrderId = :purchaseOrderId")
    List<Product> findProductsByPurchaseOrderId(@Param("purchaseOrderId") Long purchaseOrderId);

    // Lấy danh sách chi tiết đơn hàng dựa vào ID sản phẩm
    @Query("SELECT pod FROM PurchaseOrderDetail pod WHERE pod.product.productId = :productId")
    List<PurchaseOrderDetail> findDetailsByProductId(@Param("productId") Long productId);

    @Modifying
    @Query("UPDATE PurchaseOrderDetail pd SET pd.quantity = pd.quantity + :quantity WHERE pd.purchaseOrder.purchaseOrderId = :orderId")
    void updatePurchaseOrderDetailQuantity(@Param("orderId") Long orderId, @Param("quantity") int quantity);

    // findById
    Optional<PurchaseOrderDetail> findByPurchaseOrderDetailId(Long id);



}
