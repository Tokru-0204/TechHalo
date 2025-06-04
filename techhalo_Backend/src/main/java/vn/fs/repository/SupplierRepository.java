package vn.fs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fs.entity.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long>{
}
