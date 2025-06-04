import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from '../../common/ChatMessage';
import { Order } from '../../common/Order';
import { OrderService } from '../../services_admin/order.service';
import { PageService } from '../../services_admin/page.service';
import { OrderDetail } from '../../common/OrderDetail';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent_Admin implements OnInit {

  listData!: MatTableDataSource<Order>;
  orders!: Order[];
  orderLength!: number;
  columns: string[] = ['id', 'user', 'address', 'phone', 'amount','paymentMethod',   'orderDate', 'status', 'print', 'view'];

  
  webSocket!: WebSocket;
  chatMessages: ChatMessage[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private toastr: ToastrService, private orderService: OrderService, private route: ActivatedRoute) { 
    route.params.subscribe(val => {
      this.ngOnInit();
    })
  }

  ngOnInit(): void {
    this.openWebSocket();
    this.pageService.setPageActive('order');
    this.getAllOrder();
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }


  formatOrderDate(orderDate: string): string {
    const date = new Date(orderDate);
    
    const hours = date.getHours().toString().padStart(2, '0'); 
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  }
  printInvoice(orderId: number) {
    // Gọi API lấy thông tin đơn hàng
    this.orderService.getById(orderId).subscribe(
      (orderData: any) => {
        const order = orderData as Order; // Chuyển kiểu về Order
  
        // Gọi API lấy danh sách chi tiết đơn hàng
        this.orderService.getByOrder(orderId).subscribe(
          (orderDetailsData: any) => {
            const orderDetails = orderDetailsData as OrderDetail[]; // Chuyển kiểu về OrderDetail[]
  
            // Tạo nội dung hóa đơn
            const printContent = `
            <html>
            <head>
              <style>
                body {
                  font-family: 'Roboto', Arial, sans-serif;
                  line-height: 1.6;
                  padding: 20px;
                  color: #333;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .header h2 {
                  margin: 0;
                  color: #757575 !important;
                }
                .header p {
                  margin: 0;
                  font-size: 14px;
                }
                .info {
                  margin-bottom: 20px;
                }
                .info p {
                  margin: 5px 0;
                  font-size: 14px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 10px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f8f9fa;
                }
                .footer {
                  margin-top: 15px;
                  text-align: center;
                  font-size: 14px;
                }
                .footer strong {
                  display: block;
                  margin-bottom: 4px;
                  font-size: 15px;
                }
                .footer p {
                  margin: 1px 0;
                  padding: 0;
                  font-size: 11px;
                }
                .solid {
                  border-top: 1px solid #333;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <!-- Header -->
              <hr class="solid">
              <div class="header">
                <h2>HÓA ĐƠN</h2>
                <p>TechHalo - Uy tín, chất lượng</p>
              </div>

              <!-- Thông tin đơn hàng -->
              <div class="info">
                <p><strong>Mã Hóa đơn:</strong> #${order.codeOrder}</p>
                <p><strong>Ngày đặt hàng:</strong> ${new Date(order.orderDate).toLocaleDateString()} - ${new Date(order.orderDate).toLocaleTimeString()}</p>
                <p><strong>Người nhận:</strong> ${order.user?.name || ''}</p>
                <p><strong>Số điện thoại:</strong> ${order.phone || ''}</p>
                <p><strong>Địa chỉ:</strong> ${order.address || ''}</p>
              </div>

              <!-- Danh sách sản phẩm -->
              <table>
                <thead>
                   <tr>
                    <th style="width: 5%; text-align: center;">STT</th>
                    <th style="width: 38%;">Mặt hàng</th>
                    <th style="width: 15%;">Đơn giá</th>
                    <th style="width: 12%;">Số lượng</th>
                    <th style="width: 15%;">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderDetails.map((detail: any, index: number) => `
                    <tr>
                      <td style="text-align: center;">${index + 1}</td>
                      <td>${detail.product?.name || 'Không rõ'}</td>
                      <td>${detail.price?.toLocaleString('vi-VN')}₫</td>
                      <td style="text-align: center">${detail.quantity}</td>
                      <td>${(detail.price * detail.quantity).toLocaleString('vi-VN')}₫</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div style="margin-top: 20px; font-size: 14px; line-height: 1.8;">
                <!-- Tạm tính -->
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">Tạm tính:</span>
                  <span>${(order.discountOrder + order.amount)?.toLocaleString('vi-VN') || '0'}₫</span>
                </div>
                <!-- Giảm giá -->
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">Giảm giá:</span>
                  <span>- ${order.discountOrder?.toLocaleString('vi-VN') || '0'}₫</span>
                </div>
                <!-- Thành tiền -->
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: bold; font-size: 18px;">Thành tiền:</span>
                  <span style="font-weight: bold; font-size: 18px;">${order.amount?.toLocaleString('vi-VN') || '0'}₫</span>
                </div>
                <!-- Ghi chú -->
                <div style="text-align: right; font-size: 12px; color: #666; margin-top: -7px; font-style: italic;">
                  (Thành tiền đã bao gồm thuế VAT)
                </div>
              </div>

              <hr class="solid">
              <!-- Footer -->
              <div class="footer">
                <strong>Cảm ơn quý khách đã mua hàng tại Web Laptop!</strong>
                <p>Mọi thắc mắc vui lòng liên hệ: 1900-123-456</p>
                <p>Địa chỉ: Số 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, Thành phố Hồ Chí Minh</p>
                <p>Email: support@techhalo.vn</p>
              </div>
            </body>
            </html>
          `;

          
  
            // Tạo iframe tạm thời để in
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);
  
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              iframeDoc.open();
              iframeDoc.write(printContent);
              iframeDoc.close();
  
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
  
              // Xóa iframe sau khi in xong
              document.body.removeChild(iframe);
            }
          },
          error => {
            this.toastr.error('Không thể tải chi tiết đơn hàng', 'Lỗi');
          }
        );
      },
      error => {
        this.toastr.error('Không thể tải thông tin đơn hàng', 'Lỗi');
      }
    );
  }
  
  

  getAllOrder() {
    this.orderService.get().subscribe(data => {
      this.orders = data as Order[];
      this.listData = new MatTableDataSource(this.orders);
      this.orderLength = this.orders.length;
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.orderService.get().subscribe(data => {
      this.orders = data as Order[];
      this.orders = this.orders.filter(o => o.user.name.toLowerCase().includes(fValue.toLowerCase()) || o.ordersId===Number(fValue) || o.address.toLowerCase().includes(fValue.toLowerCase()) || o.phone.includes(fValue.toLowerCase()));
      this.listData = new MatTableDataSource(this.orders);
      this.orderLength = this.orders.length;
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    })
    
  }

  finish() {
    this.ngOnInit();
  }

  openWebSocket() {
    this.webSocket = new WebSocket('ws://localhost:8080/notification');

    this.webSocket.onopen = (event) => {
      // console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      this.getAllOrder();
    };

    this.webSocket.onclose = (event) => {
      // console.log('Close: ', event);
    };
  }

  closeWebSocket() {
    this.webSocket.close();
  }

}
