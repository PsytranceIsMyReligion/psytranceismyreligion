import { WallResolve } from "./resolvers/wall.resolve";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MemberService } from "./services/member.service";
import { TokenService } from "./services/token.service";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { JwtModule } from "@auth0/angular-jwt";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { AuthGuard } from "./guards/auth.guard";
import { ROUTES } from "./routes/app.routes";
import { MemberListResolve } from "./resolvers/member-list.resolve";
import { RegisterResolve } from "./resolvers/register.resolve";
import { WatchResolve } from "./resolvers/watch.resolve";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { ToastrModule } from "ngx-toastr";
import { DeviceDetectorModule } from "ngx-device-detector";
import { StaticDataDialogComponent } from "./components/register/staticdata-dialog/staticdata-dialog.component";
import { PostDialogComponent } from "./components/home/wall/post-dialog/post-dialog.component";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MessageDialogComponent } from "./components/home/member-details/message-dialog/message-dialog.component";
import { LocaleService } from "./services/locale.service";
import { registerLocaleData } from "@angular/common";
import { Angulartics2Module } from "angulartics2";

import localeGB from "@angular/common/locales/en-GB";
import { environment } from "./../environments/environment";
import { SharedModule } from "./components/shared/shared.module";
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
  entryComponents: [PostDialogComponent, MessageDialogComponent],
  declarations: [AppComponent, NavigationComponent, PostDialogComponent, MessageDialogComponent],
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
    SharedModule,
    CKEditorModule,
    HttpClientModule,
    SocialLoginModule,
    AngularFontAwesomeModule,
    DeviceDetectorModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [environment.baseUri],
        blacklistedRoutes: [environment.baseUri + "/api/auth"]
      }
    }),

    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: "reload" })
  ],
  providers: [
    AuthGuard,
    MemberService,
    TokenService,
    MemberListResolve,
    RegisterResolve,
    WatchResolve,
    WallResolve,
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
