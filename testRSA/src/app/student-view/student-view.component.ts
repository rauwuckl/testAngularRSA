import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService, SchoolClass } from '../encryption.service';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css']
})
export class StudentViewComponent implements OnInit {

  schoolClass!: SchoolClass;
  encryptedMessage: string='';
  hash: string='';
  // teacher: ClassTeacher | null = null;

  constructor(private route: ActivatedRoute, private encService: EncryptionService) { }

  ngOnInit(): void {
    const tmp_secret = this.route.snapshot.paramMap.get('secret');

    if (tmp_secret != null){
      this.encService.getClass(tmp_secret).subscribe(schoolClass => {
        this.schoolClass = schoolClass;
      });
    } 
  }

  encrypt(messange: string): void{
    console.log('encrypting')
    this.encryptedMessage = this.schoolClass.encrypt(messange);
    this.hash = this.schoolClass.hash(messange)
  }

  sendMessage():void {
    if (this.encryptedMessage == ""){
      console.log("No Message to send")
    }
    else{
      this.encService.sendMessage(this.encryptedMessage, this.hash, this.schoolClass.classSecret).subscribe((data:string)=>{
        console.log(`success: ${data}`)
      })
    }
  }
}
