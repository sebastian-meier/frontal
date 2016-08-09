/* @flow */

const pkg = require('./package.json');
import * as path from 'path';
import {
  help
} from './help/help-window.js';
import {
  openFile,
  processFile
} from './lib/files';
import {
  helpLoader
} from './help/help-loader';

const electron = require('electron');
const app = electron.app;
const shell = electron.shell;
const dialog = electron.dialog;
const JsonDB = require('node-json-db');
const chalk = require('chalk');

import {
  sender
} from './lib/sender';
import {
  reload
} from './lib/reload-presentation';
import {
  watch
} from './lib/watcher';
export function buildTemplate(windows) {
  let template = [{
    label: 'File',
    submenu: [{
      label: 'Open...',
      accelerator: 'CmdOrCtrl+O',
      click: function() {
        let file = openFile();
        if (file !== null) {
          processFile(file);
        }
      }
    }]
  }, {
    label: 'Edit',
    submenu: [{
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }]
  }, {
    label: 'View',
    submenu: [{
      label: 'Previous',
      accelerator: 'Up',
      click: function() {
        sender(windows, 'up', 'Hello up from main!');
      }
    }, {
      label: 'Next',
      accelerator: 'Down',
      click: function() {
        sender(windows, 'down', 'Hello down from main!');
      }
    }, {
      label: 'BWD',
      accelerator: 'left',
      click: function() {
        sender(windows, 'up', 'Hello up from main!');
      }
    }, {
      label: 'FWD',
      accelerator: 'Right',
      click: function() {
        sender(windows, 'down', 'Hello down from main!');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Zoom in',
      accelerator: 'CmdOrCtrl+Plus',
      click: () => {
        sender(windows, 'plus', 'plus');
      }
    }, {
      label: 'Zoom out',
      accelerator: 'CmdOrCtrl+-',
      click: () => {
        sender(windows, 'minus', 'minus');
      }
    }, {
      label: 'Zoom 100%',
      accelerator: 'CmdOrCtrl+0',
      click: () => {
        sender(windows, 'zoom-reset', '100');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Zoom in notes',
      accelerator: 'CmdOrCtrl+7',
      click: () => {
        sender(windows, 'dot', 'dot');
      }
    }, {
      label: 'Zoom out notes',
      accelerator: 'CmdOrCtrl+8',
      click: () => {
        sender(windows, 'comma', 'comma');
      }
    }, {
      label: 'Zoom 100% notes',
      accelerator: 'CmdOrCtrl+9',
      click: () => {
        sender(windows, 'zoom-reset-notes', '100');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: reload
    }, {
      label: 'Toggle Full Screen',
      accelerator: (function() {
        if (process.platform === 'darwin') {
          return 'Ctrl+Command+F';
        } else {
          return 'F11';
        }
      })(),
      click: function(item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: (function() {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I';
        } else {
          return 'Ctrl+Shift+I';
        }
      })(),
      click: function(item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    }]
  }, {
    label: 'Window',
    role: 'window',
    submenu: [{
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }]
  }, {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'Open intro file source',
      click: function() {
        let win = help();
      }
    }, {
      label: 'Open intro in main window',
      click: function() {
        // let win = help();
        console.log('User wants to open help again');
        helpLoader([global.slidesWindow, global.commentsWindow]);
      }
    }, {
      label: 'Learn More',
      click: function() {
        shell.openExternal('https://github.com/frntl/frontal');
      }
    }]
  }];
  if (process.platform === 'darwin') {
    var name = app.getName();
    template.unshift({
      label: pkg.name,
      submenu: [{
        label: 'About ' + pkg.name,
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide ' + pkg.name,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() {
          // app.quit();
          app.exit(0);
        }
      }]
    });
    var windowMenu = template.find(function(m) {
      return m.role === 'window';
    });
    if (windowMenu) {
      windowMenu.submenu.push({
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        role: 'front'
      });
    }
  }
  return template;
}
