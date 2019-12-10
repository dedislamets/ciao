import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the UppercasePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'uppercase',
})
export class UppercasePipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if (value === null) return 'Not assigned';
    return value.charAt(0).toUpperCase() + value.slice(1);
  
  }
}
