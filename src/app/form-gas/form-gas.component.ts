import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { GasSensorService } from '../service/gas-sensor.service';


@Component({
  selector: 'form-gas',
  templateUrl: './form-gas.component.html',
  styleUrls: ['./form-gas.component.css']
})
export class FormGasComponent {
  form: FormGroup;
  sensors: any[] = [];
  things = [
    {name: "gas-sensor"}
  ]

  fields = [
    {stringa:"ciao"},{numero:2}, {data: "12/07/99"}
  ] 

  humidityIsChecked = false;
  thingNameIsChecked = false;
  temperatureIsChecked = false;
  resistanceIsChecked = false;

  constructor(
    fb: FormBuilder, 
    private gasSensorService: GasSensorService){
    this.form = fb.group({
      date: fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required]
      }),
      humidityCheckbox: [''],
      humidity: fb.group({
        start: [''],
        stop: ['']
      }),
      temperature: fb.group({
        start: ['', Validators.required],
        stop: ['', Validators.required]
      }),
      resistance: fb.group({
        start: ['', Validators.required],
        stop: ['', Validators.required]
      }),
      thingName: [null, Validators.required]
    });
    this.form.get('humidityCheckbox')?.valueChanges
    .subscribe(value => {
        this.form.get('humidity.start')?.setValidators(this.humidityIsChecked ? null : [Validators.required])
        this.form.get('humidity.start')?.updateValueAndValidity();
        this.form.get('humidity.stop')?.setValidators(this.humidityIsChecked ? null : [Validators.required])
        this.form.get('humidity.stop')?.updateValueAndValidity();
    });

    this.gasSensorService.getGasSensors()
      .subscribe(sensors => {
        this.sensors = sensors[0] 
        alert(JSON.stringify(this.sensors))
      });
  

  }


  scarica(){
   
    //alert(this.ISODateString(new Date(new Date(this.startDate?.value))));
   
    if (this.form.valid){
      this.gasSensorService.getGasSensors()
      .subscribe(sensors => {
        for(var i =0; i<Object.keys(sensors[0]).length; i++){
          alert(typeof sensors[0][`${Object.keys(sensors[0])[i]}`]);
        }
        this.sensors = sensors;
        
        var rows = [
          ["TIPO", "Humidity"]
        ];

      for(var i =0; i<this.sensors.length; i++){
        rows.push([this.sensors[i]._measurement, this.sensors[i]._value]);
      }
      let csvContent = "data:text/csv;charset=utf-8," 
          + rows.map(e => e.join(",")).join("\n");
  
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      document.body.appendChild(link); // Required for FF
      
      link.click(); 
      });
    }else{
      this.form.setErrors({
        invalidFormCompilation: true
      })
    }
  }
  
  get startDate(){
    return this.form.get('date.start');
  }

  get endDate(){
    return this.form.get('date.end');
  }

  get startHumidity(){
    return this.form.get('humidity.start');
  }

  get stopHumidity(){
    return this.form.get('humidity.stop');
  }
  
  get startTemperature(){
    return this.form.get('temperature.start');
  }

  get stopTemperature(){
    return this.form.get('temperature.stop');
  }

  get startResistance(){
    return this.form.get('resistance.start');
  }

  get stopResistance(){
    return this.form.get('resistance.stop');
  }

  get thingName(){
    return this.form.get('thingName');
  }

  get humidityEnd(){
    return this.form.get('humidityEnd');
  }

  ISODateString(d:Date){
    function pad(n:any){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours())+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds().toPrecision(11))+'Z'
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
    return Object.keys(f)[i];
  }
  getKeys(f:any){
    return Object.keys(f);
  }
  getValue(i:any){
    return Object.values(this.sensors)[i]
  }

 /* toggle(field: string){
    var required: boolean;
    if(field == 'humidity')
      required = this.humidityIsChecked;
    else if(field == 'temperature')
      required = this.temperatureIsChecked;
    else if(field == 'resistance')
      required = this.resistanceIsChecked;
    else if(field == 'thingName')
      required = this.thingNameIsChecked;
    
      this.form.get(`${field}.start`)?.setValidators(this.humidityIsChecked ? null : [Validators.required])
      this.form.get(`${field}.start`)?.updateValueAndValidity();
      this.form.get(`${field}.stop`)?.setValidators(this.humidityIsChecked ? null : [Validators.required])
      this.form.get(`${field}.stop`)?.updateValueAndValidity();
  }*/
  
}
