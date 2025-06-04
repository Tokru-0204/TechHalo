import { Component, OnInit, ViewChild,TemplateRef  } from '@angular/core';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from 'src/app/services/upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;  
  customer!: Customer;
  orders!: Order[];

  //update
  defaultImageUrl: string = 'https://res.cloudinary.com/veggie-shop/image/upload/v1633795994/users/mnoryxp056ohm0b4gcrj.png';
  image: string = this.defaultImageUrl;

  profileForm: FormGroup;

  page: number = 1;
  showEditForm: boolean = false;

  done!: number;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private uploadService: UploadService,
    private sessionService: SessionService,
    private router: Router,
    private orderService: OrderService,
    private webSocketService: WebSocketService,
    private fb: FormBuilder,
    private notificationService: NotificationService) {

      this.profileForm = this.fb.group({
        userId: [null], 
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern('(0)[0-9]{9}')]], 
        gender: [true, [Validators.required]],  
        image: [this.defaultImageUrl],  
        registerDate: [new Date(), [Validators.required]],  
        status: [1, [Validators.required]], 
        token: [null]  
      });
      
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
    // Cập nhật form sau khi lấy dữ liệu từ server
    this.profileForm.patchValue({
      userId: this.customer.userId,
      email: this.customer.email,
      name: this.customer.name,
      password: '******', 
      address: this.customer.address,
      phone: this.customer.phone,
      gender: this.customer.gender,
      image: this.customer.image || this.defaultImageUrl, // Nếu không có ảnh thì dùng ảnh mặc định
      registerDate: this.customer.registerDate || new Date(), // Trường ngày đăng ký
      status: this.customer.status || 1, // Trạng thái, mặc định là 1 (hoạt động)
      token: this.customer.token || null  // Thêm trường token (có thể null nếu không có token)
    });
    this.image = this.customer.image || this.defaultImageUrl;
    }, error => {
      this.toastr.error('Lỗi thông tin', 'Hệ thống')
      window.location.href = ('/');
    })
  }
   // Cập nhật thông tin người dùng
   updateProfile() {
    if (this.profileForm.invalid) {
      return;  // Nếu form không hợp lệ, không thực hiện gì cả
    }
  
    const updatedCustomer = { ...this.profileForm.value, image: this.image };
  
    // Gọi service để update thông tin
    this.customerService.update(updatedCustomer.userId, updatedCustomer).subscribe(
      response => {
        this.toastr.success('Cập nhật thông tin thành công!', 'Hệ thống');
        this.getCustomer();  // Cập nhật lại thông tin sau khi lưu
        this.showEditForm = false;  // Đóng form sau khi cập nhật
      },
      error => {
        this.toastr.error('Lỗi cập nhật thông tin', 'Hệ thống');
        console.error('Chi tiết lỗi:', error);
      }
    );
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
    // Định nghĩa phương thức mở modal chỉnh sửa thông tin
    openEditModal() {
      this.modalService.open(this.content);  // Mở modal bằng ng-bootstrap
    }
  
    onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.uploadService.uploadCustomer(file).subscribe(
          (response) => {
            if (response && response.secure_url) {
              this.image = response.secure_url;
            }
          },
          (error) => {
            this.toastr.error('Lỗi tải lên hình ảnh!', 'Hệ thống');
            console.error('Chi tiết lỗi:', error);
          }
        );
      }
    }
}
