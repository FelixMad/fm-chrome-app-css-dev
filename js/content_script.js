
var css = document.createElement('link');
css.type = 'text/css';
css.rel = 'stylesheet';
css.href = 'chrome-extension://'+chrome.runtime.id+'/dev/CSSdev.css';

document.getElementsByTagName('head')[0].appendChild(css);
