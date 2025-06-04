import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { Supplier } from "src/app/common/Supplier";
import { PageService } from "src/app/services_admin/page.service";
import { SupplierService } from "src/app/services_admin/supplier.service";
import Swal from "sweetalert2";


@Component({
    selector: 'app-supplier',
    templateUrl: './supplier.component.html',
    styleUrls: ['./supplier.component.css']
})

export class SupplierComponent_Admin implements OnInit {

    listData!: MatTableDataSource<Supplier>;
    suppliers!: Supplier[];
    suppliersLength!: number;
    columns: string[] = ['image','supplierId', 'name','email','phone','address', 'view', 'delete'];

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private pageService: PageService, private toastr: ToastrService, private supplierService: SupplierService) { }

    ngOnInit(): void {
        this.pageService.setPageActive('supplier');
        this.getAll();
    }

    getAll() {
        this.supplierService.getAll().subscribe(data => {
            this.suppliers = data as Supplier[];
            this.listData = new MatTableDataSource(this.suppliers);
            this.listData.sort = this.sort;
            this.listData.paginator = this.paginator;
            this.suppliersLength = this.suppliers.length;
        }, error => {
            console.log('loi' + error);
        })
    }

    finish() {
        this.ngOnInit();
    }

    delete(id: number, name: string) {
        Swal.fire({
            title: 'Bạn muốn xoá nhà cung cấp có tên ' + name + ' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                this.supplierService.delete(id).subscribe(data => {
                    this.ngOnInit();
                    this.toastr.success('Thông báo xoá thành công!', 'Hệ thống');
                }, error => {
                    this.toastr.error('Thông báo xoá thất bại!', 'Hệ thống');
                })
            }
        })
    }
    search(event: any) {
        const fValue = (event.target as HTMLInputElement).value;
        this.listData.filter = fValue.trim().toLowerCase();
    }
}
