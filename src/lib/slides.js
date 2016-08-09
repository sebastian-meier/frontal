import * as parser from './parser';
import {linker} from './images';
import {hrefer} from './href-linker';
import {clone} from './clone-object';
import {uncomment} from './uncomment.js';
import {processConfig} from './process-config';

const marked = require('marked');
const isArray = require('lodash.isarray');
const removeHtmlComments = require('remove-html-comments');
const chalk = require('chalk');

export function slides(data, config) {
  let parsed = parser.md2htmlMarked(data);
  let slds = parsed.slides;
  let objs = [];
  let useTomlConfig = false;
  let tomlAttributes = null;
  if (config) {
    useTomlConfig = true;
    tomlAttributes = processConfig(config, slds.length);
  }

  for (let i = 0; i < slds.length; i++) {
    // if (config) {
    //   if (config.hasOwnProperty('global') === true) {
    //     if (config.hasOwnProperty('slides') === true) {
    //       if (isArray(config.slides) === true) {
    //         for (var k = 0; k < config.slides.length; k++) {
    //           if (config.slides[k].hasOwnProperty('index') === true) {
    //             if (config.slides[k].index === i) {
    //               attributes.push(clone(slides[k]));
    //               break;
    //             }else {
    //               console.log('no index match for slide %s and config %s', i, k);
    //             }
    //           } else {
    //             console.log('there is no index property in slides');
    //           }
    //         } // end of k loop
    //       } else {
    //         // slides is not an array
    //         console.log('slides is not an array');
    //       }
    //     } else {
    //       console.log('no slides property in config');
    //     }
    //     attributes.push(clone(config));
    //   }
    // }
    let clean = removeHtmlComments((slds[i]));
    clean.data = linker(clean.data, global.presetationRoot);
    clean.data = hrefer(clean.data);
    let uncommented = [];
    for (let j = 0; j < clean.comments.length; j++) {
      uncommented.push(marked(uncomment(clean.comments[j])));
    }
    // console.log('parsed.attributes[i] ' , parsed.attributes[i]);
    let attr = null;
    if(useTomlConfig) {
      attr = tomlAttributes[i];
    }else {
      attr = parsed.jsonAttributes[i];
    }
    objs.push({
      slide: clean.data,
      comments: uncommented.join('<br><br>'),
      attributes: attr
    });
  }
  return objs;
}