/**
 * Created by todha on 4/1/2016.
 */
/**
 * Created by todha on 4/1/2016.
 */
angular
  .module('app.media')
  // set globals - url paths and browser identity
  .constant('globalConstants', {
    "mediaTemplateUrls": {
      "simpleFilter": 'app/main/media/header/header.html',
      "listView": 'app/main/media/views/list/list.html',
      "tileView": 'app/main/media/views/grid/grid.html',
      "groupView": 'app/main/media/views/grouped/grouped.html',
      "largeView": 'app/main/media/grid.html',
      "galleryView": 'app/main/media/grid.html',
    },
    "userState": {
      "selectedView": "",
      "fieldsSelectedForMerge": [],
    }

  });

