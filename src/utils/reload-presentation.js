import {
  processing
} from '../processor';
import {
  sender
} from './sender';
const chalk = require('chalk');
export function reload() {
  if (global.presentationFile !== null) {
    let res = processing(global.presentationFile);
    // console.log('res in menu.js ', res);
    if (res !== null) {
      // database.push('/slides', res);
      // global.database = database;
      // console.log(res);
      sender([global.slidesWindow, global.commentsWindow], 'slides', res);
    }
  } else {
    console.log(chalk.red('Error reloading file'));
    console.log('global.presentationFile ', global.presentationFile);
  }
}
