import { Component, OnInit, Input, HostBinding } from '@angular/core';

import { PerformerData } from '../../core/graphql-generated';

@Component({
  selector: 'app-performer-card',
  templateUrl: './performer-card.component.html',
  styleUrls: ['./performer-card.component.css']
})
export class PerformerCardComponent implements OnInit {
  @Input() performer: PerformerData.Fragment;
  @Input() ageFromDate: string;

  // The host class needs to be card
  @HostBinding('class') class = 'card';

  constructor() {}

  ngOnInit() {}

}
