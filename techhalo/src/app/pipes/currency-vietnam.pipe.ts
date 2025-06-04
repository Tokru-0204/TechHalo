import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyVietnam'
})
export class CurrencyVietnamPipe implements PipeTransform {
  transform(value: number | null): string {
    if (value === null || value === undefined) return '';

    // Tách phần nghìn và phần dư
    let roundedValue = Math.floor(value / 1000); // Lấy phần nghìn
    const remainder = value % 1000; // Phần dư

    // Kiểm tra phần dư và làm tròn
    if (remainder >= 500) {
      roundedValue += 1; // Nếu dư >= 500, tăng phần nghìn
    }

    // Kết quả cuối cùng là phần nghìn nhân lại với 1000
    const finalValue = roundedValue * 1000;

    // Trả về số tiền định dạng kiểu Việt Nam (dấu chấm ngăn cách hàng nghìn)
    return finalValue.toLocaleString('vi-VN') + '₫';
  }
}
