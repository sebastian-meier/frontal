'use strict';

var _menu = require('./menu');

// const electron = require('electron');
// const {app, BrowserWindow} = require('electron');
// let slidesWindow, commentsWindow;
// app.on('ready', () => {
//   let displays = electron.screen.getAllDisplays();
//   let externalDisplay = displays.find((display) => {
//     return display.bounds.x !== 0 || display.bounds.y !== 0
//   })
//   if (externalDisplay) {
//     slidesWindow = new BrowserWindow({
//       x: externalDisplay.bounds.x + 50,
//       y: externalDisplay.bounds.y + 50
//     });
//   }
// });
var electron = require('electron');
var Menu = electron.Menu;
var app = electron.app;
var ipcMain = electron.ipcMain;
var MenuItem = electron.MenuItem;
var BrowserWindow = electron.BrowserWindow;


var slidesWindow = null;
var commentsWindow = null;
function createWindows() {
  // Create the browser window.
  // global.error('displays', displays);
  // Create the browser window.
  slidesWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    title: 'Frontal'
  });
  // and load the index.html of the app.
  slidesWindow.loadURL('file://' + __dirname + '/views/slides.html');
  // Open the DevTools.
  slidesWindow.webContents.openDevTools();
  // Emitted when the window is closed.
  slidesWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    slidesWindow = null;
  });
  commentsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: 800,
    y: 0,
    title: 'Frontal'
  });
  // and load the index.html of the app.
  commentsWindow.loadURL('file://' + __dirname + '/views/comments.html');
  // Open the DevTools.
  // commentsWindow.webContents.openDevTools();
  // Emitted when the window is closed.
  commentsWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    commentsWindow = null;
  });
}

function createMenues() {
  var template = (0, _menu.buildTemplate)([slidesWindow, commentsWindow]);
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
}
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (slidesWindow === null || commentsWindow === null) {
    createWindows();
    createMenues();
  }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindows();
  createMenues();
});
// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.