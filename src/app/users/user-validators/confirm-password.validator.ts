import { Attribute, Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[validateEqual][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EqualValidatorDirective,
      multi: true,
    },
  ],
})
export class EqualValidatorDirective implements Validator {
  @Input() validateEqual: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    const controlToCompare = control.parent.get(this.validateEqual);

    if (controlToCompare && controlToCompare.value !== control.value) {
      return { notEqual: true };
    }

    return null;
  }
}
//Roomno110b@bvb
