package vn.fs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.fs.entity.Product;

@Repository
public interface StatisticalRepository extends JpaRepository<Product, Long> {

    @Query(value = "select year(order_date) from orders group by year(order_date)", nativeQuery = true)
    List<Integer> getYears();


    @Query(value = "select sum(p.sold), c.category_name, (p.price*sum(p.sold)-(p.discount)*sum(p.sold)) from categories c\r\n"
            + "join products p on p.category_id = c.category_id\r\n"
            + "group by c.category_name order by sum(p.sold) desc", nativeQuery = true)
    List<Object[]> getCategoryBestSeller();

    ////
    @Query(value = "SELECT HOUR(order_date) AS hour, SUM(amount) AS total " +
            "FROM orders " +
            "WHERE YEAR(order_date) = ?1 AND MONTH(order_date) = ?2 AND DAY(order_date) = ?3 " +
            "AND status = 4 AND order_date IS NOT NULL " +
            "GROUP BY HOUR(order_date)",
            nativeQuery = true)
    List<Object[]> getRevenueByDayGroupedByHour(int year, int month, int day);

    @Query(value = "select sum(amount) from orders where year(order_date) = ?1 and status = 4", nativeQuery = true)
    Double getRevenueByYear(int year);

    @Query(value = "select month(order_date), sum(amount) from orders where year(order_date) = ?1 and status = 4 group by month(order_date)", nativeQuery = true)
    List<Object[]> getRevenueByYearGroupedByMonth(int year);

    @Query(value = "select sum(amount) from orders where year(order_date) = ?1 and month(order_date) = ?2 and status = 4", nativeQuery = true)
    Double getRevenueByMonth(int year, int month);

    @Query(value = "select day(order_date), sum(amount) from orders where year(order_date) = ?1 and month(order_date) = ?2 and status = 4 group by day(order_date)", nativeQuery = true)
    List<Object[]> getRevenueByMonthGroupedByDay(int year, int month);

    @Query(value = "select sum(amount) from orders where year(order_date) = ?1 and month(order_date) = ?2 and day(order_date) = ?3 and status = 4", nativeQuery = true)
    Double getRevenueByDay(int year, int month, int day);
}
