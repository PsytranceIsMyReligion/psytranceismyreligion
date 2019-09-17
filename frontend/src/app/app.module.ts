import { AuthInterceptor } from './interceptors/auth.interceptor';
import { environment } from "./../environments/environment";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ListComponent } from "./components/list/list.component";
import { QuillModule } from "ngx-quill";
import {
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatDividerModule,
  MatAutocompleteModule,
  MatSidenavModule,
  MatListModule,
  MatStepperModule,
  MatDatepickerModule,
  MatRadioModule,
  MatChipsModule,
  MatExpansionModule
} from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { ReactiveFormsModule } from "@angular/forms";
import { MemberService } from "./services/member.service";
import { TokenService } from "./services/token.service";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { JwtModule } from "@auth0/angular-jwt";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from "angularx-social-login";
import { WindowModule } from "@progress/kendo-angular-dialog";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { LandingComponent } from "./components/landing/landing.component";
import { AuthGuard } from "./guards/auth.guard";
import { LandingGuard } from "./guards/landing.guard";
import { ROUTES } from "./routes/app.routes";
import { RegisterComponent } from "./components/register/register.component";
import { MapComponent } from "./components/map/map.component";
import { WatchComponent } from "./components/watch/watch.component";
import { LearnComponent } from "./components/learn/learn.component";
import { RecruitComponent } from "./components/recruit/recruit.component";
import { MemberListResolve } from "./resolvers/member-list.resolve";
import { RegisterResolve } from "./resolvers/register.resolve";
import { WatchResolve } from "./resolvers/watch.resolve";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { FormsModule } from "@angular/forms";
import { SanitizeHtmlPipe } from "./pipes/sanitize-html.pipe";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { MatDialogModule } from "@angular/material";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { VideoUploadComponent } from "./components/watch/upload/video-upload.component";
import { ToastrModule } from "ngx-toastr";
import { DeviceDetectorModule } from "ngx-device-detector";
import { MemberDetailsComponent } from "./components/list/member-details/member-details.component";
import { MemberSelectorComponent } from "./components/list/member-selector/member-selector.component";
import { NgxYoutubePlayerModule } from "ngx-youtube-player";
import { StatsComponent } from "./components/stats/stats.component";
import { ArtistDialogComponent } from "./components/register/artist-dialog/artist-dialog.component";
import { ChartModule } from "@progress/kendo-angular-charts";
import { ChatComponent } from "./components/chat/chat.component";
import { ChatModule } from "@progress/kendo-angular-conversational-ui";
import { WallComponent } from "./components/wall/wall.component";
import { PostDialogComponent } from "./components/wall/post-dialog/post-dialog.component";
import { EventsComponent } from "./components/events/events.component";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AvatarDialogComponent } from './components/register/avatar-dialog/avatar-dialog.component';
import { UploadModule } from '@progress/kendo-angular-upload';




const env = environment;
const socketConfig: SocketIoConfig = { url: env.baseUri, options: {} };

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
  console.log("getting token")
  return localStorage.getItem("access_token");
}

@NgModule({
  entryComponents: [
    VideoUploadComponent,
    ArtistDialogComponent,
    PostDialogComponent,
    AvatarDialogComponent
  ],
  declarations: [
    AppComponent,
    ListComponent,
    NavigationComponent,
    LandingComponent,
    RegisterComponent,
    MapComponent,
    WatchComponent,
    LearnComponent,
    RecruitComponent,
    SanitizeHtmlPipe,
    VideoUploadComponent,
    MemberDetailsComponent,
    MemberSelectorComponent,
    StatsComponent,
    ArtistDialogComponent,
    ChatComponent,
    WallComponent,
    PostDialogComponent,
    EventsComponent,
    AvatarDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(socketConfig),
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ["clean"], // remove formatting button
          ["link", "image", "video"] // link and image, video
        ]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: "toast-top-right",
      preventDuplicates: true
    }),
    UploadModule,
    ChartModule,
    FormsModule,
    ChatModule,
    HttpClientModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatListModule,
    SocialLoginModule,
    MatStepperModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    FlexLayoutModule,
    DropDownsModule,
    WindowModule,
    AngularFontAwesomeModule,
    ButtonsModule,
    MatMomentDateModule,
    DeviceDetectorModule.forRoot(),
    NgxYoutubePlayerModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [env.baseUri],
        blacklistedRoutes: [env.baseUri + "/api/auth"]
      }
    }),
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: "reload" })
  ],

  providers: [
    AuthGuard,
    LandingGuard,
    MemberService,
    TokenService,
    MemberListResolve,
    RegisterResolve,
    WatchResolve,
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
