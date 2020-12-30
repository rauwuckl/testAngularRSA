import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Entity } from 'src/app/index/index.component';
import { StudentEntity } from '../lmodels';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {
  @Input() studentEntity!: StudentEntity;
  @Output() shouldBeDeleted  = new EventEmitter<boolean>();

  editMode: boolean = false;

  formControl = new FormControl("", Validators.required);

  constructor() { }

  ngOnInit(): void {
    console.log('created edit component')
    console.log(this.studentEntity)
  }

  save(){
    if(this.editMode){
      if(this.formControl.valid){
        this.studentEntity.name = this.formControl.value;
      }
      this.editMode = false;
    }
  }

  edit(){
    if(!this.editMode){
      this.formControl.setValue(this.studentEntity.name)
      this.editMode = true;
    }
  }

  delete(){
    const shouldBeDestructed: boolean = this.studentEntity.delete();
    if(shouldBeDestructed){
      this.shouldBeDeleted.emit(true);
    }
  }

}
