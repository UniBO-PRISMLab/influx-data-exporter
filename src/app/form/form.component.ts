import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GasSensorService } from '../service/gas-sensor.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
    isChec=false;
    form: FormGroup;
    fields: any[] = [];
    checked: any[] = [];
    values: any[] = [];
   
  
    constructor(
      fb: FormBuilder, 
      private gasSensorService: GasSensorService){
      this.form = fb.group({
        inputFields : fb.array([])
      });
      
  
      this.gasSensorService.getGasSensors()
      .subscribe(data => {
        
        this.fields = Object.keys(data[0]);
        this.values =Object.values(data[0]);
        var valueOfField= Object.values(data[0])[6];
        this.fields = this.fields.filter(field => this.fields.indexOf(field) > 6 && field != 'host');
        this.values = this.values.filter(value => this.values.indexOf(value) > 4 && this.values.indexOf(value) != 6  && this.values.indexOf(value) != 8 );
        var val =  this.values.splice(0,1);
        
        this.values.splice(1,0,val);
      
        this.fields.splice(1,0,valueOfField);

       
        for(var i =0; i < this.fields.length; i++){
          const key= this.fields[i];
          this.checked.push(false);
          this.form.addControl(key, fb.control(['']));
        }
     
      });
  
    }

change(i:number){
  let currentValues = this.values[i];
  if(this.checked[i]){
    this.removeField(currentValues);
  }else{
    this.addField(currentValues)
  }
 
  this.checked[i] = !this.checked[i]
}

addField(type:string){
  this.form.addControl(type, new FormControl('', Validators.required))
 
}

removeField(f: string){
  this.form.removeControl(f)
}

get inputFields(){
  return (this.form.get('inputFields') as FormArray);
}

isNumber(val:any): boolean { var n= parseInt(val) ; if(n) return true 
  else return false;}
isString(val:any): boolean { return typeof val === 'string'; }
isDate(val:any) {
  if(typeof val == "string" && (val.indexOf("/") >= 0 || val.indexOf("-") >= 0 || val.indexOf(" ") >= 0)){
    return new Date(val) instanceof Date && !isNaN(new Date(val).valueOf()) 
  }
  return false;
}

getKey(f:any, i:any){
  return this.fields[i]
}
getKeys(f:any){
  return this.fields
}
getValue(i:any){
  return this.values[i]
}


}
