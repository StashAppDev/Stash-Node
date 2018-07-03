import { Manager } from "../manager.stash";

export class BaseTask {
  public readonly manager = Manager.instance;
}
