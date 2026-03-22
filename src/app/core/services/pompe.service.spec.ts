import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PompeService } from './pompe.service';
import { Api } from '../api/api';
import { Pompe } from '../models/pompe';

describe('PompeService', () => {
  let service: PompeService;
  let httpMock: HttpTestingController;

  const mockPompe: Pompe = {
    id: 1,
    codePompe: 'PUMP-001',
    typeCarburant: 'DIESEL' as any,
    capaciteMax: 1000,
    niveauActuel: 500,
    prixParLitre: 10,
    enService: true,
    stationId: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PompeService],
    });

    service = TestBed.inject(PompeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPompes()', () => {
    it('should return list of pompes via GET', () => {
      service.getAllPompes().subscribe(pompes => {
        expect(pompes.length).toBe(1);
        expect(pompes[0].codePompe).toBe('PUMP-001');
      });

      const req = httpMock.expectOne(Api.POMPES);
      expect(req.request.method).toBe('GET');
      req.flush([mockPompe]);
    });
  });

  describe('getPompeById()', () => {
    it('should return a single pompe by ID via GET', () => {
      service.getPompeById(1).subscribe(pompe => {
        expect(pompe.id).toBe(1);
        expect(pompe.codePompe).toBe('PUMP-001');
      });

      const req = httpMock.expectOne(`${Api.POMPES}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPompe);
    });
  });

  describe('getActivePompes()', () => {
    it('should call GET /pompes/active', () => {
      service.getActivePompes().subscribe(pompes => {
        expect(pompes).toEqual([mockPompe]);
      });

      const req = httpMock.expectOne(`${Api.POMPES}/active`);
      expect(req.request.method).toBe('GET');
      req.flush([mockPompe]);
    });
  });

  describe('getPompesByStation()', () => {
    it('should call GET /pompes/station/:id', () => {
      service.getPompesByStation(1).subscribe(pompes => {
        expect(pompes.length).toBe(1);
      });

      const req = httpMock.expectOne(`${Api.POMPES}/station/1`);
      expect(req.request.method).toBe('GET');
      req.flush([mockPompe]);
    });
  });

  describe('createPompe()', () => {
    it('should POST and return created pompe', () => {
      service.createPompe(mockPompe).subscribe(result => {
        expect(result.id).toBe(1);
      });

      const req = httpMock.expectOne(Api.POMPES);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPompe);
      req.flush(mockPompe);
    });
  });

  describe('updatePompe()', () => {
    it('should PUT and return updated pompe', () => {
      const updated = { ...mockPompe, niveauActuel: 600 };
      service.updatePompe(1, updated).subscribe(result => {
        expect(result.niveauActuel).toBe(600);
      });

      const req = httpMock.expectOne(`${Api.POMPES}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updated);
    });
  });

  describe('deletePompe()', () => {
    it('should PATCH with enService=false by default', () => {
      service.deletePompe(1).subscribe();

      const req = httpMock.expectOne(r =>
        r.url === `${Api.POMPES}/1` && r.method === 'PATCH'
      );
      expect(req.request.params.get('enService')).toBe('false');
      req.flush(null);
    });

    it('should PATCH with enService=true to reactivate', () => {
      service.deletePompe(1, true).subscribe();

      const req = httpMock.expectOne(r =>
        r.url === `${Api.POMPES}/1` && r.method === 'PATCH'
      );
      expect(req.request.params.get('enService')).toBe('true');
      req.flush(null);
    });
  });

  describe('addFuel()', () => {
    it('should PATCH with quantity param', () => {
      service.addFuel(1, 150).subscribe(result => {
        expect(result).toEqual(mockPompe);
      });

      const req = httpMock.expectOne(`${Api.POMPES}/1/add?quantity=150`);
      expect(req.request.method).toBe('PATCH');
      req.flush(mockPompe);
    });
  });

  describe('searchPompes()', () => {
    it('should GET with keyword param', () => {
      service.searchPompes('diesel').subscribe(pompes => {
        expect(pompes).toEqual([mockPompe]);
      });

      const req = httpMock.expectOne(r =>
        r.url === `${Api.POMPES}/search` && r.params.get('keyword') === 'diesel'
      );
      expect(req.request.method).toBe('GET');
      req.flush([mockPompe]);
    });
  });

  describe('countActivePompes()', () => {
    it('should GET and return number of active pompes', () => {
      service.countActivePompes().subscribe(count => {
        expect(count).toBe(5);
      });

      const req = httpMock.expectOne(`${Api.POMPES}/count/active`);
      expect(req.request.method).toBe('GET');
      req.flush(5);
    });
  });
});
