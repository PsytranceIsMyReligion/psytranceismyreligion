import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocaleService {
  constructor() {}

  getUsersLocale(): string {
    return navigator.language || navigator['userLanguage']; 
  }
}
