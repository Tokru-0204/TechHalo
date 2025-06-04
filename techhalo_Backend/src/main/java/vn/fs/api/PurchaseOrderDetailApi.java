package vn.fs.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fs.entity.Product;
import vn.fs.entity.PurchaseOrder;
import vn.fs.entity.PurchaseOrderDetail;
import vn.fs.entity.Supplier;
import vn.fs.repository.ProductRepository;
import vn.fs.repository.SupplierRepository;
import vn.fs.service.ProductService;
import vn.fs.service.PurchaseOrderDetailService;
import vn.fs.service.PurchaseOrderService;

import java.util.Date;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/purchase-order-details")
public class PurchaseOrderDetailApi {

    @Autowired
    private PurchaseOrderDetailService purchaseOrderDetailService;

    @Autowired
    private PurchaseOrderService purchaseOrderService;
    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductService productService;

    @GetMapping("/purchase-order/{id}")
    public ResponseEntity<List<PurchaseOrderDetail>> getByPurchaseOrder(@PathVariable("id") Long id) {
        return purchaseOrderService.getById(id)
                .map(purchaseOrder -> ResponseEntity.ok(purchaseOrderDetailService.findByPurchaseOrder(purchaseOrder)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Method bổ sung: Lấy tất cả chi tiết đơn hàng nhập
//    @GetMapping
//    public ResponseEntity<List<PurchaseOrderDetail>> getAll() {
//        List<PurchaseOrderDetail> purchaseOrderDetails = purchaseOrderDetailService.findAll();
//        return ResponseEntity.ok(purchaseOrderDetails);
//    }

    //Gộp
    // Lấy tất cả chi tiết đơn hàng nhập
    @GetMapping
    public ResponseEntity<List<PurchaseOrderDetail>> getAllPurchaseOrderDetails() {
        return ResponseEntity.ok(purchaseOrderDetailService.getAllPurchaseOrderDetails());
    }

    // Lấy chi tiết đơn hàng nhập theo ID
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDetail> getPurchaseOrderDetailById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderDetailService.getPurchaseOrderDetailById(id));
    }

    // Lấy danh sách chi tiết đơn hàng nhập theo PurchaseOrder ID
    @GetMapping("/purchase-order/{purchaseOrderId}")
    public ResponseEntity<List<PurchaseOrderDetail>> getDetailsByPurchaseOrderId(@PathVariable Long purchaseOrderId) {
        return ResponseEntity.ok(purchaseOrderDetailService.getDetailsByPurchaseOrderId(purchaseOrderId));
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<PurchaseOrderDetail>> getAllPurchaseOrderDetails(@PathVariable Long supplierId) {
        // Tìm đối tượng Supplier
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        // Lấy danh sách chi tiết đơn hàng nhập liên quan đến Supplier
        List<PurchaseOrderDetail> purchaseOrderDetails = purchaseOrderDetailService.getDetailsBySupplier(supplier);

        // Trả về danh sách
        return ResponseEntity.ok(purchaseOrderDetails);
    }


    @PostMapping
    public ResponseEntity<PurchaseOrderDetail> createPurchaseOrderDetail(
            @RequestParam Long productId,
            @RequestParam Long supplierId,
            @RequestParam int quantity,
            @RequestParam double price) {

        // Tìm đối tượng Product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Tìm đối tượng Supplier
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        // Kiểm tra và cập nhật bảng PurchaseOrder
        PurchaseOrder purchaseOrder = purchaseOrderService.createOrUpdatePurchaseOrder(supplierId);

        // Tạo mới PurchaseOrderDetail
        PurchaseOrderDetail purchaseOrderDetail = new PurchaseOrderDetail();
        purchaseOrderDetail.setProduct(product); // Gắn Product
        purchaseOrderDetail.setPurchaseOrder(purchaseOrder); // Gắn PurchaseOrder vừa tạo hoặc cập nhật
        purchaseOrderDetail.setSupplier(supplier); // Gắn Supplier
        purchaseOrderDetail.setQuantity(quantity);
        purchaseOrderDetail.setPrice(price);
        purchaseOrderDetail.setTotalMoney(quantity * price); // Tính tổng tiền
        purchaseOrderDetail.setCreateAt_purchaseOrderDetail(new Date());


        product.setQuantity(product.getQuantity() + quantity);

        // Lưu lại thay đổi số lượng vào sản phẩm
        productRepository.save(product);

        // Lưu vào bảng PurchaseOrderDetail
        PurchaseOrderDetail createdPurchaseOrderDetail = purchaseOrderDetailService.createPurchaseOrderDetail(purchaseOrderDetail);

        return ResponseEntity.ok(createdPurchaseOrderDetail);
    }


    // Cập nhật thông tin chi tiết đơn hàng nhập
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrderDetail> updatePurchaseOrderDetail(
            @PathVariable Long id,
            @RequestParam int quantity,
            @RequestParam double price) {
        return ResponseEntity.ok(purchaseOrderDetailService.updatePurchaseOrderDetail(id, quantity, price));
    }

    // Xóa chi tiết đơn hàng nhập theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrderDetail(@PathVariable Long id) {
        purchaseOrderDetailService.deletePurchaseOrderDetail(id);
        return ResponseEntity.noContent().build();
    }

    // Xóa sản phẩm khỏi chi tiết đơn hàng nhập
    @DeleteMapping("/remove-product/{purchaseOrderDetailId}")
    public ResponseEntity<Void> removeProductFromPurchaseOrderDetail(@PathVariable Long purchaseOrderDetailId) {
        purchaseOrderDetailService.removeProductFromPurchaseOrderDetail(purchaseOrderDetailId);
        return ResponseEntity.noContent().build();
    }


}
