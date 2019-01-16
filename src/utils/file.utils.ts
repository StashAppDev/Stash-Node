import childProcess from "child_process";
import FileType from "file-type";
import fse from "fs-extra";
import _glob from "glob";
import path from "path";
import ReadChunk from "read-chunk";
import { promisify } from "util";
import { log } from "../logger";
import { Maybe } from "../typings/stash";

interface ISpawnResult {
  stdout: string;
  stderr: string;
}

export class FileUtils {
  public static readonly glob = promisify(_glob);

  /**
   * Get the file MIME and extension.  The return is in the form { ext: string, mime: string }.
   *
   * @param {string} [filePath] The path to the file
   */
  public static async getFileType(filePath?: string): Promise<Maybe<FileType.FileTypeResult>> {
    try {
      if (!filePath) { throw new Error("No file path given."); }
      const buffer = await ReadChunk(filePath, 0, FileType.minimumBytes);
      const fileType = FileType(buffer);
      return (!!fileType) ? fileType : undefined;
    } catch (e) {
      log.warn(`Failed to get file info for ${filePath}`);
      return;
    }
  }

  /**
   * Return the last portion of a path. Similar to the Unix basename command.
   * Often used to extract the file name from a fully qualified path.
   *
   * @param filePath the path to evaluate.
   * @param ext optionally, an extension to remove from the result.
   */
  public static getFileName(filePath: string, ext?: string): string {
    return path.basename(filePath, ext);
  }

  public static async fileExists(filePath?: string) {
    try {
      if (!filePath) { throw new Error("No file path given."); }
      return await fse.pathExists(filePath);
    } catch (e) {
      return false;
    }
  }

  public static async fileExistsSync(filePath?: string) {
    try {
      if (!filePath) { throw new Error("No file path given."); }
      return fse.pathExistsSync(filePath);
    } catch (e) {
      return false;
    }
  }

  public static async move(fromPath: string, toPath: string) {
    try {
      return fse.move(fromPath, toPath);
    } catch (e) {
      log.warn(`Failed to move file from <${fromPath}> to <${toPath}> due to ${e.message}!`);
      return;
    }
  }

  public static async write(data: any, filePath?: string) {
    try {
      if (!filePath) { throw new Error("No file path given."); }
      return fse.outputFile(filePath, data, { flag: "w+" });
    } catch (e) {
      log.warn(`Failed to write file ${filePath}`);
      return;
    }
  }

  public static spawn(
    command: string,
    args: ReadonlyArray<string> = [],
    onStdOut?: (data: any) => void,
    onStdErr?: (data: any) => void,
  ): Promise<ISpawnResult> {
    return new Promise((resolve, reject) => {
      const process = childProcess.spawn(command, args);
      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
        if (!!onStdOut) { onStdOut(data); }
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
        if (!!onStdErr) { onStdErr(data); }
      });

      process.on("error", (err) => {
        reject(new Error(`${command} ${args.join(" ")} encountered error ${err.message}`));
      });

      process.once("exit", async (code: number | null, signal: string | null) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          let message = "";
          if (stdout.length !== 0) { message = `\n\n---\nstdout:\n${stdout}\n---\n`; }
          if (stderr.length !== 0) { message = `${message}\n---nstderr:\n${stderr}\n---n`; }
          reject(new Error(`===\n${command} ${args.join(" ")} exited with code ${code}${message}\n===`));
        }
      });
    });
  }

  // https://noraesae.net/2017/11/16/useful-utility-functions-in-typescript/
  public static exec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  public static execFile(file: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      childProcess.execFile(file, args, (err, stdout, stderror) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
