import { Component } from '@angular/core';
import { ClientNavbar } from "../client-navbar/client-navbar";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-clientlayout',
  imports: [ ClientNavbar, RouterModule],
  templateUrl: './clientlayout.html',
  styleUrl: './clientlayout.css',
})
export class Clientlayout {}
