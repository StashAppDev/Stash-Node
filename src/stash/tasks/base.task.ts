import { StashManager } from "../manager.stash";
import { StashPaths } from "../paths.stash";

export class BaseTask {
  public readonly manager = StashManager;
  public readonly paths = StashPaths;
}
