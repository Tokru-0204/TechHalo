# 📌 Tên Dự Án

> Một mô tả ngắn gọn, súc tích (1-2 câu) về mục đích của dự án và giá trị mang lại.

---

## 🚀 Demo / Preview

> (Tùy chọn) Link demo, video hoặc hình ảnh nổi bật về sản phẩm.

---

## 📷 Screenshots

> Một vài ảnh minh họa tính năng hoặc giao diện chính.

| Trang chủ | Admin Dashboard | Trang sản phẩm |
|----------|------------------|----------------|
| ![](images/home.png) | ![](images/admin.png) | ![](images/product.png) |

---

## 🎯 Tính năng nổi bật

- ✅ Đăng nhập/Đăng ký với JWT  
- ✅ Phân quyền người dùng: Admin vs User  
- ✅ Giỏ hàng, thanh toán, mã giảm giá  
- ✅ CRUD sản phẩm, đơn hàng, thống kê  
- ✅ Giao diện responsive & hiện đại  

---

## 🧰 Công nghệ sử dụng

### Frontend:

- Angular (CLI 12+)  
- Angular Material, SCSS  
- RxJS, ngx-pagination, toastr, slick-carousel  
- Chart.js, jsPDF, SweetAlert2  

### Backend:

- Java 17, Spring Boot 3  
- Spring Security + JWT  
- MySQL, JPA (Hibernate)  
- Swagger UI (API Docs)

---

## ⚙️ Cài đặt & chạy thử

### Backend:

```bash
cd BE
# Cập nhật database trong application.properties
./mvnw spring-boot:run
