import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { Routes, RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllProductComponent } from './components/all-product/all-product.component';
import { ByCategoryComponent } from './components/by-category/by-category.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileHistoryComponent } from './components/profile-history/profile-history.component';
import { RateComponent } from './components/rate/rate.component';
import { SearchComponent } from './components/search/search.component';
import { SignFormComponent } from './components/sign-form/sign-form.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthGuard } from './guard/auth.guard';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPayPalModule } from 'ngx-paypal';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ApplyPromotionCartComponent } from './components/apply-promotion-cart/apply-promotion-cart.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableExporterModule } from 'mat-table-exporter';
// import { CurrencyVietnamPipe } from './pipes/currency-vietnam.pipe';
import { RandomSortPipe } from './pipes/random-sort.pipe';
import { SharedModule } from './module/shared.module';
import { PurchaseOrderDetailComponent_Admin } from './admin/purchase-order-detail/purchase-order-detail.component';

const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'all-product', component: AllProductComponent },
  { path: 'by-category/:id', component: ByCategoryComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'search/:keyword', component: SearchComponent },
  { path: 'search', component: AllProductComponent },
  { path: 'favorites', component: FavoriteComponent, canActivate: [AuthGuard] },
  { path: 'sign-form', component: SignFormComponent },
  { path: 'about', component: AboutComponent },
  { path: 'promotions', component: PromotionsComponent }, 
  // { path: 'edit-profile/:userId', component: EditProfileComponent },
  { path: 'profile-history', component: ProfileHistoryComponent, canActivate: [AuthGuard] },
  { path: 'by-category/:categoryName', component: ByCategoryComponent },  
  { path: 'product-detail/:categoryName/:productName', component: ProductDetailComponent }, 
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'purchase-order-details/:id', component: PurchaseOrderDetailComponent_Admin },
  { path: '**', component: NotFoundComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },


]

@NgModule({
  declarations: [
    RandomSortPipe,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    AllProductComponent,
    ByCategoryComponent,
    CartComponent,
    CheckoutComponent,
    NotFoundComponent,
    OrderDetailComponent,
    ProductDetailComponent,
    ProfileComponent,
    RateComponent,
    SearchComponent,
    SignFormComponent,
    ForgotPasswordComponent,
    FavoriteComponent,
    ContactComponent,
    AboutComponent, 
    PromotionsComponent,
    EditProfileComponent,
    ApplyPromotionCartComponent,
    ProfileHistoryComponent,
    
  ],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    OrderModule,
    NgxPayPalModule,
    RouterModule.forRoot(routes, { enableTracing: true }),
    NgbModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableExporterModule,
    //  NgModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      // progressBar: true,
      progressAnimation: 'increasing',
      // preventDuplicates: true,
      closeButton: true,
      // newestOnTop: false,
    }),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
