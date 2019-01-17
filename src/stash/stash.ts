import fs from "fs";
import fse from "fs-extra";
import inquirer from "inquirer";
import { Database } from "../db/database";
import { FixedPaths, Paths } from "./paths.stash";
import { writeJsonFile } from "./utils.stash";

class StashImpl {
  public paths: Paths;

  public async initialize() {
    await this.refreshPaths();
    await Database.initialize();
  }

  public async shutdown() {
    await Database.shutdown();
  }

  public async refreshPaths() {
    const fixedPaths = new FixedPaths();
    await this.ensureConfigFile(fixedPaths);
    this.paths = new Paths(fixedPaths);
  }

  public async ensureConfigFile(fixedPaths: FixedPaths) {
    if (fs.existsSync(fixedPaths.configFile)) { return; } // TODO: Verify JSON is correct.  Pass verified into paths?

    const validation = (value: string) => {
      if (fse.existsSync(value)) {
        return true;
      } else {
        return "Not a valid folder";
      }
    };

    return inquirer.prompt([
      { message: "Media folder path", name: "stash", type: "input", validate: validation },
      { message: "Metadata folder path", name: "metadata", type: "input", validate: validation },
      { message: "Cache folder path", name: "cache", type: "input", validate: validation },
      { message: "Downloads folder path", name: "downloads", type: "input", validate: validation },
    ]).then((answers: any) => {
      writeJsonFile(fixedPaths.configFile, answers);
    });
  }
}

export const Stash = new StashImpl();
