import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { LOCALE_ID } from "@angular/core";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import "@angular/compiler";
console.log("is prod", environment.production);
console.log("baseUrl is ", environment.baseUri);
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {})
  .catch(err => console.log(err));
