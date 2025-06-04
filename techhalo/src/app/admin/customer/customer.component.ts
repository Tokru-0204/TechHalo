import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../common/Customer';
import { CustomerService } from '../../services_admin/customer.service';
import { PageService } from '../../services_admin/page.service';
import { SessionService } from '../../services_admin/session.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services_admin/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent_Admin implements OnInit {

  listData!: MatTableDataSource<Customer>;
  customers!: Customer[];
  customerLength!: number;
  email!: string;
  role: string = 'Loading...';
  columns: string[] = ['image', 'name', 'email','address', 'phone', 'gender', 'registerDate','role', 'view', 'delete'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  emailAdmin!:string;

  constructor(private pageService: PageService, private customerService: CustomerService, private toastr: ToastrService, private sessionService: SessionService, private userService: AuthService) { }

  ngOnInit(): void {
    
    
    
    this.emailAdmin = this.sessionService.getUser();
    this.pageService.setPageActive('customer');
    // Lấy email từ session
    this.email = this.sessionService.getUser() || 'Unknown User';

    if (this.email) {
      this.userService.getRoleByEmail(this.email).subscribe(
        role => {
          this.role = role; // Gán vai trò từ JSON trả về
          if (this.role === 'ROLE_EMPLOYEE') {
            this.columns = this.columns.filter(column => column !== 'role' && column !== 'view' && column !== 'delete');
          }
        },
        error => {
          console.error('Không thể lấy vai trò:', error);
          this.role = 'Unknown Role'; // Vai trò mặc định nếu có lỗi
        }
      );
    } 
      
    this.getAll();
  }
  isRoleAllowed(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.role);
  }

  formatCustomerDate(registerDate: string): string {
    const date = new Date(registerDate);
    
    const hours = date.getHours().toString().padStart(2, '0'); 
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  }

  getAll() {
    this.customerService.getAll().subscribe(data => {
      this.customers = data as Customer[];
      this.customers = this.customers.filter(c=>c.email!=this.emailAdmin);

    // Lọc danh sách loại bỏ tài khoản của admin nếu vai trò người đăng nhập là "Nhân viên"
    if (this.role === 'ROLE_EMPLOYEE') {
      this.customers = this.customers.filter(c => 
        c.roles && !c.roles.some(role => role.name === 'ROLE_ADMIN')
      );
    }

    // Lọc danh sách để không hiển thị chính tài khoản người dùng đang đăng nhập
    this.customers = this.customers.filter(c => c.email !== this.emailAdmin);

    // Ánh xạ vai trò từ danh sách trả về
    this.customers.forEach(c => {
      c.role = c.roles && c.roles.length > 0 ? c.roles[0].name : 'ROLE_USER'; // Mặc định là ROLE_USER nếu không có vai trò
    });

      this.listData = new MatTableDataSource(this.customers);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log(error);
    })
  }

  onRoleChange(userId: number, newRole: string) {
    this.customerService.updateRole(userId, newRole).subscribe(
      (response: any) => {
        this.toastr.success(response.message, 'Hệ thống');
        this.ngOnInit();
      },
      (error) => {
        console.error(error);
        this.toastr.error('Cập nhật vai trò thất bại!', 'Hệ thống');
      }
    );
  }
  
  

  delete(id: number, name: String) {
    Swal.fire({
      title: 'Bạn muốn xoá người dùng có tên ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.delete(id).subscribe(data => {
          this.ngOnInit();
          this.toastr.success('Thông báo xoá thành công!', 'Hệ thống');
        }, error => {
          this.toastr.error('Thông báo xoá thất bại, đã xảy ra lỗi!', 'Hệ thống');
        })
      }
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();
  }

  finish() {
    this.ngOnInit();
  }

}
