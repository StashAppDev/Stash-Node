import { Scene } from "../../db/models/scene.model";
import { log } from "../../logger";
import { FileUtils } from "../../utils/file.utils";
import { VideoFile } from "../ffmpeg/video-file";
import { SpriteGenerator } from "../generators/sprite.generator";
import { Stash } from "../stash";
import { BaseTask } from "./base.task";

export class GenerateSpriteTask extends BaseTask {
  private scene: Scene;
  private spriteImagePath: string;
  private spriteVttPath: string;

  constructor(scene: Scene) {
    super();
    this.scene = scene;
    this.spriteImagePath = Stash.paths.scene.getSpriteImageFilePath(this.scene.checksum);
    this.spriteVttPath = Stash.paths.scene.getSpriteVttFilePath(this.scene.checksum);
  }

  public async start() {
    if (await this.spriteExists()) { return; }
    if (!this.scene.path) { throw new Error(`Missing scene path`); }

    log.info(`${this.scene.checksum} - Generating sprite...`);
    const videoFile = await VideoFile.create(this.scene.path);
    const generator = new SpriteGenerator(videoFile, this.spriteImagePath, this.spriteVttPath);
    await generator.generate();
  }

  private async spriteExists(): Promise<boolean> {
    const spriteImageExists = await FileUtils.fileExists(this.spriteImagePath);
    const spriteVttExists = await FileUtils.fileExists(this.spriteVttPath);
    return spriteImageExists && spriteVttExists;
  }
}
