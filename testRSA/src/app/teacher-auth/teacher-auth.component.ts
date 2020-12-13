import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ClassTeacher, EncryptionService, SchoolClass } from '../encryption.service';

@Component({
  selector: 'app-teacher-auth',
  templateUrl: './teacher-auth.component.html',
  styleUrls: ['./teacher-auth.component.css']
})
export class TeacherAuthComponent implements OnInit {
  @Input() schoolClass!: SchoolClass;
  @Output() signedInTeacher  = new EventEmitter<ClassTeacher>();

  teacher: ClassTeacher | null = null;


  constructor(private encService: EncryptionService) { }

  ngOnInit(): void {
    this.teacher = this.encService.getTeacher(this.schoolClass.classSecret)
    if (this.teacher !== null){
      const defTeacher: ClassTeacher = this.teacher;
      this.signedInTeacher.emit(defTeacher)
    }
  }

  login(password: string){
    this.encService.authenticateTeacher(this.schoolClass.classSecret, password).subscribe(teacher => {
      const t: ClassTeacher = teacher;
      this.teacher = t
      this.signedInTeacher.emit(t);
    })
  }
}
