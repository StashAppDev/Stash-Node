import { Component, OnInit, OnDestroy } from '@angular/core';
import { StashService } from '../stash.service';
import { Observable, Subscription } from 'rxjs';
import { Stats } from '../graphql-generated';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: Stats.Stats;
  private subscription: Subscription;

  constructor(private stashService: StashService) {}

  ngOnInit() {
    this.subscription = this.stashService.statsGQL.watch()
      .valueChanges
      .subscribe(result => {
        this.stats = result.data.stats;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
