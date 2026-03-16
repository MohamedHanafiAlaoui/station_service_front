import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbar } from '../../admin-navbar/admin-navbar';

@Component({
  selector: 'app-adminlayout',
  standalone: true,
  imports: [RouterOutlet, AdminNavbar],
  templateUrl: './adminlayout.html',
  styleUrl: './adminlayout.css'
})
export class Adminlayout {

}
