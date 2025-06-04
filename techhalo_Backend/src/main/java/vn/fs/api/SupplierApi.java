package vn.fs.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fs.entity.Supplier;
import vn.fs.repository.SupplierRepository;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/suppliers")
public class SupplierApi {

    @Autowired
    SupplierRepository repo;

    @GetMapping
    public ResponseEntity<List<Supplier>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<Supplier> getById(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repo.findById(id).get());
    }

    @PostMapping
    public ResponseEntity<Supplier> post(@RequestBody Supplier supplier) {
        if (repo.existsById(supplier.getSupplierId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(repo.save(supplier));
    }

    @PutMapping("{id}")
    public ResponseEntity<Supplier> put(@RequestBody Supplier supplier, @PathVariable("id") Long id) {
        if (!id.equals(supplier.getSupplierId())) {
            return ResponseEntity.badRequest().build();
        }
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repo.save(supplier));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
