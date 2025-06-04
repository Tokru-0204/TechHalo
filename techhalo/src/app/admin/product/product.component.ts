import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../common/Product';
import { PageService } from '../../services_admin/page.service';
import { ProductService } from '../../services_admin/product.service';
import { SupplierService } from '../../services_admin/supplier.service';
import { Supplier } from 'src/app/common/Supplier';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/services_admin/session.service';
import { AuthService } from 'src/app/services_admin/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent_Admin implements OnInit {

  listData!: MatTableDataSource<Product>;
  products!: Product[];
  suppliers!: Supplier[];
  productsLength!: number;
  email!: string;
  role: string = 'Loading...';
  columns: string[] = ['image', 'productId', 'name', 'category','supplier', 'price', 'discount', 'enteredDate', 'view', 'status'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private productService: ProductService,private supplierService: SupplierService, private toastr: ToastrService, private sessionService: SessionService, private userService: AuthService) { }

  ngOnInit(): void {
     // Lấy email từ session
     this.email = this.sessionService.getUser() || 'Unknown User';

     if (this.email) {
       this.userService.getRoleByEmail(this.email).subscribe(
         role => {
           this.role = role; // Gán vai trò từ JSON trả về
           if (this.role === 'ROLE_EMPLOYEE') {
             this.columns = this.columns.filter(column => column !== 'role' && column !== 'view' && column !== 'status');
           }
         },
         error => {
           console.error('Không thể lấy vai trò:', error);
           this.role = 'Unknown Role'; // Vai trò mặc định nếu có lỗi
         }
       );
     } 
    this.pageService.setPageActive('product');
    this.getSuppliers();
    this.getAll();
    
  }
  isRoleAllowed(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.role);
  }

  // getAll() này là get các sản phẩm có status = true
  // getAll() {
  //   this.productService.getAll().subscribe(data => {
  //     this.products = data as Product[];
  //     this.listData = new MatTableDataSource(this.products);
  //     this.listData.sort = this.sort;
  //     this.listData.paginator = this.paginator;
  //   }, error => {
  //     console.log(error);
  //   })
  // }
  // Phương thức định dạng ngày giờ cho enteredDate

  getAll() {
    this.productService.getAllProduct().subscribe(data => {
        this.products = data as Product[];
        this.products.forEach(product => {
          let name = product.name.trim();
        
          // Tìm dấu '/' trong tên sản phẩm
          let firstSlashIndex = name.indexOf('/');
        
          // Nếu tìm thấy dấu '/' trong tên sản phẩm
          if (firstSlashIndex !== -1) {
            // Lấy phần trước dấu '/'
            let normalPart = name.substring(0, firstSlashIndex).trim();
        
            // Tìm dấu cách cuối cùng trong phần normalPart
            const lastSpaceIndex = normalPart.lastIndexOf(' ');
        
            // Cập nhật lại phần normalPart sau khi tìm dấu cách cuối cùng
            normalPart = name.substring(0, lastSpaceIndex).trim();
        
            // Phần styledPart là phần còn lại sau dấu cách cuối cùng
            let styledPart = name.substring(lastSpaceIndex).trim();
        
            // Cập nhật lại tên sản phẩm
            product.name = normalPart;
            product.styledPart = styledPart;
          } else {
            // Nếu không có dấu '/', chỉ có một phần normalPart
            product.name = name;
            product.styledPart = '';
          }
        
        });
        
      console.log(this.products);
      this.listData = new MatTableDataSource(this.products);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log(error);
    })
  }
  
  getSuppliers() {
    this.supplierService.getAllSup().subscribe(data => {
      this.suppliers = data as Supplier[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }

  
  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();

  }

  finish() {
    this.ngOnInit();
  }
  toggleStatus(productId: number, currentStatus: boolean) {
    const newStatus = !currentStatus; // Đổi trạng thái
    this.productService.updateStatus(productId, newStatus).subscribe({
      next: () => {
        this.toastr.success('Cập nhật trạng thái thành công!', 'Hệ thống');
        // Cập nhật trạng thái hiển thị trên giao diện
        const product = this.products.find(p => p.productId === productId);
        if (product) {
          product.status = newStatus;
        }
      },
      error: () => {
        this.toastr.error('Cập nhật trạng thái thất bại!', 'Hệ thống');
      }
    });
  }

}
