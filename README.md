# 📌 Laptop E-Commerce Website (Fullstack)

> Một dự án website bán hàng máy tính TechHalo. Dự án áp dụng nhiều công nghệ mới nhầm hỗ trợ chủ doanh nghiệp quản lý, cũng nhưng cải thiện trải nghiệm người dùng.

---

## 🎬 Video demo

[![Watch the demo](https://img.youtube.com/vi/xab75wW7rB4/maxresdefault.jpg)](https://www.youtube.com/watch?v=xab75wW7rB4)

## 📷 Giao diện trang web

### 🏠 Giao diện trang chủ
![](images/home.png)

### 🛒 Giao diện trang cửa hàng
![](images/store.png)

### 📄 Giao diện trang chi tiết sản phẩm
![](images/product-detail.png)

### 💳 Giao diện trang thanh toán
![](images/checkout.png)

### 📊 Giao diện Dashboard
![](images/admin-dashboard.png)

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
