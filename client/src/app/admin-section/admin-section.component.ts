import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin-section",
  templateUrl: "./admin-section.component.html",
  styleUrls: ["./admin-section.component.css"]
})

export class AdminSectionComponent implements OnInit {

  public readonly title: string = "Welcome to the admistration section!";
  public constructor() { }

  public ngOnInit(): void {
  }

}
