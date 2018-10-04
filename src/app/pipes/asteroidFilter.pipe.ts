import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: true
})
export class AsteroidFilterPipe implements PipeTransform {

  transform(data: any[], id: number): any[] {
    return  id === undefined ? data : data.filter(item => item.id.includes(id));
  }
}
