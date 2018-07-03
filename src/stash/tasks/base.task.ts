import { Manager } from "../manager.stash";

export class BaseTask {
  readonly manager = Manager.getInstance();
}