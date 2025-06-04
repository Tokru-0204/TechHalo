package vn.fs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import vn.fs.entity.PurchaseOrder;
import vn.fs.entity.Supplier;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long>{

    List<PurchaseOrder> findBySupplier(Supplier supplier);

    List<PurchaseOrder> findBySupplierOrderByPurchaseOrderIdDesc(Supplier supplier);

    List<PurchaseOrder> findAllByOrderByPurchaseOrderIdDesc();

    //Gộp

    //    List<PurchaseOrder> findAllByOrderByPurchaseOrderIdDesc();
    @Query(value = "SELECT * FROM purchase_orders WHERE supplier_id = :supplierId ORDER BY update_at_purchase_order DESC LIMIT 1", nativeQuery = true)
    Optional<PurchaseOrder> findFirstBySupplierOrderByUpdateAtPurchaseOrderDesc(@Param("supplierId") Long supplierId);

    // Query cập nhật `update_at_purchase_order` (native query)
    @Modifying
    @Transactional
    @Query(value = "UPDATE purchase_orders SET update_at_purchase_order = CURRENT_TIMESTAMP WHERE purchase_order_id = :id", nativeQuery = true)
    void updatePurchaseOrderUpdateAt(@Param("id") Long id);



}
