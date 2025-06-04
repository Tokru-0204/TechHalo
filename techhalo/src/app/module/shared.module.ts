import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyVietnamPipe } from '../pipes/currency-vietnam.pipe'; // Đường dẫn chính xác
import { TruncateAddressPipe } from '../pipes/TruncateAddress.pipe';

@NgModule({
  declarations: [CurrencyVietnamPipe,TruncateAddressPipe], // Khai báo Pipe ở đây
  imports: [CommonModule],
  exports: [CurrencyVietnamPipe,TruncateAddressPipe] // Xuất để các module khác có thể sử dụng
})
export class SharedModule {}
