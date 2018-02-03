import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  public readonly title: string = "Welcome to our fabulous gaming website!";
  public constructor() { }

  public ngOnInit(): void {
  }
}
