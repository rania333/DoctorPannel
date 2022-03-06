import {AbstractControl} from '@angular/forms';

export function confirmPassValidator(control: AbstractControl) {
  const pass = control.get('pass');
  const pass2 = control.get('pass2');
  if (pass?.pristine || pass2?.pristine) {
    return null ;
  } else {
    return pass && pass2 && pass.value !== pass2.value ? {'notEqual': true} : null;
  }
}
