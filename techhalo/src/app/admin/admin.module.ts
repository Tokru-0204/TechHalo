import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent_Admin } from './header/header.component';
import { FooterComponent_Admin } from './footer/footer.component';
import { DashboardComponent_Admin } from './dashboard/dashboard.component';
import { SidebarComponent_Admin } from './sidebar/sidebar.component';
import { CategoryComponent_Admin } from './category/category.component';
import { ProductComponent_Admin } from './product/product.component';
import { RateComponent_Admin } from './rate/rate.component';
import { OrderComponent_Admin } from './order/order.component';
import { OrderDetailComponent_Admin } from './order-detail/order-detail.component';
import { CustomerComponent_Admin } from './customer/customer.component';
import { InventoryComponent_Admin } from './inventory/inventory.component';
import { AddCategoryComponent_Admin } from './add-category/add-category.component';
import { EditCategoryComponent_Admin } from './edit-category/edit-category.component';
import { ProfileComponent_Admin } from './profile/profile.component';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableExporterModule } from 'mat-table-exporter';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from '../guard/auth.guard';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddProductComponent_Admin } from './add-product/add-product.component';
import { AddCustomerComponent_Admin } from './add-customer/add-customer.component';
import { EditProductComponent_Admin } from './edit-product/edit-product.component';
import { EditCustomerComponent_Admin } from './edit-customer/edit-customer.component';
import { StatisticalCategoryComponent_Admin } from './statistical-category/statistical-category.component';
import { SoldestComponent_Admin } from './soldest/soldest.component';



import { PromotionCodeComponent_Admin } from './promotion-code/promotion-code.component'; 
import { AddPromotionCodeComponent_Admin } from './add-promotion-code/add-promotion-code.component'; 
import { EditPromotionCodeComponent_Admin } from './edit-promotion-code/edit-promotion-code.component'; 
import { AddPromotionProductsComponent_Admin } from './add-promotion-products/add-promotion-products.component';
import { AddPromotionUsersComponent_Admin } from './add-promotion-users/add-promotion-users.component';
import { SharedModule } from '../module/shared.module';
import { SupplierComponent_Admin } from './supplier/supplier.component';
import { AddSupplierComponent_Admin } from './add-supplier/add-supplier.component';
import { EditSupplierComponent_Admin } from './edit-supplier/edit-supplier.component';
import { PurchaseOrderComponent_Admin } from './purchase-order/purchase-order.component';
import { AddPurchaseOrderComponent_Admin } from './add-purchase-order/add-purchase-order.component';
import { PurchaseOrderDetailComponent_Admin } from './purchase-order-detail/purchase-order-detail.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] },  // Admin và Employee đều có thể vào
    children : [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      
      // Admin có thể truy cập tất cả
      { path: 'dashboard', component: DashboardComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] } },
      { path: 'product', component: ProductComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] } },
      { path: 'customer', component: CustomerComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] } },
      { path: 'order', component: OrderComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] } },
      { path: 'rate', component: RateComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] } },
      { path: 'inventory', component: InventoryComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'statistical-category', component: StatisticalCategoryComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'soldest', component: SoldestComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
      // Các tuyến đường chỉ dành cho Admin
      { path: 'category', component: CategoryComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'promotion', component: PromotionCodeComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] }  }, 
      { path:'supplier', component: SupplierComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path:'purchase-order', component: PurchaseOrderComponent_Admin, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } }
    ]
  }
];




@NgModule({
  declarations: [
    AdminComponent,
    HeaderComponent_Admin,
    FooterComponent_Admin,
    DashboardComponent_Admin,
    SidebarComponent_Admin,
    CategoryComponent_Admin,
    ProductComponent_Admin,
    RateComponent_Admin,
    OrderComponent_Admin,
    OrderDetailComponent_Admin,
    CustomerComponent_Admin,
    InventoryComponent_Admin,
    AddCategoryComponent_Admin,
    EditCategoryComponent_Admin,
    ProfileComponent_Admin,
    AddProductComponent_Admin,
    AddCustomerComponent_Admin,
    EditProductComponent_Admin,
    EditCustomerComponent_Admin,
    StatisticalCategoryComponent_Admin,
    SoldestComponent_Admin,
    PromotionCodeComponent_Admin,
    AddPromotionCodeComponent_Admin,
    EditPromotionCodeComponent_Admin,
    AddPromotionProductsComponent_Admin,
    AddPromotionUsersComponent_Admin,
    SupplierComponent_Admin,
    AddSupplierComponent_Admin,
    EditSupplierComponent_Admin,
    PurchaseOrderComponent_Admin,
    AddPurchaseOrderComponent_Admin,
    PurchaseOrderDetailComponent_Admin
  ],
  imports: [
    MatTooltipModule,  // Add MatTooltipModule here
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule.forChild(routes),
    OrderModule,
    NgxPaginationModule,
    MatTableExporterModule,
    MatPaginatorModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      // progressBar: true,
      progressAnimation: 'increasing',
      // preventDuplicates: true,
      closeButton: true,
    }),
   

    // RouterModule.forRoot(routes)
  ],
  providers:[AuthGuard],
})
export class AdminModule { }
