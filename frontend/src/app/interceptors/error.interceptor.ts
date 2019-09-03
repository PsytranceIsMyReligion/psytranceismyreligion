import { MatSnackBar } from '@angular/material';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse }   from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(public snackBar: MatSnackBar) {}
    
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
    
        return next.handle(req).pipe(
            catchError((err: any) => {
                if(err instanceof HttpErrorResponse) {
                    console.log(err)
                    try {
                        this.snackBar.open("Exception\n " + err.message,"OK");
                    } catch(e) {
                        this.snackBar.open("Exception\n " + err.message,"OK");
                    }
                    //log error 
                }
                return of(err);
            }));
    
      }
      
}