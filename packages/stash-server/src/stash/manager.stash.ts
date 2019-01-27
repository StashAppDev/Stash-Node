import PQueue from "p-queue";
import { Database } from "../db/database";
import { Scene } from "../db/models/scene.model";
import { FileUtils } from "../utils/file.utils";
import { ObjectionUtils } from "../utils/objection.utils";
import { log } from "./../logger";
import { Stash } from "./stash";
import { ExportTask } from "./tasks/export.task";
import { GenerateSpriteTask } from "./tasks/generate-sprite.task";
import { GenerateTranscodeTask } from "./tasks/generate-transcode.task";
import { ImportTask } from "./tasks/import.task";
import { ScanTask } from "./tasks/scan.task";

export class Job {
  public id: string = "";
  public status: Job.Status = Job.Status.Idle;
  public message: string = "";
  public logs: string[] = [];

  public currentItem: number = 0;
  public total: number = 0;
}

// tslint:disable-next-line:no-namespace
export namespace Job {
  export enum Status {
    Idle,
    Import,
    Export,
    Scan,
    Generate,
    Clean,
    Scrape,
  }
}

class Manager {

  public job: Job = new Job();
  public queue: PQueue = new PQueue({concurrency: 1});

  //#region Jobs

  public async import(jobId: string) {
    if (this.job.status !== Job.Status.Idle) { return; }
    this.job.id = jobId;
    this.job.status = Job.Status.Import;
    this.job.message = "Importing...";
    this.job.logs = [];

    await Database.reset();

    const importTask = new ImportTask();
    try {
      await importTask.start();
    } catch (e) {
      this.handleError(e);
    }

    this.idle();
  }

  public async export(jobId: string) {
    if (this.job.status !== Job.Status.Idle) { return; }
    this.job.id = jobId;
    this.job.status = Job.Status.Export;
    this.job.message = "Exporting...";
    this.job.logs = [];

    const exportTask = new ExportTask();
    try {
      await exportTask.start();
    } catch (e) {
      this.handleError(e);
    }

    this.idle();
  }

  public async scan(jobId: string) {
    if (this.job.status !== Job.Status.Idle) { return; }
    this.job.id = jobId;
    this.job.status = Job.Status.Scan;
    this.job.message = "Scanning...";
    this.job.logs = [];

    const scanPaths = await FileUtils.glob("**/*.{zip,m4v,mp4,mov,wmv}", { cwd: Stash.paths.stash, realpath: true });
    this.job.currentItem = 0;
    this.job.total = scanPaths.length;
    log.info(`Starting scan of ${scanPaths.length} files`);

    scanPaths.forEach((path) => {
      this.queue.add(async () => {
        this.job.currentItem += 1;
        const scanTask = new ScanTask(path);
        return scanTask.start();
      }).catch((reason: Error) => {
        this.handleError(reason);
      }); // TODO: finally remove tmp dir and also use the tmp dir for this task
    });

    await this.queue.onIdle();
    this.idle();
  }

  public async generate(
    jobId: string,
    sprites: boolean = true,
    transcodes: boolean = true,
  ) {
    if (this.job.status !== Job.Status.Idle) { return; }
    this.job.id = jobId;
    this.job.status = Job.Status.Generate;
    this.job.message = "Generating content...";
    this.job.logs = [];

    this.job.total = await ObjectionUtils.getCount(Scene);
    await Stash.paths.generated.ensureTmpDir();

    const scenes = await Scene.query();
    for (const scene of scenes) {
      this.job.currentItem += 1;

      if (sprites) {
        this.queue.add(async () => {
          const task = new GenerateSpriteTask(scene);
          return task.start();
        }).catch((reason: Error) => {
          this.handleError(reason);
        });
      }

      if (transcodes) {
        this.queue.add(async () => {
          const task = new GenerateTranscodeTask(scene);
          return task.start();
        }).catch((reason: Error) => {
          this.handleError(reason);
        });
      }

      await this.queue.onIdle();
    }

    await Stash.paths.generated.removeTmpDir();
    this.idle();
  }

  //#endregion

  public getProgress(): number {
    if (this.job.total === 0) { return 0; }
    return (this.job.currentItem / this.job.total) * 100;
  }

  //#region Logging

  public verbose(message: string) {
    log.verbose(message);
    this.addLog(message);
  }

  public info(message: string) {
    log.info(message);
    this.addLog(message);
  }

  public debug(message: string) {
    log.debug(message);
    this.addLog(message);
  }

  public warn(message: string) {
    log.warn(message);
    this.addLog(message);
  }

  public error(message: string) {
    log.error(message);
    this.addLog(message);
  }

  //#endregion

  //#region Private

  private idle() {
    this.job.status = Job.Status.Idle;
    this.job.message = "Waiting...";
    this.job.currentItem = 0;
    this.job.total = 0;
    this.triggerSubscription();
  }

  private addLog(message: string) {
    this.job.logs.unshift(message);
    this.triggerSubscription();
  }

  private triggerSubscription() {
    // TODO: Only trigger if run through web app
    // TODO
  }

  private handleError(error: Error) {
    log.error(`${error.message}\n${error.stack}`);
  }

  //#endregion
}

export const StashManager = new Manager();
