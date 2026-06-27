import { TestBed } from '@angular/core/testing';
import { MemberService } from './member.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Socket } from 'ngx-socket-io';

describe('MemberService', () => {
  let service: MemberService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const socketMock = { on: jasmine.createSpy('on'), emit: jasmine.createSpy('emit') };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MemberService,
        { provide: Socket, useValue: socketMock }
      ]
    });

    service = TestBed.inject(MemberService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Check if there are any pending requests left and flush them
    const req = httpTestingController.match(() => true);
    req.forEach(r => r.flush([]));
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateAge', () => {
    it('should calculate age correctly for a past year', () => {
      const currentYear = new Date().getFullYear();
      const age = service.calculateAge(currentYear - 30);
      expect(age).toBe(30);
    });

    it('should return 0 when birthday is the current year', () => {
      const currentYear = new Date().getFullYear();
      const age = service.calculateAge(currentYear);
      expect(age).toBe(0);
    });

    it('should calculate age correctly for a birthday passed as a string', () => {
      const currentYear = new Date().getFullYear();
      const age = service.calculateAge((currentYear - 25).toString());
      expect(age).toBe(25);
    });

    it('should handle invalid values (null) gracefully', () => {
      const age = service.calculateAge(null);
      expect(age).toBe(0);
    });

    it('should handle invalid values (undefined) gracefully', () => {
      const age = service.calculateAge(undefined);
      expect(age).toBe(0);
    });
  });
});
