import program from "commander";
import { IStashServerOptions, run } from "./server";
import { StashManager } from "./stash/manager.stash";
import { Stash } from "./stash/stash";

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
      await StashManager.scan("");
      await Stash.shutdown();
    });

  program
    .command("import")
    .action(async () => {
      await StashManager.import("");
      await Stash.shutdown();
    });

  program
    .command("generate")
    .action(async () => {
      await StashManager.generate("");
      await Stash.shutdown();
    });

  program
    .command("start")
    .description("start the server")
    .option("-p, --port <port>", "choose the port", "7000")
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
  await Stash.initialize();
  configureCommander();
}

bootstrap();
