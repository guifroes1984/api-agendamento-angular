import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.tokenService.signOut();
    this.router.navigate(['/login']);
  }
}