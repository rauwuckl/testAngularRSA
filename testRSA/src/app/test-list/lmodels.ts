export class StudentEntity{
    origName: string | null;
    lastName!: string;
    _name!: string;

    _deleted: boolean = false;
  
    constructor(public id: number,  tname: string, public teacherAdded: boolean){
        
      this.origName = teacherAdded ? null : tname;
      this.name = tname;
    }
  
    get changed():boolean{ 
        if(this.teacherAdded){
            return false
        }
        else{
            return this.origName !== this.name
        }
    }
  
    get name() {
      return this._name;
    }

    get deleted(): boolean{
        return this._deleted
    }

    delete(): boolean{
        /// returns true if this object should be destructed
        this.name = this.origName ? this.origName : "wtf?";
        this._deleted = true;

        if(this.teacherAdded){
            return true;
        }
        else{
            return false
        }
    }
  
    set name(_name: string){
      this._name = _name;
      this.lastName = _name.split(" ").slice(-1)[0];
    } 
  }