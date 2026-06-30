import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '@progress/kendo-angular-conversational-ui';
import { environment } from '../../environments/environment';

describe('TokenService', () => {
  let service: TokenService;
  let httpMock: HttpTestingController;
  let jwtHelperStub: Partial<JwtHelperService>;

  beforeEach(() => {
    jwtHelperStub = {
      isTokenExpired: () => false
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TokenService,
        { provide: JwtHelperService, useValue: jwtHelperStub }
      ]
    });

    service = TestBed.inject(TokenService);
    httpMock = TestBed.inject(HttpTestingController);

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should post to auth endpoint and set token in localStorage', () => {
      const mockUser: User = { id: '123', name: 'Test User' };
      const mockResponse = { token: 'mock-token' };

      service.login(mockUser).subscribe(result => {
        expect(result).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'mock-token');
      });

      const req = httpMock.expectOne(`${environment.baseUri}/auth`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ id: '123', name: 'Test User' });
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      service.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
    });
  });

  describe('isTokenExpired', () => {
    it('should call jwtHelper.isTokenExpired', () => {
      const spy = spyOn(jwtHelperStub, 'isTokenExpired').and.returnValue(true);
      const result = service.isTokenExpired();
      expect(spy).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('loggedIn', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('access_token', 'exists');
      expect(service.loggedIn).toBe(true);
    });

    it('should return false if token does not exist', () => {
      localStorage.removeItem('access_token');
      expect(service.loggedIn).toBe(false);
    });
  });
});
