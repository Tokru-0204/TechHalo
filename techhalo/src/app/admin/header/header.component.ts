import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from '../../common/ChatMessage';
import { Customer } from '../../common/Customer';
import { Notification } from '../../common/Notification';
import { CustomerService } from '../../services_admin/customer.service';
import { NotificationService } from '../../services_admin/notification.service';
import { SessionService } from '../../services_admin/session.service';
import { AuthService } from '../../services_admin/auth.service';
import { WebSocketService } from '../../services_admin/web-socket.service';


@Component({
  selector: 'app-header-admin',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent_Admin implements OnInit {

  user!: Customer;
  image!: string;
  name!: string;

  notifications!: Notification[];

  webSocket!: WebSocket;
  chatMessages: ChatMessage[] = [];
  email!: string;
  role: string = 'Loading...'; // Giá trị mặc định ban đầu
  constructor(private sessionService: SessionService, private router: Router, private customerService: CustomerService,
    private toastr: ToastrService, private notificationService: NotificationService, private userService : AuthService) { }

  ngOnInit(): void {
    // Lấy email từ session
    this.email = this.sessionService.getUser() || 'Unknown User';

  if (this.email) {
    this.userService.getRoleByEmail(this.email).subscribe(
      role => {
        this.role = role; // Gán vai trò từ JSON trả về
      },
      error => {
        console.error('Không thể lấy vai trò:', error);
        this.role = 'Unknown Role'; // Vai trò mặc định nếu có lỗi
      }
    );
  }
  
    this.openWebSocket();
    this.getUser();
    this.getAllNotification()
  }
  
  getUser() {
    let email = this.sessionService.getUser();
    this.customerService.getByEmail(email).subscribe(data => {
      this.user = data as Customer;
      this.name = this.user.name;
      this.image = this.user.image;
    }, error => {
      this.toastr.error('Đã xảy ra lỗi', 'Hệ thống');
      this.sessionService.signOut();
      this.router.navigate(['/login']);
    })
  }

  getAllNotification() {
    this.notificationService.get().subscribe(data => {
      this.notifications = data as Notification[];
    })
  }

  getNotificationFalse(): number{
    let count = 0;
    for (const item of this.notifications) {
      if(!item.status) {
        count++;
      }
    }
    return count;
  }
  
  readed(id: number) {
    this.notificationService.readed(id).subscribe(data=>{
      this.getAllNotification();
    })
  }


  readAll() {
    for (const i of this.notifications) {
      this.notificationService.readed(i.id).subscribe(data=>{        
      })
    }
    this.getAllNotification();
  }
  // logOut() {
    
  //   this.router.navigate(['/home']);

  //   // Điều hướng về home
  //   this.router.navigate(['/home']).then(() => {
  //     // Reload trang để áp dụng CSS toàn cục
  //     window.location.reload();
  //   });
  // }
  logOut() {
    this.sessionService.signOut();
    window.location.href = ('/');
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
      const chatMessageDto = JSON.parse(event.data);
      let mess: ChatMessage = chatMessageDto as ChatMessage;
      this.toastr.info('Khách hàng '+mess.user+' '+mess.message, 'Hệ thống');
      this.getAllNotification();
      this.getNotificationFalse();
      this.chatMessages.push(chatMessageDto);
    };

    this.webSocket.onclose = (event) => {
      // console.log('Close: ', event);
    };
  }

  closeWebSocket() {
    this.webSocket.close();
  }

}
