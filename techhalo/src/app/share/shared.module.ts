import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyVietnamPipe } from '../pipes/currency-vietnam.pipe';

@NgModule({
  declarations: [
    CurrencyVietnamPipe, // Khai báo pipe tại đây
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CurrencyVietnamPipe // Xuất pipe để các module khác sử dụng
  ]
})
export class SharedModule {}
