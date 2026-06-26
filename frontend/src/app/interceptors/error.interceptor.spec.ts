import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
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

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should catch HttpErrorResponse and show a toastr error', () => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe((response) => {
      // The interceptor returns of(err), so it resolves successfully
      expect(response instanceof HttpErrorResponse).toBe(true);
    });

    const req = httpMock.expectOne(testUrl);

    // Simulate an error
    req.flush('Error content', { status: 500, statusText: 'Internal Server Error' });

    expect(toastrServiceSpy.error).toHaveBeenCalled();
    const args = toastrServiceSpy.error.calls.mostRecent().args;
    expect(args[0]).toContain('Exception');
    expect(args[1]).toBe('Error');
  });

  it('should fall back to calling toastrService.error again if the first call throws an error', () => {
    const testUrl = '/test';

    let callCount = 0;
    toastrServiceSpy.error.and.callFake((msg: string, title?: string) => {
      if (callCount === 0) {
        callCount++;
        throw new Error('Toastr failed');
      }
      return undefined as any;
    });

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    req.flush('Error content', { status: 400, statusText: 'Bad Request' });

    expect(toastrServiceSpy.error).toHaveBeenCalledTimes(2);
  });

  it('should not show toastr for non-HttpErrorResponses', () => {
    const interceptor = new ErrorInterceptor(toastrServiceSpy as any);
    const mockReq = {} as any;
    const mockNext = {
      handle: () => throwError(new Error('Simple Error'))
    } as any;

    interceptor.intercept(mockReq, mockNext).subscribe((response) => {
      expect(response instanceof Error).toBe(true);
    });

    expect(toastrServiceSpy.error).not.toHaveBeenCalled();
  });
});
