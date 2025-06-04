package vn.fs.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fs.entity.PurchaseOrder;
import vn.fs.entity.PurchaseOrderDetail;
import vn.fs.repository.PurchaseOrderRepository;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/purchase-orders")
public class PurchaseOrderApi {

    @Autowired
    PurchaseOrderRepository purchaseOrderRepository;

    PurchaseOrderDetail purchaseOrderDetail = new PurchaseOrderDetail();

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> findAll() {
        return ResponseEntity.ok(purchaseOrderRepository.findAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<PurchaseOrder> getById(@PathVariable("id") Long id) {
        if (!purchaseOrderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(purchaseOrderRepository.findById(id).get());
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> post(@RequestBody PurchaseOrder purchaseOrder) {
        if (purchaseOrderRepository.existsById(purchaseOrder.getPurchaseOrderId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(purchaseOrderRepository.save(purchaseOrder));
    }

    @PutMapping("{id}")
    public ResponseEntity<PurchaseOrder> put(@RequestBody PurchaseOrder purchaseOrder, @PathVariable("id") Long id) {
        if (!id.equals(purchaseOrder.getPurchaseOrderId())) {
            return ResponseEntity.badRequest().build();
        }
        if (!purchaseOrderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(purchaseOrderRepository.save(purchaseOrder));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!purchaseOrderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        purchaseOrderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
