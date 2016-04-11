/**
 * Created by todha on 4/1/2016.
 */
angular
  .module('app.media')
  // set globals - url paths and browser identity
  .value('globalVals', {
    env: "dev",
    svcPort: "3030",
    appUrl: location.protocol + "//" + location.hostname + ":" + location.port,
    odataUrl: location.protocol + "//" + location.hostname + ":3030/odata/media",
    svcUrl: location.protocol + "//" + location.hostname + ":3030",
    uploadUrl: location.protocol + "//" + location.hostname + ":3030/api/upload",
    batchApiUrl: location.protocol + "//" + location.hostname + ":3030/api/batch",
    configUrl: location.protocol + "//" + location.hostname + ":" + location.port + "/app/main/media/config/config.json",
    browser: function () {
      return function () {
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
          var isOpera = 'Opera';
          return 'Opera';
        }
        // Firefox 1.0+
        if (typeof InstallTrigger !== 'undefined') {
          return 'Firefox';
        }
        // At least Safari 3+: "[object HTMLElementConstructor]"
        if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
          return 'Safari';
        }
        // Chrome 1+
        if (!!window.chrome && !isOpera) {
          return 'Chrome'
        }
        // At least IE6
        if (/*@cc_on!@*/false || !!document.documentMode) {
          return 'IE'
        }
      }
    }
  });
