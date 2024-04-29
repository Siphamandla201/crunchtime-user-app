import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'distanceFilter',
    pure: false
})
export class DistanceFilterPipe implements PipeTransform {
    transform(items: any[], filter: number): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.distance < filter);
    }
}