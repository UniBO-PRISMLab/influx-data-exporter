import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GasSensorService } from '../service/gas-sensor.service';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent  {
  oscura = true;
  measurements: any[] = [];
  fields: any[] = [];
  checked: any[] = [];
  values: any[] = [];
  _value: string = "";
  thingName: any[] = [];
  buckets: any[] = []

    constructor(
      private gasSensorService: GasSensorService,
      private authService: AuthService,
      private dataService: DataService){
    
      this.dataService.getBuckets()
      .subscribe( buckets => { 
        
        for( var i = 0; i < buckets.length; i++){
          if(buckets[i].type != 'system'){
            this.buckets.push(buckets[i])
          }
        }
      })
  
    }

    isNumber(val:any): boolean { var n= parseFloat(val) ; if(n) return true 
      else return false;}
    isString(val:any): boolean { return typeof val === 'string'; }
    isDate(val:any) {
      if(typeof val == "string" && (val.indexOf("/") >= 0 || val.indexOf("-") >= 0 || val.indexOf(" ") >= 0)){
        return new Date(val) instanceof Date && !isNaN(new Date(val).valueOf()) 
      }
      return false;
    }

    isBoolean(val:any){
      return typeof val == "boolean"
    }

    getKey(f:any, i:any){
      return this.fields[i]
    }
    getKeys(f:any){
      return this.fields
    }
    getValue(i:any){
     console.log(this.values[i])
      return this.values[i]
    }

    submit(query:any){
    
      var keys= (Object.keys(query))
      var formati = {
        csv : query["checkbox_csv"],
        json : query["checkbox_json"]
      }
      
      keys= keys.filter( x => !x.includes("checkbox") && !x.includes("radio"));
      var dateRange:any[]= keys.filter( x => x.includes("_date"))
      var q="";
      let start=query["_date1"]+"Z"
      let stop=query["_date2"]+"Z"
      let measurement = query["_measurement"];
      q = q + `from(bucket: "${query.bucket}")\n`
      q = q + `|> range(start: ${start}, stop: ${stop})\n`
      q = q + '|> pivot( rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")\n'
      q = q + `|> filter(fn: (r) => r._measurement == "${query["_measurement"]}")\n`
      q = q + `|> filter(fn: (r) => `
      var numberOfSelectedSensor=0;
      for(var i=0; i <this.thingName.length; i++){
        if(query[`_thingName${this.thingName[i]}`]){
          if(numberOfSelectedSensor == 0){
            q = q + `r.thingName == "${this.thingName[i]}"`
            numberOfSelectedSensor +=1;
          }
          else if(numberOfSelectedSensor > 0){
            q = q + ` or r.thingName == "${this.thingName[i]}"`
            numberOfSelectedSensor +=1;
          }
        }
      }
      q = q + ')\n'
      keys=keys.filter( x => !x.includes("_date") && !x.includes("bucket") && !x.includes("_measurement") && !x.includes("_thingName"))
      keys.forEach( key => {

        if(key.includes("_start")){
          let subKey = key.substring(6)
         
            q = q + `|> filter(fn: (r) => r.${subKey} >= ${query[key]})\n`
         
        }
        else if (key.includes("_stop")){
          let subKey = key.substring(5)
          
            q = q + `|> filter(fn: (r) => r.${subKey} <= ${query[key]})\n`
          
        }
        else if(key.includes("_fixed")){
          let subKey = key.substring(6);
            q = q + `|> filter(fn: (r) => r.${subKey} == ${query[key]})\n`
         
        }else if(key.includes("_true_false")){
          let subKey = key.substring(11);
          q = q + `|> filter(fn: (r) => r.${subKey} == ${query[key]})\n`
        }
        else {
            q = q + `|> filter(fn: (r) => r.${key} == "${query[key]}")\n`
        }
       
      });
     console.log(q)
     //alert(q)
      this.dataService.getFilteredData(q)
      .subscribe(data => {
       
        console.log(data);
        if(formati.csv){
          this.scaricaCsv(data)
        }
        if(formati.json){
          this.scaricaJson(data)
        }
       
      });
     
    }


    getDataSchema(bucket:NgModel, measurement: NgModel){
     
      this.dataService.getDataSchema(bucket.value, measurement.value)
      .subscribe(data => {
        
        this.fields = Object.keys(data[0]);
        this.values = Object.values(data[0]);
       
        this.fields = this.fields.filter(field => this.fields.indexOf(field) > 6);
        this.values = this.values.filter(value => this.values.indexOf(value) > 6);
        this.values.forEach( x=> {console.log(typeof x)})
      });
    }

    getMeasurements(bucket:NgModel){
      this.measurements = [];
      this.dataService.getUniqueFields(bucket.value)
      .subscribe( data => {
        
        data.forEach((element:any) => {
          this.measurements.push(element._measurement);
        });
      });
    }

    getThingName(bucket:NgModel, measurement: NgModel){
      this.thingName = [];
      this.dataService.getUniqueFields(bucket.value, measurement.value, 'thingName')
      .subscribe( data => {
        data.forEach((element:any) => {
          this.thingName.push(element.thingName);
        });
        
      })
    }

    scaricaJson(data:any){
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4));
      var link = document.createElement("a");
      link.setAttribute("href",     dataStr     );
      link.setAttribute("download", "prova.json");
      link.click();
    }

    scaricaCsv(data:any){
      var rows = [
        Object.keys(data[0])
      ];
  
      for(var i =0; i<data.length; i++){
        let val: string[] = Object.values(data[i]);
        rows.push(val);
      }
      let csvContent = "data:text/csv;charset=utf-8," 
          + rows.map(e => e.join(",")).join("\n");
  
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      document.body.appendChild(link); // Required for FF
      
      link.click();
    }

    


}
