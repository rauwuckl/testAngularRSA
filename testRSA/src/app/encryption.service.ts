import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map , flatMap} from 'rxjs/operators';
import * as JsEncryptModule from 'jsencrypt';
import * as CrypticoModule from 'cryptico';
import * as forge from 'node-forge';
import { ClassTeacherTransport,  EncMessage,  SchoolClassTransport } from './models';


export class SchoolClass{
  constructor(
    public id: string,
    public name: string,
    public classSecret: string,
    private publicKey: forge.pki.rsa.PublicKey,
  ){};

  encrypt(message: string): string {
    const bytes = forge.util.encode64(message)
    const encrypted = this.publicKey.encrypt(bytes)

    const hex = forge.util.bytesToHex(encrypted)
    return hex
  }

  hash(message: string): string {
    const bytes =  EncryptionService.deriveSecret(message, this.classSecret)
    const hex = forge.util.bytesToHex(bytes)
    return hex
  }

  static fromTransport(transportObject: SchoolClassTransport): SchoolClass {

    const key: forge.pki.PublicKey = forge.pki.publicKeyFromPem(transportObject.publicKey)

    const sClass: SchoolClass = new SchoolClass(
      transportObject.id,
      transportObject.name, 
      transportObject.classSecret,
      key
      );

    return sClass
  }
}

export interface ClassTeacherStore{
  // classSecret: string,
  teacherSecret: string,
  privateKey: string,
}

export function impl<I>(i: I) { return i; }

export class ClassTeacher{
  constructor(
    // private classSecret: string,
    public teacherSecret: string,
    private privateKey: forge.pki.rsa.PrivateKey,
  ){};

  decrypt(messangeHex: string): string {
    const bytes = forge.util.hexToBytes(messangeHex)

    const decrypted = this.privateKey.decrypt(bytes)

    const message = forge.util.decode64(decrypted)
    return message
  }

  static fromTransport(transportObject: ClassTeacherTransport, password: string, teacherSecret: string): ClassTeacher{
    const classSecret = transportObject.classSecret

    const privateKey = forge.pki.decryptRsaPrivateKey(transportObject.private, password)

    // const teacherSecret = teacherSecret
    return new ClassTeacher( teacherSecret, privateKey)
  }

  static fromJsonString(jsonString: string): ClassTeacher{
     const teacherContract: ClassTeacherStore =  JSON.parse(jsonString)
     const privateKey: forge.pki.rsa.PrivateKey = forge.pki.privateKeyFromPem(teacherContract.privateKey)
     const teacher: ClassTeacher = new ClassTeacher(
      teacherContract.teacherSecret, 
      privateKey)
     return teacher
  }

  toJsonString(): string {
    const keypem: string = forge.pki.privateKeyToPem(this.privateKey)
    const teacherContract: ClassTeacherStore = impl<ClassTeacherStore>({
      teacherSecret: this.teacherSecret,
      privateKey: keypem})

    return JSON.stringify(teacherContract)
  }
}


@Injectable()
export class EncryptionService {

  private knownClassTeachers: Map<string, ClassTeacher> = new Map();


  constructor(private http: HttpClient) { 
    var encrpyt = JsEncryptModule.JSEncrypt()
    // var cryptico = CrypticoModule.cryptico()
  }

  createPassword(): Observable<string> {
    return this.getWordList().pipe(map( (words: Array<String>) =>
      {
        let n_words = words.length
        let n = 3;
        var filler: Uint32Array = new Uint32Array(n);
        console.log(filler)
        window.crypto.getRandomValues(filler);
        console.log(filler)

        var pw: string = ""
        var i;
        for(i=0; i <n; i++){
            let id = filler[i] % n_words
            let word = words[id]
            pw = pw + "-" + word
        }
        return pw
      }
    ))
  }

  createKey() : [forge.pki.PrivateKey, forge.pki.PublicKey]  {    
    let key = forge.pki.rsa.generateKeyPair();

    return [key.privateKey, key.publicKey]
  }

  static deriveSecret(pw: string, salt: string): string {
    let key: string = forge.pkcs5.pbkdf2(pw, salt, 2000, 16)
    return key
  }

  encryptKey(privateKey: forge.pki.PrivateKey, pw: string){
    let encryptedPem: string = forge.pki.encryptRsaPrivateKey(privateKey, pw)
    return encryptedPem
  }

