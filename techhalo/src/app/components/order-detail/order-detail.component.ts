import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../common/Order';
import { OrderDetail } from '../../common/OrderDetail';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  orderDetails!:OrderDetail[];
  check:boolean = true;
  order!:Order;

  
  @Input() id!:number;

  constructor(private modalService: NgbModal, private orderService: OrderService, private toastr: ToastrService, ) { }

  ngOnInit(): void {
    this.getOrder();
    this.getItems();
  }

  getOrder() {
    this.orderService.getById(this.id).subscribe(data=>{
      this.order = data as Order;

      
    },error=>{
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  getItems() {
    this.orderService.getByOrder(this.id).subscribe(data=>{
      this.orderDetails = data as OrderDetail[];      
      this.orderDetails.forEach(item => {
        let name = item.product.name.trim();
      
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
          item.product.name = normalPart;
          item.product.styledPart = styledPart;
        } else {
          // Nếu không có dấu '/', chỉ có một phần normalPart
          item.product.name = name;
          item.product.styledPart = '';
        }
      
      });
    },error=>{
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, {centered: true, size: 'lg'})
  }

  finish() {
    this.ngOnInit();
  }

}
