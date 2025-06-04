import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PurchaseOrder } from '../../common/PurchaseOrder';
import { SupplierService } from '../../services_admin/supplier.service';
import { PageService } from '../../services_admin/page.service';
import Swal from 'sweetalert2';
import { PurchaseOrderService } from 'src/app/services_admin/purchase-order.service';
import { Supplier } from 'src/app/common/Supplier';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent_Admin implements OnInit {

  listData!: MatTableDataSource<PurchaseOrder>;
  purchaseOrders!: PurchaseOrder[];
  suppliers!: Supplier[];
  purchaseOrdersLength!: number;
  columns: string[] = ['supplier', 'create_at','update_at','view'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private toastr: ToastrService, private purchaseOrderService: PurchaseOrderService, private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('purchase-order');
    this.getSuppliers();
    this.getAll();
  }

  getAll() {
    this.purchaseOrderService.getAllPurchaseOrders().subscribe(data => {
      this.purchaseOrders = data as PurchaseOrder[];
      this.listData = new MatTableDataSource(this.purchaseOrders);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log('loi' + error);
    })
  }
  getSuppliers() {
    this.supplierService.getAllSup().subscribe(data => {
      this.suppliers = data as Supplier[];
    }, error => {
      console.log('loi' + error);
    })
  }

  finish() {
    this.ngOnInit();
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().toLowerCase();
  }

}
