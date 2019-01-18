import { Component, OnInit, Input, HostBinding, HostListener, ViewChild } from '@angular/core';

import { SceneDataFragment } from '../../core/graphql-generated';

@Component({
  selector: 'app-scene-list-item',
  templateUrl: './scene-list-item.component.html',
  styleUrls: ['./scene-list-item.component.css']
})
export class SceneListItemComponent implements OnInit {
  @Input() scene: SceneDataFragment;

  // The host class needs to be card
  @HostBinding('class') class = 'item';
  @ViewChild('videoTag') videoTag: any;

  constructor() {}

  ngOnInit() {
    this.videoTag.nativeElement.volume = 0.05;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.videoTag.nativeElement.play();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.videoTag.nativeElement.pause();
  }
}
