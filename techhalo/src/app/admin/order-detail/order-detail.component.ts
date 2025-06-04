import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../common/Order';
import { OrderDetail } from '../../common/OrderDetail';
import { OrderService } from '../../services_admin/order.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent_Admin implements OnInit {

  orderDetails!: OrderDetail[];
  order!: Order;
  listData!: MatTableDataSource<OrderDetail>;
  orderDetailLength!: number;

  columns: string[] = ['index', 'image', 'product', 'quantity', 'price'];

  @Output()
  updateFinish: EventEmitter<any> = new EventEmitter<any>();
  @Input() orderId!: number;

  constructor(private modalService: NgbModal, private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getOrder();
    this.getDetail();
  } 
  
  getOrder() {
    this.orderService.getById(this.orderId).subscribe(data => {
      this.order = data as Order;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getDetail() {
    this.orderService.getByOrder(this.orderId).subscribe(data => {
      this.orderDetails = data as OrderDetail[];
      this.listData = new MatTableDataSource(this.orderDetails);
      this.orderDetailLength = this.orderDetails.length;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

 confirmOrder() {
  Swal.fire({
    title: 'Bạn muốn xác nhận đơn hàng này?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Không'
  }).then((result) => {
    if (result.isConfirmed) {
      this.orderService.confirmOrder(this.orderId).subscribe(() => {
        this.toastr.success('Đơn hàng đã được xác nhận!', 'Hệ thống');
        this.updateFinish.emit('done');
        this.modalService.dismissAll();
      }, error => {
        this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
      });
    }
  });
}

deliver() {
  Swal.fire({
    title: 'Bạn muốn giao đơn hàng này?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Giao hàng',
    cancelButtonText: 'Không'
  }).then((result) => {
    if (result.isConfirmed) {
      this.orderService.deliver(this.orderId).subscribe(() => {
        this.toastr.success('Đơn hàng đã được giao!', 'Hệ thống');
        this.updateFinish.emit('done');
        this.modalService.dismissAll();
      }, error => {
        this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
      });
    }
  });
}

confirmPayment() {
  Swal.fire({
    title: 'Bạn muốn xác nhận đơn hàng đã thanh toán?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Không'
  }).then((result) => {
    if (result.isConfirmed) {
      this.orderService.confirm(this.orderId).subscribe(() => {
        this.toastr.success('Xác nhận thanh toán thành công!', 'Hệ thống');
        this.updateFinish.emit('done');
        this.modalService.dismissAll();
      }, error => {
        this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
      });
    }
  });
}

delivered() {
  Swal.fire({
    title: 'Bạn muốn đánh dấu đơn hàng đã giao thành công?',
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Hoàn tất',
    cancelButtonText: 'Không'
  }).then((result) => {
    if (result.isConfirmed) {
      this.orderService.delivered(this.orderId).subscribe(() => {
        this.toastr.success('Đơn hàng đã hoàn tất!', 'Hệ thống');
        this.updateFinish.emit('done');
        this.modalService.dismissAll();
      }, error => {
        this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
      });
    }
  });
}

cancelOrder() {
  Swal.fire({
    title: 'Bạn muốn huỷ đơn hàng này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Huỷ',
    cancelButtonText: 'Không'
  }).then((result) => {
    if (result.isConfirmed) {
      this.orderService.cancel(this.orderId).subscribe(() => {
        this.toastr.success('Đơn hàng đã bị huỷ!', 'Hệ thống');
        this.updateFinish.emit('done');
        this.modalService.dismissAll();
      }, error => {
        this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
      });
    }
  });
}

}
