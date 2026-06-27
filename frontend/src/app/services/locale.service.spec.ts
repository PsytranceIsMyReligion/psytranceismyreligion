import { TestBed } from '@angular/core/testing';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return navigator.language if available', () => {
    spyOnProperty(navigator, 'language', 'get').and.returnValue('en-US');
    expect(service.getUsersLocale()).toEqual('en-US');
  });

  it('should return navigator.userLanguage if language is not available', () => {
    spyOnProperty(navigator, 'language', 'get').and.returnValue(undefined as any);
    const nav: any = navigator;
    nav.userLanguage = 'fr-FR';
    expect(service.getUsersLocale()).toEqual('fr-FR');
  });
});
