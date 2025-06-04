import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PurchaseOrderDetail } from '../../common/PurchaseOrderDetail';
import { PurchaseOrderDetailsService } from '../../services_admin/purchase-order-detail.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.css'],
})
export class PurchaseOrderDetailComponent_Admin implements OnInit {
  listData!: MatTableDataSource<PurchaseOrderDetail>;
  purchaseOrderDetails: PurchaseOrderDetail[] = [];
  purchaseOrderDetailsLength: number = 0;
  purchaseOrders: any[] = []; // Assuming this is an empty array or could be used for other purposes
  
  @Input() selectedSupplierId!: number; 
  @Output() editFinish = new EventEmitter<void>();
  
  columns: string[] = ['image', 'productName', 'update_at', 'quantity', 'price'];

  groupedData: { [key: string]: PurchaseOrderDetail[] } = {}; // Dữ liệu nhóm theo ngày
  groupedDates: string[] = []; // Danh sách các ngày (key của groupedData)

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private purchaseOrderDetailsService: PurchaseOrderDetailsService
  ) {}

  ngOnInit(): void {
    if (this.selectedSupplierId) {
      this.getAllDetails(this.selectedSupplierId);
    }
  }

  getAllDetails(supplierId: number): void {
    this.selectedSupplierId = supplierId; // Cập nhật supplierId được chọn
    this.purchaseOrderDetailsService.getAllBySuplierId(supplierId).subscribe(
      (data: PurchaseOrderDetail[]) => {
        // Sắp xếp danh sách theo ngày nhập (mới nhất lên trên)
        this.purchaseOrderDetails = data.sort((a, b) => {
          const dateA = new Date(a.createAt_purchaseOrderDetail);
          const dateB = new Date(b.createAt_purchaseOrderDetail);
          return dateB.getTime() - dateA.getTime(); // Ngày mới nhất lên đầu
        });

        // Nhóm dữ liệu theo ngày
        this.groupedData = this.groupByDate(this.purchaseOrderDetails);

        // Lấy danh sách các ngày từ groupedData (key của groupedData)
        this.groupedDates = Object.keys(this.groupedData);
      },
      (error) => {
        this.toastr.error('Lỗi khi tải dữ liệu chi tiết đơn hàng nhập!', 'Hệ thống');
        console.error(error);
      }
    );
  }

  // Hàm nhóm dữ liệu theo ngày nhập
  groupByDate(details: PurchaseOrderDetail[]): { [key: string]: PurchaseOrderDetail[] } {
    return details.reduce((grouped, detail) => {
      const date = new Date(detail.createAt_purchaseOrderDetail).toLocaleDateString('vi-VN'); // Chuyển sang định dạng dd/MM/yyyy
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(detail);
      return grouped;
    }, {} as { [key: string]: PurchaseOrderDetail[] });
  }

  // Làm mới danh sách sau khi chỉnh sửa hoặc thêm mới
  refresh(): void {
    if (this.selectedSupplierId) {
      this.getAllDetails(this.selectedSupplierId);
    }
  }

  // Tìm kiếm trong danh sách
  search(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.listData) {
      this.listData.filter = filterValue.trim().toLowerCase();
    }
  }

  // Mở modal hiển thị chi tiết
  open(content: TemplateRef<any>): void {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  finishEditing(): void {
    // Gửi sự kiện hoàn tất về component cha
    this.editFinish.emit();
  }
}
