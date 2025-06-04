package vn.fs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.fs.entity.PurchaseOrder;
import vn.fs.entity.Supplier;
import vn.fs.repository.PurchaseOrderRepository;
import vn.fs.repository.SupplierRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;
    @Autowired
    private SupplierRepository supplierRepository;

    public Optional<PurchaseOrder> getById(Long id) {
        return purchaseOrderRepository.findById(id);
    }

    //Gộp
    public PurchaseOrder createOrUpdatePurchaseOrder(Long supplierId) {
        // Tìm Supplier
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        // Tìm PurchaseOrder theo Supplier
        Optional<PurchaseOrder> optionalOrder = purchaseOrderRepository.findFirstBySupplierOrderByUpdateAtPurchaseOrderDesc(supplierId);

        if (optionalOrder.isPresent()) {
            // Nếu tồn tại, cập nhật update_at_purchase_order
            PurchaseOrder existingOrder = optionalOrder.get();
            existingOrder.setUpdateAt_purchaseOrder(new Date());
            return purchaseOrderRepository.save(existingOrder);
        } else {
            // Nếu không tồn tại, tạo mới
            PurchaseOrder newOrder = new PurchaseOrder();
            newOrder.setCreateAt_purchaseOrder(new Date());
            newOrder.setUpdateAt_purchaseOrder(new Date());
            newOrder.setSupplier(supplier);
            return purchaseOrderRepository.save(newOrder);
        }
    }

    // Lấy danh sách đơn hàng theo supplierId
    public List<PurchaseOrder> getAllPurchaseOrders(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));
        return purchaseOrderRepository.findBySupplier(supplier);
    }


}
