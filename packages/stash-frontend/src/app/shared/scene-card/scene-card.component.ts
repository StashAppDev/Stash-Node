import { Component, OnInit, Input, HostBinding, HostListener, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SceneData, PerformerData, SceneMarkerData, TagData } from '../../core/graphql-generated';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scene-card',
  templateUrl: './scene-card.component.html',
  styleUrls: ['./scene-card.component.css']
})
export class SceneCardComponent implements OnInit {
  private isPlaying = false;
  private isHovering = false;
  private video: any;
  previewPath: string = null;
  @Input() scene: SceneData.Fragment;

  // The host class needs to be card
  @HostBinding('class') class = 'card';
  @ViewChild('videoTag') videoTag: any;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.video = this.videoTag.nativeElement;
    this.video.volume = 0.05;
    this.video.onplaying = () => {
      if (this.isHovering === true) {
        this.isPlaying = true;
      } else {
        this.video.pause();
      }
    };
    this.video.onpause = () => this.isPlaying = false;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovering = true;
    if (!this.previewPath) {
      this.previewPath = this.scene.paths.preview;
    }
    if (this.video.paused && !this.isPlaying) {
      this.video.play();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovering = false;
    if (!this.video.paused && this.isPlaying) {
      this.video.pause();
    }
  }

  hasFavoritePerformer(): boolean {
    return this.scene.performers.filter(performer => performer.favorite === true).length > 0;
  }

  openTagsDialog(): void {
    this.dialog.open(SceneCardTagsDialogComponent, {
      width: '50vw',
      data: this.scene.tags
    });
  }

  openPerformersDialog(): void {
    this.dialog.open(SceneCardPerformersDialogComponent, {
      width: '50vw',
      data: this.scene.performers
    });
  }

  openMarkersDialog(): void {
    this.dialog.open(SceneCardMarkersDialogComponent, {
      width: '50vw',
      data: this.scene
    });
  }
}

@Component({
  selector: 'app-scene-card-tags-dialog',
  template: `
  <mat-chip-list>
    <mat-chip *ngFor="let tag of tags"
      (click)="onClickTag(tag)"
      selected>
      {{tag.name}}
    </mat-chip>
  </mat-chip-list>
  `
})
export class SceneCardTagsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SceneCardTagsDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public tags: TagData.Fragment[]
  ) {}

  onClickTag(tag: TagData.Fragment): void {
    this.router.navigate(['/tags', tag.id]);
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-scene-card-performers-dialog',
  template: `
  <mat-chip-list>
    <mat-chip *ngFor="let performer of performers"
      (click)="onClickPerformer(performer)"
      selected
      [class.mat-warn]="performer.favorite">
      <mat-icon *ngIf="performer.favorite">favorite</mat-icon>
      {{performer.name}}
    </mat-chip>
  </mat-chip-list>
  `
})
export class SceneCardPerformersDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SceneCardPerformersDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public performers: PerformerData.Fragment[]
  ) {}

  onClickPerformer(performer: PerformerData.Fragment): void {
    this.router.navigate(['/performers', performer.id]);
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-scene-card-markers-dialog',
  template: `
  <mat-chip-list>
    <mat-chip *ngFor="let marker of scene.scene_markers"
      (click)="onClickSceneMarker(scene, marker)"
      selected>
      {{marker.title}} - {{marker.seconds | seconds}}
    </mat-chip>
  </mat-chip-list>
  `
})
export class SceneCardMarkersDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SceneCardMarkersDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public scene: SceneData.Fragment
  ) {}

  onClickSceneMarker(scene: SceneData.Fragment, sceneMarker: SceneMarkerData.Fragment): void {
    this.router.navigate(
      ['/scenes', scene.id],
      { queryParams: { t: sceneMarker.seconds } }
    );
    this.dialogRef.close();
  }
}
