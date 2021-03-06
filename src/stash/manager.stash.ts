import glob from "glob";
import PQueue from "p-queue";
import { Database } from "../db/database";
import { log } from "./../logger";
import { StashPaths } from "./paths.stash";
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

  public async bootstrap() {
    const promise = StashPaths.ensureConfigFile();
    await promise;
    return promise;
  }

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

  public async scan(jobId: string) {
    if (this.job.status !== Job.Status.Idle) { return; }
    this.job.id = jobId;
    this.job.status = Job.Status.Scan;
    this.job.message = "Scanning...";
    this.job.logs = [];

    const scanPaths = glob.sync("**/*.{zip,m4v,mp4,mov,wmv}", {cwd: StashPaths.stash, realpath: true});
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
      });
    });

    // TODO check this
    await this.queue.onEmpty();
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
