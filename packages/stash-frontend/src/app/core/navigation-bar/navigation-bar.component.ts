import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  public navLinks = [
    { path: '/scenes', label: 'Scenes' },
    { path: '/scenes/markers', label: 'Markers' },
    { path: '/galleries', label: 'Galleries' },
    { path: '/performers', label: 'Performers' },
    { path: '/studios', label: 'Studios' },
    { path: '/tags', label: 'Tags' },
    { path: '/scenes/wall', label: 'Wall' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  isActive(rla: RouterLinkActive, link: { path: string, label: string }) {
    if (link.path === '/scenes') {
      return rla.isActive &&
        this.router.url !== '/scenes/wall' &&
        !this.router.url.includes('/scenes/markers');
    } else {
      return rla.isActive;
    }
  }

}
