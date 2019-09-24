import { AbstractControl, ValidatorFn } from "@angular/forms";
import { StaticData, Member } from "../models/member.model";

export function uniqueUsername(members: Array<Member>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let includes = members
      .map((el: Member) => el.uname.toLowerCase())
      .includes(control.value.toLowerCase());
    return includes ? { duplicate: { value: control.value } } : null;
  };
}
