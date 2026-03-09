import { Component } from '@angular/core';
import { Sidebar } from "../../../shared/components/sidebar/sidebar";
import { ClientNavbar } from "../client-navbar/client-navbar";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-clientlayout',
  imports: [Sidebar, ClientNavbar, RouterModule],
  templateUrl: './clientlayout.html',
  styleUrl: './clientlayout.css',
})
export class Clientlayout {}
