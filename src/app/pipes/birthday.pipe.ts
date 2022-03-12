import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'birthday'
})
export class BirthdayPipe implements PipeTransform {

  transform(value: any) {
    let year, month, day;
    if(value[0] ==2 ) {
      year = '19'+ value.substring(1,3)
    } else {
      year = '20' + value.substring(1,3)
    }
    month = value.substring(3,5);
    day = value.substring(5,7)
    let DOB = year + '-' + month + '-' + day;
    return DOB;
  }

}
