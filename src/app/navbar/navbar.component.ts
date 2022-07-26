import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
//orgs: any[] = [];
  constructor(
    public authService: AuthService,
    private dataService: DataService) { 
      /*
      if(this.authService.isLoggedIn()){
        this.dataService.getOrgs()
        .subscribe( data => {
          this.orgs = data.orgs;
          this.orgs.forEach(x=> console.log(x.name))
        })
      }
      */
    }

}
