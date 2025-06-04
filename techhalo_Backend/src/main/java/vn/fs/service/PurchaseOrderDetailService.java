package vn.fs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.fs.entity.PurchaseOrder;
import vn.fs.entity.PurchaseOrderDetail;
import vn.fs.entity.Supplier;
import vn.fs.exception.ResourceNotFoundException;
import vn.fs.repository.ProductRepository;
import vn.fs.repository.PurchaseOrderDetailRepository;
import vn.fs.repository.PurchaseOrderRepository;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class PurchaseOrderDetailService {

    @Autowired
    private PurchaseOrderDetailRepository purchaseOrderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    // Phương thức lấy tất cả chi tiết đơn hàng
    public List<PurchaseOrderDetail> findAll() {
        return purchaseOrderDetailRepository.findAll();
    }

    public List<PurchaseOrderDetail> findByPurchaseOrder(PurchaseOrder purchaseOrder) {
        return purchaseOrderDetailRepository.findByPurchaseOrder(purchaseOrder);
    }

    //Gộp
    // Lấy chi tiết đơn hàng nhập theo ID
    public PurchaseOrderDetail getPurchaseOrderDetailById(Long id) {
        return purchaseOrderDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order detail not found with ID: " + id));
    }

    // Lưu hoặc cập nhật chi tiết đơn hàng nhập
    public PurchaseOrderDetail savePurchaseOrderDetail(PurchaseOrderDetail purchaseOrderDetail) {
        return purchaseOrderDetailRepository.save(purchaseOrderDetail);
    }

    // Xóa chi tiết đơn hàng nhập
    public void deletePurchaseOrderDetail(Long id) {
        if (!purchaseOrderDetailRepository.existsById(id)) {
            throw new ResourceNotFoundException("Purchase order detail not found with ID: " + id);
        }
        purchaseOrderDetailRepository.deleteById(id);
    }

    // Lấy tất cả các chi tiết đơn hàng nhập
    public List<PurchaseOrderDetail> getAllPurchaseOrderDetails() {
        return purchaseOrderDetailRepository.findAll();
    }


    @Transactional
    public PurchaseOrderDetail createPurchaseOrderDetail(PurchaseOrderDetail purchaseOrderDetail) {
        return purchaseOrderDetailRepository.save(purchaseOrderDetail);
    }

    // Lấy danh sách nhập hàng theo supplierId
    public List<PurchaseOrderDetail> getDetailsBySupplier(Supplier supplier) {
        return purchaseOrderDetailRepository.findBySupplier(supplier);
    }


    // Lấy danh sách các chi tiết đơn hàng nhập từ một PurchaseOrder
    public List<PurchaseOrderDetail> getDetailsByPurchaseOrderId(Long purchaseOrderId) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(purchaseOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found with ID: " + purchaseOrderId));

        return purchaseOrderDetailRepository.findByPurchaseOrder(purchaseOrder);
    }

    // Xóa chi tiết sản phẩm khỏi đơn hàng nhập
    public void removeProductFromPurchaseOrderDetail(Long purchaseOrderDetailId) {
        if (!purchaseOrderDetailRepository.existsById(purchaseOrderDetailId)) {
            throw new ResourceNotFoundException("Purchase order detail not found with ID: " + purchaseOrderDetailId);
        }
        purchaseOrderDetailRepository.deleteById(purchaseOrderDetailId);
    }

    // Cập nhật chi tiết đơn hàng nhập
    public PurchaseOrderDetail updatePurchaseOrderDetail(Long purchaseOrderDetailId, int quantity, double price) {
        PurchaseOrderDetail purchaseOrderDetail = purchaseOrderDetailRepository.findById(purchaseOrderDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order detail not found with ID: " + purchaseOrderDetailId));

        purchaseOrderDetail.setQuantity(quantity);
        purchaseOrderDetail.setPrice(price);
        purchaseOrderDetail.setTotalMoney(quantity * price);

        return purchaseOrderDetailRepository.save(purchaseOrderDetail);
    }


}
