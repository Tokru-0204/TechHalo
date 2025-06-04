import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomSort'
})
export class RandomSortPipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!Array.isArray(value)) return value;
    return value.sort(() => Math.random() - 0.5);
  }
}
