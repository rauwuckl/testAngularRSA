import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StudentEntity } from './lmodels';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {

  entities = [
    new StudentEntity(0, "Netanel Basal", false),
    new StudentEntity(1, "John Due", false),
    new StudentEntity(2, "Gilip Phaser", false),
    new StudentEntity(3, "Maria Magdalena", false),
  ]

  newStudentControl = new FormControl("");
  currentId = -1;

  constructor() { }

  ngOnInit(): void {
  }

  check(){
    console.log(this.entities)
  }

  add(){
    const studentName = this.newStudentControl.value;

    const entity = new StudentEntity(this.currentId, studentName, true);
    this.currentId -= 1;

    this.entities.push(entity);

    this.newStudentControl.setValue("");
  }

  delete(i: number){
    this.entities.splice(i, 1)
  }

}
