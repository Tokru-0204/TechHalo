import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateAddress'
})
export class TruncateAddressPipe implements PipeTransform {

  transform(value: string, limit: number = 2): string {
    if (!value) return '';

    // Split the address by commas
    const parts = value.split(',');

    // Take the last 'limit' parts of the address
    const truncatedParts = parts.slice(-limit).join(', ').trim();

    return truncatedParts;
  }

}
