import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

interface CompareWithDate { isLessThen?: Date; isMoreThen?: Date; }

export function compareWithDateValidator(compareWithDate: CompareWithDate): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    let isValid = true;
    if (compareWithDate.isLessThen && !(control.value < compareWithDate.isLessThen)) {
      isValid = false;
    }
    if (compareWithDate.isMoreThen && !(control.value > compareWithDate.isMoreThen)) {
      isValid = false;
    }
    return isValid ? null : { 'compareWithDate': { value: control.value } };
  };
}

@Directive({
  selector: '[appCompareWithDate]',
  providers: [{provide: NG_VALIDATORS, useExisting: CompareWithDateValidatorDirective, multi: true}]
})
export class CompareWithDateValidatorDirective implements Validator {
  /* tslint:disable-next-line */
  @Input('appCompareWithDate') compareWithDate: CompareWithDate;

  validate(control: AbstractControl): {[key: string]: any} {
    return this.compareWithDate ? compareWithDateValidator(this.compareWithDate)(control) : null;
  }
}
