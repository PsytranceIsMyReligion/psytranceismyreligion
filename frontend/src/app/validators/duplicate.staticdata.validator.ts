import { AbstractControl, ValidatorFn } from "@angular/forms";
import { StaticData } from "../models/member.model";

export function notDuplicateValidator(staticData: Array<StaticData>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // console.log("checking", control.value);
    let includes = staticData
      .map((el: StaticData) => el.name.toLowerCase())
      .includes(control.value.toLowerCase());
    // debugger;
    return includes ? { duplicate: { value: control.value } } : null;
  };
}
