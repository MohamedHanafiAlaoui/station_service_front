import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './Auth';
import { ErrorService } from './error-service';
import { Api } from '../api/api';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;

  beforeEach(() => {
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['getMessage']);
    errorServiceSpy.getMessage.and.returnValue('Error occurred');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ErrorService, useValue: errorServiceSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should store token and role in localStorage on success', () => {
      const mockResponse = { token: 'fake-jwt', roles: 'ADMIN', stationId: null };

      service.login('admin', 'pass').subscribe(res => {
        expect(localStorage.getItem('token')).toBe('fake-jwt');
        expect(localStorage.getItem('role')).toBe('ROLE_ADMIN');
      });

      const req = httpMock.expectOne(Api.LOGIN);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should normalize role if not prefixed with ROLE_', () => {
      const mockResponse = { token: 'tk', roles: 'EMPLOYE', stationId: null };

      service.login('user', 'pass').subscribe();

      const req = httpMock.expectOne(Api.LOGIN);
      req.flush(mockResponse);

      expect(localStorage.getItem('role')).toBe('ROLE_EMPLOYE');
    });

    it('should store stationId in localStorage if present', () => {
      const mockResponse = { token: 'tk', roles: 'EMPLOYE', stationId: 5 };

      service.login('emp', 'pass').subscribe();

      const req = httpMock.expectOne(Api.LOGIN);
      req.flush(mockResponse);

      expect(localStorage.getItem('station_id')).toBe('5');
    });

    it('should emit updated role$ observable after login', () => {
      const mockResponse = { token: 'tk', roles: 'CLIENT', stationId: null };
      let emittedRole: string | null = null;

      service.role$.subscribe(r => (emittedRole = r));
      service.login('client', 'pass').subscribe();

      const req = httpMock.expectOne(Api.LOGIN);
      req.flush(mockResponse);

      expect(emittedRole).toBe('ROLE_CLIENT');
    });
  });

  describe('logout()', () => {
    it('should clear localStorage and emit null role$', () => {
      localStorage.setItem('token', 'tok');
      localStorage.setItem('role', 'ROLE_ADMIN');

      let emittedRole: string | null = 'initial';
      service.role$.subscribe(r => (emittedRole = r));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
      expect(emittedRole).toBeNull();
    });
  });

  describe('isLoggedIn()', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'valid-token');
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false when no token', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('getRole()', () => {
    it('should return null when no role stored', () => {
      expect(service.getRole()).toBeNull();
    });

    it('should return role as-is when already prefixed', () => {
      localStorage.setItem('role', 'ROLE_ADMIN');
      expect(service.getRole()).toBe('ROLE_ADMIN');
    });

    it('should normalize and store role if missing prefix', () => {
      localStorage.setItem('role', 'ADMIN');
      expect(service.getRole()).toBe('ROLE_ADMIN');
      expect(localStorage.getItem('role')).toBe('ROLE_ADMIN');
    });
  });

  describe('getStationId()', () => {
    it('should return parsed stationId when set', () => {
      localStorage.setItem('station_id', '3');
      expect(service.getStationId()).toBe(3);
    });

    it('should return null when not set', () => {
      expect(service.getStationId()).toBeNull();
    });
  });
});
