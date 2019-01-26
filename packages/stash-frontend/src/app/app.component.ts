import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navigation-bar></app-navigation-bar>
    <div class="stash-app-background">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
