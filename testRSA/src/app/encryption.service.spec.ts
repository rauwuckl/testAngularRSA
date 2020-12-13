import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
         HttpClientTestingModule
         ],
      providers: [
        EncryptionService
      ]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should read word list', () => {
    let testData:String = "hallo\nich\nbin"
    let testList: Array<String> = ["hallo", "ich", "bin", ]

    service.getWordList().subscribe(data =>
        expect(data).toEqual(testList)
      );

    let req = httpTestingController.expectOne('assets/deutsch.txt')
    expect(req.request.method).toEqual('GET')
    req.flush(testData)

        // Finally, assert that there are no outstanding requests.
        httpTestingController.verify();
  }
  )
  it('should create random string', () => {
    const testSTring = service.createRandomString(23);
    console.log(testSTring)

    expect(testSTring).toBeTruthy()
    expect(testSTring).not.toEqual("")

  })

  it('should create passphrase', ()=>{
    let testPassword: String = "hallo"
    let [privateKey, publicKey]= service.createKey()

    console.log(privateKey)
    console.log(publicKey)
    expect(privateKey).toBeTruthy()
    expect(publicKey).toBeTruthy()
  }
  )
});
