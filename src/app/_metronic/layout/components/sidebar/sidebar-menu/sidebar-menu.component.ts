import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../core/layout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  menues: any;

  constructor(
    private layoutService:LayoutService
  ) { 
    this.getMenu();
  }

  ngOnInit(): void {
    
  }

  getMenu(){
    var user = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
    
    this.layoutService.getMenuByUser(Number(user.Id)).subscribe(
      (data)=>{
        
        this.menues = data;
        console.log(this.menues);
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }



}
