export class StashManager {
  private static _instance: StashManager = new StashManager();

  constructor() {
    if (StashManager._instance){
      throw new Error("Error: Instantiation failed: Use StashManager.getInstance() instead of new.");
    }
    StashManager._instance = this;
  }

  public static getInstance(): StashManager { return StashManager._instance; }

  public scan() {
    console.log("scan");
  }
}