import crypto from "crypto";
import fse from "fs-extra";
import { SceneMarker } from "../db/models/scene-marker.model";

export class VttUtils {
  public static makeChapterVtt(sceneMarkers: SceneMarker[]): string {
    const vtt = ["WEBVTT", ""];
    for (const marker of sceneMarkers) {
      const time = VttUtils.getVttTime(marker.seconds);
      vtt.push(`${time} --> ${time}`);
      vtt.push(marker.title);
      vtt.push("");
    }
    return vtt.join("\n");
  }

  public static getVttTime(seconds: number = 0) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
}
