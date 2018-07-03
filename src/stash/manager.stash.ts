import { log } from "./../logger";
import glob from "glob";
import { ScanTask } from "./tasks/scan.task";
import Paths from './paths.stash';
import PQueue from 'p-queue';

export class Job {
  id: string = '';
  status: Job.Status = Job.Status.Idle;
  message: string = '';
  logs: string[] = [];

  currentItem: number = 0;
  total: number = 0;
}

export namespace Job {
  export enum Status {
    Idle,
    Import,
    Export,
    Scan,
    Generate,
    Clean,
    Scrape
  }
}

export class Manager {

  readonly paths = new Paths();

  //#region Singleton

  private static _instance: Manager = new Manager();

  constructor() {
    if (Manager._instance){
      throw new Error("Error: Instantiation failed: Use Manager.getInstance() instead of new.");
    }
    Manager._instance = this;
  }

  public static getInstance(): Manager { return Manager._instance; }

  //#endregion

  job: Job = new Job();
  queue: PQueue = new PQueue({concurrency: 1});

  //#region Jobs

  public scan(jobId: string) {
    if (this.job.status !== Job.Status.Idle) { return; }
    this.job.id = jobId;
    this.job.status = Job.Status.Import;
    this.job.message = "Importing...";
    this.job.logs = [];

    const scanPaths = glob.sync('**/*.{zip,m4v,mp4,mov,wmv}', {cwd: this.paths.stash, realpath: true});
    this.job.currentItem = 0;
    this.job.total = scanPaths.length;
    log.info(`Starting scan of ${scanPaths.length} files`)

    scanPaths.forEach(path => {
      this.queue.add(() => {
        this.job.currentItem += 1;
        const scanTask = new ScanTask(path);
        return scanTask.start().catch(reason => {
          this.handleError(reason);
        });
      });
    });
  }

  //#endregion

  public getProgress(): number {
    if (this.job.total === 0) { return 0; }
    return (this.job.currentItem / this.job.total) * 100;
  }

  //#region Logging

  verbose(message: string) {
    log.verbose(message);
    this.addLog(message);
  }

  info(message: string) {
    log.info(message);
    this.addLog(message);
  }

  debug(message: string) {
    log.debug(message);
    this.addLog(message);
  }

  warn(message: string) {
    log.warn(message);
    this.addLog(message);
  }

  error(message: string) {
    log.error(message);
    this.addLog(message);
  }

  //#endregion

  //#region Private

  private idle() {
    this.job.status = Job.Status.Idle;
    this.job.message = 'Waiting...';
    this.job.currentItem = 0;
    this.job.total = 0;
    this.triggerSubscription();
  }

  private addLog(message: string) {
    this.job.logs.unshift(message)
    this.triggerSubscription();
  }

  private triggerSubscription() {
    // TODO: Only trigger if run through web app
    // TODO
  }

  private handleError(error: any) {
    log.error(error);
  }

  //#endregion
}