  emptyFunc(){
    let salt: string = "emptySalt"

    let password = 'bla'
    let testMessange = 'bla'

    var encoded64 = forge.util.encodeUtf8(testMessange)

    let key = forge.pki.rsa.generateKeyPair(); 
    let privateKey: forge.pki.PrivateKey = key.privateKey
    let publicKey = key.publicKey


    var encrytpedMessange: string = publicKey.encrypt(encoded64)
    console.log(encrytpedMessange)


    let encryptedPem: string  = forge.pki.encryptRsaPrivateKey(privateKey, password)


    console.log(encryptedPem)

    console.log(key)

    let reconKey = forge.pki.decryptRsaPrivateKey(encryptedPem, password)

    let reconMessage64 = reconKey.decrypt(encrytpedMessange)
    let reconMessage = forge.util.decodeUtf8(reconMessage64)
    console.log(reconMessage)

    return ["test", "test"]
  }

  getWordList(): Observable<Array<String>>{
    let headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    
    return this.http.get('assets/deutsch.txt', {headers, responseType : 'text'}).pipe(map((data:String) => {
      // console.log(data);
      let lines: Array<String> = data.split("\n")
      return lines
    }));
  }

  createClassBackend(className: string, class_link: string, teacherSecret: string, encryptedPrivateKey: string, publicKey: string){
    var postData = new FormData();
    postData.append('className', className)
    postData.append('classLink', class_link)
    postData.append('teacherSecret', teacherSecret)
    postData.append('encPrivateKey', encryptedPrivateKey)
    postData.append('publicKey', publicKey)


    let req = this.http.post<SchoolClass>('http://localhost:5000/create', postData)
    return req
  }

  createRandomString(length: number): string{
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678'
    const nChars = charset.length

    var filler: Uint16Array = new Uint16Array(length);
    window.crypto.getRandomValues(filler);
    

    const pw_chars: Array<string> = Array.from(filler).map( i => charset[i%nChars]);
    const password: string = pw_chars.join("")
    return  password
  }

  getTeacher(class_secret: string): ClassTeacher | null {
    const teacherString: string | null= localStorage.getItem(class_secret)

    if (teacherString === null) {
      return null
    }
    else{
      const teacher: ClassTeacher = ClassTeacher.fromJsonString(teacherString)
      return teacher
    }
  }

  authenticateTeacher(class_secret: string, password:string){
    var postData = new FormData();

    const teacher_secret = EncryptionService.deriveSecret(password, class_secret)
    postData.append('classSecret', class_secret)
    postData.append('teacherSecret', teacher_secret)
    let privateKeyRequest = this.http.post<ClassTeacherTransport>('http://localhost:5000/getPrivateKey', postData)
    return privateKeyRequest.pipe(map( (teacherTransport: ClassTeacherTransport) => {
      const teacher: ClassTeacher = ClassTeacher.fromTransport(teacherTransport, password, teacher_secret)

      this.knownClassTeachers.set(class_secret, teacher)
      localStorage.setItem(class_secret, teacher.toJsonString())
      return teacher
    }
    ))
  }

  getClass(class_secret: string){
    let req = this.http.get<SchoolClassTransport>(`http://localhost:5000/getClass/${class_secret}`)

    return req.pipe(map(classTransport => SchoolClass.fromTransport(classTransport)))
  }


  sendMessage(message: string, hash:string, classSecret: string){
    var postData = new FormData();
    postData.append('message', message)
    postData.append('hash', hash)

    let req = this.http.post(`http://localhost:5000/sentMessage/${classSecret}`, postData, {responseType : 'text'})
    return req
  }

  collectMessanges(clsteacher: ClassTeacher, schoolClass: SchoolClass){
    var postData = new FormData();
    postData.append('teacherSecret', clsteacher.teacherSecret)
    let req = this.http.post<Array<EncMessage>>(`http://localhost:5000/collectMessages/${schoolClass.classSecret}`, postData).pipe(
      map((msgs: Array<EncMessage>)=>{
        console.log(msgs)
        return msgs.map(msg =>{
          console.log(clsteacher)
          msg.decrypted = clsteacher.decrypt(msg.encrypted)
          return msg
        })
    }))
    return req
  }

  postMessageTest(msg: EncMessage){
    let req = this.http.post('http://localhost:5000/test', msg)
    return req
  }
}
