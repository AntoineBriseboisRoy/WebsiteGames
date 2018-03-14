import { Component } from "@angular/core";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent {
    public readonly title: string;
    public constructor() {
        this.title = "Welcome to our fabulous gaming website!";
    }
}
