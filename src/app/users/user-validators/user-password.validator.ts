import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

export function PasswordSecurityValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    // console.log(control.value, forbidden);
    return forbidden ? null : { forbiddenName: { value: control.value } };
  };
}

@Directive({
  selector: '[passwordSecurity][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordSecurityValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordSecurityValidatorDirective implements Validator {
  @Input('passwordSecurity') passwordSecurity = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.passwordSecurity
      ? PasswordSecurityValidator(new RegExp(this.passwordSecurity))(control)
      : null;
  }
}
