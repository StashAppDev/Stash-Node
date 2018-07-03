import { run, StashServerOptions } from './server';
import program from 'commander';
import { Manager } from './stash/manager.stash';
import { databaseInitializer } from './database';

program
  .version('0.0.1', '-v, --version')

program
  .command('generate [type]')
  .description('genrates stuff')
  .action(type => {
    console.log(type);
  });

program
  .command('scan')
  .action(async () => {
    await databaseInitializer();
    Manager.getInstance().scan('');
  });

program
  .command('start')
  .description('start the server')
  .option('-p, --port <port>', 'choose the port', '4000')
  .action(cmd => {
    const options: StashServerOptions = {
      port: cmd.port
    };
    run(options);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
