import { getManager } from "typeorm";

export class GalleryController {
  static async find(id: string) {
    console.log("find " + id);
  }
}