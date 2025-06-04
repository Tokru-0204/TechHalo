import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PromotionCode } from '../../common/promotions';
import { PromotionCodeService } from '../../services_admin/promotion-code.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPromotionProductsComponent_Admin } from '../../admin/add-promotion-products/add-promotion-products.component';
import { AddPromotionUsersComponent_Admin } from '../add-promotion-users/add-promotion-users.component';

@Component({
  selector: 'app-promotion-code',
  templateUrl: './promotion-code.component.html',
  styleUrls: ['./promotion-code.component.css']
})
export class PromotionCodeComponent_Admin implements OnInit {
  listData!: MatTableDataSource<PromotionCode>;
  promotionCodes!: PromotionCode[];
  promotionCodesLength!: number;
  columns: string[] = ['code', 'discount', 'startDate', 'endDate', 'minOrderValue', 'maxUses', 'currentUses', 'applyproducts','applyToUsers', 'deactivate', 'view' ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private promotionCodeService: PromotionCodeService, private toastr: ToastrService,private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getAllActive();
  }
  // Chỉ lấy các mã khuyến mãi đang hoạt động
  getAllActive() {
    this.promotionCodeService.getAllActive().subscribe(data => {
      this.promotionCodes = data;
      this.listData = new MatTableDataSource(this.promotionCodes);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log(error);
    });
  }

  // Ngừng kích hoạt mã khuyến mãi
  deactivate(id: number, code: string) {
    Swal.fire({
      title: 'Bạn có muốn ngừng kích hoạt mã khuyến mãi ' + code + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ngừng kích hoạt',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.promotionCodeService.deactivate(id).subscribe(data => {
          this.getAllActive(); // Tải lại danh sách sau khi cập nhật
          this.toastr.success('Mã khuyến mãi đã được ngừng kích hoạt!', 'Hệ thống');
        }, error => {
          this.toastr.error('Ngừng kích hoạt thất bại!', 'Hệ thống');
        });
      }
    });
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().toLowerCase();
  }

  finish() {
    this.getAllActive();
  }

  openApplyProducts(promotionCodeId: number) {
    const modalRef = this.modalService.open(AddPromotionProductsComponent_Admin, { centered: true, size: 'lg' });
    modalRef.componentInstance.promotionCodeId = promotionCodeId;
    
    modalRef.componentInstance.saveFinish.subscribe(() => {
      this.finish(); // Refresh the table or perform any action needed
    });
  }
  openApplyUsers(promotionCodeId: number) {
    const modalRef = this.modalService.open(AddPromotionUsersComponent_Admin, { centered: true, size: 'lg' });
    modalRef.componentInstance.promotionCodeId = promotionCodeId;
    
    modalRef.componentInstance.saveFinish.subscribe(() => {
      this.finish(); // Refresh the table after applying the promotion
    });
  }
  
  
}
