import program from "commander";
import { Database } from "./database";
import { IStashServerOptions, run } from "./server";
import { StashManager } from "./stash/manager.stash";

function configureCommander() {
  program
    .version("0.0.1", "-v, --version");

  program
    .command("generate [type]")
    .description("genrates stuff")
    .action((type) => {
      // TODO
    });

  program
    .command("scan")
    .action(async () => {
      await Database.initialize();
      StashManager.scan("");
    });

  program
    .command("start")
    .description("start the server")
    .option("-p, --port <port>", "choose the port", "4000")
    .action((cmd) => {
      const options: IStashServerOptions = {
        port: cmd.port,
      };
      run(options);
    });

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.help();
  }
}

async function bootstrap() {
  await StashManager.bootstrap();
  configureCommander();
}

bootstrap();
