import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassTeacher, EncryptionService, SchoolClass } from '../encryption.service';
import { EncMessage } from '../models';

@Component({
  selector: 'app-lehrer-view',
  templateUrl: './lehrer-view.component.html',
  styleUrls: ['./lehrer-view.component.css']
})
export class LehrerViewComponent implements OnInit {

  schoolClass: SchoolClass| null= null;
  teacher: ClassTeacher | null = null; // will be more sensible ot have the teacher directly here from the beginning

  messanges: EncMessage[] = Array();

  constructor(private route: ActivatedRoute, private encService: EncryptionService) { }

  ngOnInit(): void {
    const tmp_secret = this.route.snapshot.paramMap.get('secret');

    if (tmp_secret != null){
      this.encService.getClass(tmp_secret).subscribe(schoolClass => {
        this.schoolClass = schoolClass;
      });
    } 
  }

  signedIn(teacher: ClassTeacher){
    this.teacher = teacher
    this.collectMessanges()
  }


  collectMessanges(){
    if (this.teacher !== null && this.schoolClass !== null){
    this.encService.collectMessanges(this.teacher, this.schoolClass).subscribe(msgs => this.messanges = msgs)
    }
  }
}
