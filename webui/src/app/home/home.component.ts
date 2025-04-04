import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedTab: string = 'home';

  constructor(private router: Router) {}

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profilePicture');
    this.router.navigate(['/login']); 
  } 
}
