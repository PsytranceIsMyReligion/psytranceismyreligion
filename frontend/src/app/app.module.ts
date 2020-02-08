import { CoreModule } from "./modules/core.module";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { RouterModule, PreloadAllModules } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { JwtModule } from "@auth0/angular-jwt";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from "angularx-social-login";
import { ROUTES } from "./routes/app.routes";
import { ToastrModule } from "ngx-toastr";
import { DeviceDetectorModule } from "ngx-device-detector";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { LocaleService } from "./services/locale.service";
import { registerLocaleData } from "@angular/common";
import { Angulartics2Module } from "angulartics2";
import localeGB from "@angular/common/locales/en-GB";
import { environment } from "./../environments/environment";
import { SharedModule } from "./modules/shared.module";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import "@progress/kendo-angular-intl/locales/en";
const socketConfig: SocketIoConfig = {
  url: environment.socketUri,
  options: {
    rejectUnauthorized: false,
    transports: ["websocket"],
    reconnectionAttempts: "Infinity"
  }
};
console.log("socketConfig", socketConfig);
registerLocaleData(localeGB, "en");

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      "793868332939-fabl9ni7mpbvg900l7rrkf1tesaunal2.apps.googleusercontent.com"
    )
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("315354469236603")
  }
]);

export function provideConfig() {
  return config;
}

export function tokenGetter() {
  console.log("getting token");
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [AppComponent, NavigationComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Angulartics2Module.forRoot(),
    SocketIoModule.forRoot(socketConfig),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: "toast-top-right",
      preventDuplicates: true
    }),
    SharedModule.forRoot(),
    CoreModule,
    HttpClientModule,
    SocialLoginModule,
    DeviceDetectorModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [environment.baseUri],
        blacklistedRoutes: [environment.baseUri + "/api/auth"]
      }
    }),
    RouterModule.forRoot(ROUTES, {
      onSameUrlNavigation: "reload",
      preloadingStrategy: PreloadAllModules
    }),
    FontAwesomeModule
  ],
  providers: [
    {
      useFactory: (localeService: LocaleService) => {
        return localeService.getUsersLocale();
      },
      provide: LOCALE_ID,
      deps: [LocaleService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
