import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from '../../common/ChatMessage';
import { Customer } from '../../common/Customer';
import { Notification } from '../../common/Notification';
import { Order } from '../../common/Order';
import { CustomerService } from '../../services/customer.service';
import { NotificationService } from '../../services/notification.service';
import { OrderService } from '../../services/order.service';
import { SessionService } from '../../services/session.service';
import { WebSocketService } from '../../services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-history',
  templateUrl: './profile-history.component.html',
  styleUrls: ['./profile-history.component.css']
})
export class ProfileHistoryComponent implements OnInit {

  customer!: Customer;
  orders!: Order[];

  page: number = 1;
  showEditForm: boolean = false;

  done!: number;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private sessionService: SessionService,
    private router: Router,
    private orderService: OrderService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.getCustomer();
    this.getOrder();
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }

  getCustomer() {
    let email = this.sessionService.getUser();
    this.customerService.getByEmail(email).subscribe(data => {
      this.customer = data as Customer;
    }, error => {
      this.toastr.error('Lỗi thông tin', 'Hệ thống')
      window.location.href = ('/');
    })
  }

  getOrder() {
    let email = this.sessionService.getUser();
    this.orderService.get(email).subscribe(data => {
      this.orders = data as Order[];
      this.done = 0;
      this.orders.forEach(o => {
        if (o.status === 4) {
          this.done += 1
        }
      })
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  cancel(id: number) {
    if(id===-1) {
      return;
    }
    Swal.fire({
      title: 'Bạn có muốn huỷ đơn hàng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Huỷ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.cancel(id).subscribe(data => {
          this.getOrder();
          this.sendMessage(id);
          this.toastr.success('Huỷ đơn hàng thành công!', 'Hệ thống');
        }, error => {
          this.toastr.error('Lỗi server', 'Hệ thống');
        })
      }
    })

  }

  sendMessage(id:number) {
    let chatMessage = new ChatMessage(this.customer.name, ' đã huỷ một đơn hàng');
    this.notificationService.post(new Notification(0, this.customer.name + ' đã huỷ một đơn hàng ('+id+')')).subscribe(data => {
      this.webSocketService.sendMessage(chatMessage);
    })
  }

  finish() {
    this.ngOnInit();
  }

  navigateToEditProfile() {
    if (this.customer && this.customer.userId) {
      this.router.navigate(['/edit-profile', this.customer.userId]);
    } else {
      console.error('Không tìm thấy userId!');
    }
  }

}
