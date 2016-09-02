/* global window, document */
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;

const isEmpty = require('lodash.isempty');
import {getComputedFontSize, setFontSize} from './lib/fontsize';
import {switchJS} from './lib/theme-loader';
import {setAttributes, setHeaderFooter} from './lib/header-footer';

const windowManager = remote.require('electron-window-manager');
const shell = require('electron').shell;
const padStart = require('lodash.padStart');
const drag = require('electron-drag');
const smalltalk = require('smalltalk');
let dimensions = false;

function showDimensions() {
  let ele = document.getElementById('dimensions');
  if(dimensions === true) {
    if(ele !== null) {
      ele.style.visibility = 'visible';
      let myWidth = window.innerWidth;
      let myHeight = window.innerHeight;
        // your size calculation code here
      ele.innerHTML = myWidth + ' × ' + myHeight;
    }
  }else if(dimensions === false && ele !== null) {
    ele.style.visibility = 'hidden';

  }
}
window.onresize = ()=>{
  showDimensions();
};
window.onload = () => {
  showDimensions();
  let content = null;
  let currentSlide = 0;
  let ids = ['comments', 'slides'];
  // let initialCommentsFontsize = null;
  let initialSlidesFontsize = null;
  let initialSlidesHeaderFontsize = null;
  let initialSlidesFooterFontsize = null;


  if (document.getElementById('frontal') !== null) {
    initialSlidesFontsize = getComputedFontSize(document.getElementById('frontal'));
    // console.log('initialCommentsFontsize ' , initialCommentsFontsize);
  }
  if (document.getElementById('header') !== null) {
    initialSlidesHeaderFontsize = getComputedFontSize(document.getElementById('header'));
    // console.log('initialCommentsFontsize ' , initialCommentsFontsize);
  }
  if (document.getElementById('footer') !== null) {
    initialSlidesFooterFontsize = getComputedFontSize(document.getElementById('footer'));
    // console.log('initialCommentsFontsize ' , initialCommentsFontsize);
  }
  // Pass a query selector or a dom element to the function.
  // Dragging the element will drag the whole window.
  var clearF = drag('#frontal');
  // Call the returned function to make the element undraggable again.
  // clear();
  // Fallback to using -webkit-app-region property.
  if (!drag.supported) {
    document.querySelector('#frontal').style['-webkit-app-region'] = 'drag';
    document.querySelector('#notes').style['-webkit-app-region'] = 'drag';
  }

  function increaseSlideNumber() {
    if (content !== null || content.msg !== undefined) {
      if (currentSlide === content.msg.length - 1) {
        currentSlide = content.msg.length - 1;
      } else {
        currentSlide++;
      }
    }
  }

  function decreaseSlideNumber() {
    if (currentSlide === 0) {
      currentSlide = 0;
    } else {
      currentSlide--;
    }
  }

  function constrain(i, arr) {
    let ndx = null;
    if (i > arr.length - 1) {
      ndx = arr.length - 1;
    } else {
      ndx = i;
    }
    return ndx;
  }

  function setContent() {
    let cnt = content.msg[constrain(currentSlide, content.msg)];
    ids.forEach((ele, index, array) => {
      let element = document.getElementById(ele);
      if (element !== null) {
        if (ele === 'slides') {
          element.innerHTML = cnt.slide;
          setAttributes(cnt.attributes, currentSlide + 1, content.msg.length);
          windowManager.bridge.emit('content', {
            message: {comment: cnt.comments,
                      currentSlide: padStart(currentSlide + 1, String(content.msg.length).length, '0'),
                        currentSlidesLength: content.msg.length}
          });
        }
      }
    });
  }

  function switchCSS(cssFilePath, cssLinkIndex) {

    let oldLink = document.getElementsByTagName('link').item(cssLinkIndex);
    let newLink = document.createElement('link');
    newLink.setAttribute('rel', 'stylesheet');
    newLink.setAttribute('type', 'text/css');
    if(oldLink.id === 'slides-link') {
      newLink.setAttribute('id', 'slides-link');
      newLink.setAttribute('href', cssFilePath + 'main.css');

    }else if(oldLink.id === 'comments-link') {
      newLink.setAttribute('id', 'comments-link');
      newLink.setAttribute('href', cssFilePath + 'main-comments.css');
    }
    document.getElementsByTagName('head').item(0).replaceChild(newLink, oldLink);
  }

  function switchToBuildInCSS(themeName) {
    let cssFilePath = __dirname + '/themes/' + themeName + '/css/';
    switchCSS(cssFilePath, 0);
  }

  function switchToCustomCSS(filePath) {
    switchCSS(filePath, 0);
  }


  // -----------execution-------------------
  ipcRenderer.on('new-file', (event, arg) => {
    // reset all on new file
    content = null;
    currentSlide = 0;
    setHeaderFooter('', 'footer');
    setHeaderFooter('', 'header');

  });
  ipcRenderer.on('down', (event, arg) => {
    // console.log(arg);
    // console.log(content);
    increaseSlideNumber();
    setContent();
    // setCurrentSlideNumber();
    // document.getElementByClassName('content')
    // .innerHTML = currentSlide;
  });
  ipcRenderer.on('up', (event, arg) => {
    // console.log(content);
    decreaseSlideNumber();
    setContent();
    // setCurrentSlideNumber();
    // document.getElementByClassName('content')
    // .innerHTML = currentSlide;
  });
  ipcRenderer.on('update', (event, arg) => {
    // content = arg;
    // console.log(arg);
  });
  ipcRenderer.on('slides', (event, arg) => {
    console.log(arg);
    content = arg;
    setContent();
  });
  ipcRenderer.on('hello', (event, arg) => {
  });

  ipcRenderer.on('switch-theme', (event, arg) => {
    switchToBuildInCSS(arg.msg, 0);
    let jsFolderPath = __dirname + '/themes/' + arg.msg + '/js/';
    switchJS(jsFolderPath);

  });

  ipcRenderer.on('switch-custom-theme', (event, arg) =>{
    // console.log('switch to custom theme: ', arg);
    if(arg.msg.css.slidesTheme === true) {
      switchToCustomCSS(arg.msg.css.path + '/');
    }
    if(arg.msg.js.path !== null) {
      switchJS(arg.msg.js.path);
    }
  });

  ipcRenderer.on('plus', (event, arg) => {
    setFontSize(2, null, 'frontal');
    setFontSize(2, null, 'header');
    setFontSize(2, null, 'footer');
  });
  ipcRenderer.on('minus', (event, arg) => {
    setFontSize(-2, null, 'frontal');
    setFontSize(-2, null, 'header');
    setFontSize(-2, null, 'footer');
  });
  ipcRenderer.on('zoom-reset', (event, arg) => {
    setFontSize(null, initialSlidesFontsize, 'frontal');
    setFontSize(null, initialSlidesHeaderFontsize, 'header');
    setFontSize(null, initialSlidesFooterFontsize, 'footer');
  });
  ipcRenderer.on('comma', (event, arg) => {
    // decrease speakerNotes
    windowManager.bridge.emit('comma', {
      message: {val: -2}
    });
  });
  ipcRenderer.on('dot', (event, arg) => {
    // increase speakerNotes
    windowManager.bridge.emit('dot', {
      message: {val: 2}
    });
  });
  ipcRenderer.on('zoom-reset-notes', (event, arg) => {
    // decrease speakerNotes
    windowManager.bridge.emit('zoom-reset-notes', {
      message: {val: null}
    });
  });

  ipcRenderer.on('set-window-size', (event, arg)=>{
    let win = remote.getCurrentWindow();
    console.log('set window size: ', arg);
    win.setSize(arg.msg.width, arg.msg.height, true);
  });
  ipcRenderer.on('toggle-dimensions', (event, arg)=>{

    dimensions = !dimensions;
    showDimensions();
    console.log('dimensions toggled to: ', dimensions);
  });
  ipcRenderer.on('goto', (event, arg) => {
    // decrease speakerNotes
    smalltalk.prompt('Goto',
      `Enter a slide number (${(currentSlide + 1)}/${content.msg.length}) ?`,
      String(currentSlide + 1)).then((value) => {
        console.log(value);
        currentSlide = !isNaN(parseInt(value, 10)) ? constrain(parseInt(value, 10) - 1, content.msg) : currentSlide;
        setContent();
      }, ()=> {
        console.log('cancel');
      });
  });
};
