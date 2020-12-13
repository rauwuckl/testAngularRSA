import { Component, OnInit } from '@angular/core';
import { flatMap, map } from 'rxjs/operators';
import { EncryptionService } from '../encryption.service';
import * as forge from 'node-forge';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent implements OnInit {

  password: string = ''; 
  publicKey: string = '';
  class_link: string = '';
  constructor(private enryptionService: EncryptionService) { }

  ngOnInit(): void {
    // this.enryptionService.createPassword().subscribe(pw => {
    //   this.password = pw
    // })
  }

  createClass(classname: string): void {
    var gpw: string;

    var private_key;
    var public_key;
    var publicKeyPem: string;
    var teacherSecret: string;
    let class_link: string; 

    this.enryptionService.createPassword().pipe(flatMap(pw => {
      // this.password = pw
      gpw = pw;

      class_link = this.enryptionService.createRandomString(23);

      [private_key, public_key] = this.enryptionService.createKey()
      console.log(class_link)

      teacherSecret = EncryptionService.deriveSecret(pw, class_link)
      console.log(teacherSecret)

      let encryptedPrivateKey =  this.enryptionService.encryptKey(private_key, pw)
      // create keypair
      // create secret
      // send things


      publicKeyPem = forge.pki.publicKeyToPem(public_key)
      return this.enryptionService.createClassBackend(classname, class_link, teacherSecret, encryptedPrivateKey, publicKeyPem)
    })).subscribe(data => {
        console.log(data)

        this.password = gpw;
        this.publicKey = publicKeyPem;
        this.class_link = data.classSecret
    }); 
  }

  // setKey(): void{
  //   let [privateKey, publicKey] = this.enryptionService.createKey(this.password)
  //   console.log(publicKey)
  //   this.publicKey = publicKey
  // }
}
 