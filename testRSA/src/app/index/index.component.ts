import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export class Entity{
  origName: string;
  lastName!: string;
  _name!: string;

  constructor(public id: number,  tname: string){
    this.origName = tname;
    this.name = tname;
  }

  get changed():boolean{ 
    return this.origName !== this.name
  }

  get name() {
    return this._name;
  }

  set name(_name: string){
    this._name = _name;
    this.lastName = _name.split(" ").slice(-1)[0];
  } 
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  currentlyEditedId: number| null = null;

  currentId: number = -1;

  entities = [
    new Entity(0, "Netanel Basal"),
    new Entity(1, "John Due"),
    new Entity(2, "Gilip Phaser"),
    new Entity(3, "Maria Magdalena"),
  ]

  controls!: FormArray;
  // entityId2FormId: Map<number, number> = new Map();

  newStudentControl = new FormControl("");
  
  constructor() { }

  ngOnInit() {
    this.setControls(this.entities);
  }

  setControls(entities: Array<Entity>){
    const toGroups = this.entities.map((entity, i) => {
      // this.entityId2FormId.set(entity.id, i);
      return new FormControl(entity.name, Validators.required)
    });
    this.controls = new FormArray(toGroups);
  }

  getControl(entityId: number) : FormControl {
    // const formId:number = this.entityId2FormId.get(entityId)!;

    return this.controls.at(entityId) as FormControl;
  }

  edit(entityId: number){
    console.log(`edit(${entityId})`)
    this.currentlyEditedId = entityId;
  }

  save(entityId: number){
    // const formId: number = this.entityId2FormId.get(entityId)!;
    this.entities[entityId]['name'] = this.getControl(entityId).value;
    this.currentlyEditedId = null;
  }

  add(){
    const studentName = this.newStudentControl.value;

    const entity = new Entity(this.currentId, studentName);
    this.currentId -= 1;

    this.entities.push(entity);
    this.setControls(this.entities);

    this.newStudentControl.setValue("");
  }


}
