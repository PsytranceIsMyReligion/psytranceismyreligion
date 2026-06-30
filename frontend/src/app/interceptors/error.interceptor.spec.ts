import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ErrorInterceptor } from './error.interceptor';
import { throwError, Observable } from 'rxjs';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ToastrService, useValue: spy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    const interceptor = interceptors.find(i => i instanceof ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should pass through successful requests without calling toastrService', () => {
    httpClient.get('/test').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/test');
    req.flush({ data: 'test' });

    expect(toastrServiceSpy.error).not.toHaveBeenCalled();
  });

  it('should catch HttpErrorResponse, call toastrService.error, and return the error via of()', () => {
    httpClient.get('/test').subscribe({
      next: (res: any) => {
        expect(res instanceof HttpErrorResponse).toBe(true);
        expect(toastrServiceSpy.error).toHaveBeenCalled();
        const expectedMessage = "Exception\n Http failure response for /test: 500 Internal Server Error";
        expect(toastrServiceSpy.error).toHaveBeenCalledWith(expectedMessage, 'Error');
      },
      error: () => {
        fail('Should not throw error because interceptor returns of(err)');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Failed', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle exception thrown by toastrService.error in try block', () => {
    let callCount = 0;
    toastrServiceSpy.error.and.callFake(() => {
      callCount++;
      if (callCount === 1) {
        throw new Error('Toastr exception');
      }
      return null as any;
    });

    httpClient.get('/test').subscribe({
      next: (res: any) => {
        expect(res instanceof HttpErrorResponse).toBe(true);
        expect(toastrServiceSpy.error).toHaveBeenCalledTimes(2);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Failed', { status: 404, statusText: 'Not Found' });
  });

  it('should not call toastrService.error if error is not HttpErrorResponse', () => {
    const interceptor = new ErrorInterceptor(toastrServiceSpy as any);
    const req = new HttpRequest('GET', '/test');

    const mockHandler: HttpHandler = {
      handle: () => throwError(new Error('Normal error')) as Observable<HttpEvent<any>>
    };

    interceptor.intercept(req, mockHandler).subscribe({
      next: (res: any) => {
        expect(res instanceof Error).toBe(true);
        expect(res.message).toBe('Normal error');
        expect(toastrServiceSpy.error).not.toHaveBeenCalled();
      }
    });
  });
});