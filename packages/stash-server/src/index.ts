import program from "commander";
import { databaseInitializer } from "./database";
import { IStashServerOptions, run } from "./server";
import { Manager } from "./stash/manager.stash";

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
    await databaseInitializer();
    Manager.instance.scan("");
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
