package vn.fs.api;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.fs.dto.CategoryBestSeller;
import vn.fs.dto.Statistical;
import vn.fs.entity.Order;
import vn.fs.entity.Product;
import vn.fs.repository.OrderRepository;
import vn.fs.repository.ProductRepository;
import vn.fs.repository.StatisticalRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/statistical")
public class StatisticalApi {

    @Autowired
    StatisticalRepository statisticalRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;


    @GetMapping("/countYear")
    public ResponseEntity<List<Integer>> getYears() {
        return ResponseEntity.ok(statisticalRepository.getYears());
    }

    @GetMapping("/get-all-order-success")
    public ResponseEntity<List<Order>> getAllOrderSuccess() {
        return ResponseEntity.ok(orderRepository.findByStatus(2));
    }

    @GetMapping("/get-category-seller")
    public ResponseEntity<List<CategoryBestSeller>> getCategoryBestSeller() {
        List<Object[]> list = statisticalRepository.getCategoryBestSeller();
        List<CategoryBestSeller> listCategoryBestSeller = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            CategoryBestSeller categoryBestSeller = new CategoryBestSeller(String.valueOf(list.get(i)[1]),
                    Integer.valueOf(String.valueOf(list.get(i)[0])), Double.valueOf(String.valueOf(list.get(i)[2])));
            listCategoryBestSeller.add(categoryBestSeller);
        }
        return ResponseEntity.ok(listCategoryBestSeller);
    }

    @GetMapping("/get-inventory")
    public ResponseEntity<List<Product>> getInventory() {
        return ResponseEntity.ok(productRepository.findByStatusTrueOrderByQuantityDesc());
    }

    ///


    @GetMapping("/revenue/year/{year}")
    public ResponseEntity<Double> getRevenueByYear(@PathVariable int year) {
        return ResponseEntity.ok(statisticalRepository.getRevenueByYear(year));
    }

    @GetMapping("/revenue/year/{year}/details")
    public ResponseEntity<List<Statistical>> getRevenueByYearDetails(@PathVariable int year) {
        List<Object[]> rawData = statisticalRepository.getRevenueByYearGroupedByMonth(year);
        List<Statistical> result = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            result.add(new Statistical(i, null, 0.0, 0)); // Mặc định giá trị 0 cho tháng
        }
        for (Object[] row : rawData) {
            int month = ((Number) row[0]).intValue();
            double amount = ((Number) row[1]).doubleValue();
            result.set(month - 1, new Statistical(month, null, amount, 0));
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue/month/{year}/{month}")
    public ResponseEntity<Double> getRevenueByMonth(@PathVariable int year, @PathVariable int month) {
        return ResponseEntity.ok(statisticalRepository.getRevenueByMonth(year, month));
    }

    @GetMapping("/revenue/month/{year}/{month}/details")
    public ResponseEntity<List<Statistical>> getRevenueByMonthDetails(@PathVariable int year, @PathVariable int month) {
        List<Object[]> rawData = statisticalRepository.getRevenueByMonthGroupedByDay(year, month);
        List<Statistical> result = new ArrayList<>();
        for (int i = 1; i <= 31; i++) {
            result.add(new Statistical(month, i, 0.0, 0)); // Mặc định giá trị 0 cho ngày
        }
        for (Object[] row : rawData) {
            int day = ((Number) row[0]).intValue();
            double amount = ((Number) row[1]).doubleValue();
            result.set(day - 1, new Statistical(month, day, amount, 0));
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue/day/{year}/{month}/{day}")
    public ResponseEntity<Double> getRevenueByDay(@PathVariable int year, @PathVariable int month, @PathVariable int day) {
        return ResponseEntity.ok(statisticalRepository.getRevenueByDay(year, month, day));
    }

    @GetMapping("/revenue/day/{year}/{month}/{day}/details")
    public ResponseEntity<List<Statistical>> getRevenueByDayDetails(
            @PathVariable int year,
            @PathVariable int month,
            @PathVariable int day) {
        List<Object[]> rawData = statisticalRepository.getRevenueByDayGroupedByHour(year, month, day);
        List<Statistical> result = new ArrayList<>();

        for (int i = 0; i < 24; i++) {
            result.add(new Statistical(i, null, 0.0, 0));
        }
        for (Object[] row : rawData) {
            int hour = ((Number) row[0]).intValue();
            double amount = ((Number) row[1]).doubleValue();
            if (hour >= 0 && hour < 24) {
                result.set(hour, new Statistical(hour, null, amount, 0));
            }
        }

        return ResponseEntity.ok(result);
    }


}
