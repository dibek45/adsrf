import { Component } from '@angular/core';
import { MenuBottomComponent } from '../menu-bottom/menu-bottom.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuBottomComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
