package vn.fs.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Statistical {

    private int month;    // Tháng
    private Date date;    // Ngày (nếu cần)
    private int day;      // Ngày trong tháng
    private Double amount; // Doanh thu
    private int count;    // Số lượng
    private int hour;     // Giờ trong ngày

    public Statistical(int month, int day, Double amount, int hour) {
        this.month = month;
        this.day = day;
        this.amount = amount != null ? amount : 0.0; // Tránh null
        this.hour = hour;
    }

    public Statistical(int month, Date date, Double amount, int count) {
        this.month = month;
        this.date = date;
        this.amount = amount != null ? amount : 0.0; // Tránh null
        this.count = count;
    }
}
