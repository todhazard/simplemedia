(function () {
  'use strict';

  /*
   * Cantral service provides core functionality to share across controllers and services
   * */

  angular
    .module('app.media')
    .factory("mediaFactory", mediaFactory);

  /** @ngInject */
  function mediaFactory($http, configSvc, globalVals, globalConstants) {

    var monthsDirs = [], /// todo: move to odata collection

    // define pagination params
      rows = {
        "currentN": 1, // current selected row
        "maxN": 1,    // row count
        "vals": {}
      },
      pages = {
        "currentN": 1, // current selected row
        "maxN": 1,    // row count
        "rowsPerPage": 16
      },
      odata = {
        orderByStr: "",
        urlBase: globalVals.odataUrl, //"http://localhost:3030/odata/media", // base url
        filters: [], // query definition list
        //    groupBy: [], // query definition list
        result: [], // query definition list
        groupByFields: [],
        vals: [], // response array
        grouped: [], // fields to render in ui
        fieldsList: [], // fields to render in ui
        enums: [],
        fieldModels: [],
        dates: {}
      },

      selectedItems = {},

      mergeAllGroups = function () {
        var updateObj = {
          "type":"merge",
          "updates": []
        };

        odata.result.forEach(function (group) {
          var groupList  = _.map(group, function(item){
              return item._id;
            });
          updateObj.updates.push(groupList);

        });
        runBatchUpdate(updateObj);
      },

      mergeGroup = function (group) {
        var updateObj = {
          "type":"merge",
          "updates": []
        };

          var groupList  = _.map(group, function(item){
            return item._id;
          });
          updateObj.updates.push(groupList);

        runBatchUpdate(updateObj);

      },
      writeGroupMergeDefiniton = function () {
        var updates = [];
        odata.result.forEach(function (group) {
          updates.push(_.map(group, function(item){
            return item.name;
          }))
        });
      },


      initializeDateDefaultParams = function () {
        var startDateStr = moment().subtract(1, 'm').format('YYYY-MM-DD').toString();
        var endDateStr = moment().format('YYYY-MM-DD').toString();

        odata.dates = {
          selectedDateStart: new Date(startDateStr.split("-")),
          selectedDateEnd: new Date(endDateStr.split("-")),
          minDate: new Date("2001-11-12".split("-")),
          maxDate: new Date(endDateStr.split("-")),
          enums: {
            yearsList: [],
            monthsList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          }
        };

        // create list of years for year/month selections, between min and current year
        var minYr = odata.dates.minDate.getFullYear();
        var maxYr = odata.dates.maxDate.getFullYear();

        for (var y = minYr; y <= maxYr; y++) {
          odata.dates.enums.yearsList.push(y);
        }
      },


    // calculate page start, and return paging portion of the odata url
      getPageOdataUrl = function () {
        rows.currentN = (pages.currentN - 1) * pages.rowsPerPage;
        var url = "&$skip=";
        url += rows.currentN;
        url += "&$top=";
        url += pages.rowsPerPage;
        return url;
      },
//todo remove

      prepEnumList = function (from, to, prefix, style, maxLength) {
        var list = [];
        for (var y = from; y <= to; y++) {

          var sName = (prefix) ? prefix.substring(0, maxLength - y.toString().length) + y : y;
          list.push({"name": sName, "style": style})
        }
        return list;

      },

      buildMonthsList = function () {
        var monthsList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          monthsDirs = [];
        for (var m = 0; m < 12; ++m) {
          monthsDirs.push(monthsList[m] + '-' + moment.monthsShort(m));
        }
      },
      buildMonthFolderName = function () {

        for (var i = 0; i < 12; i++) {
          var mo = "0" + (i + 1);
          mo = mo.slice(-2);

        }
      },


    /* determine img source path based on image id and creation date */
      getDestDir = function (img) {

        var config = {
          dates: {
            format: "YYYY-MM-DD"
          },
          img: {
            size: "_ti",
            extension: ".jpg",
            basePath: "/assets/images/app"
          }
        };

        //get moment date object
        var pathParts = [];

        // if date string is defined, assign to moment object
        // and use object to define source folder path
        if (img.datePick) {
          var md = moment(img.datePick, config.dates.format);
          if (md.isValid()) {
            pathParts.push(config.img.basePath);                                   // base path
            pathParts.push(md.format("YYYY"));                                      // year folder name
            pathParts.push(md.format("MM") + "-" + moment.monthsShort(md.month())); // month folder name
            pathParts.push(img._id.toString() + config.img.size + config.img.extension); // file name
          }
        }
        return pathParts.join("/");
      },

      filter = function (val) {
        odata.filters.push(val);
        return this;
      },
      subStringOf = function (field, val) {//vm.selectedYear + "-" + vm.selectedMonth
        var filterDef = "substringof(" + field + ",'" + val + "')";
        odata.filters.push(filterDef);
        return this;
      },
      filterDateRange = function (fieldName, from, to) {
        // var   filterDef =    "substringof(datePick,'"+vm.selectedYear+"-"+vm.selectedMonth+"')")

        //   odata.filters.push(filterDef);
        return this;
      },

      doQuery = function (url, callback) {
        $http({
          method: 'GET',
          url: url
        }).then(function successCallback(response) {
          if (callback) {
            callback(response);
          }

        }, function errorCallback(err) {
        });
      },


      updateQuery = function () {
        cl("updateQuery called")
        // mediaFactory
        //   .fields(flds)
        //   //         .fields(mediaFactory.assembleSelectedFieldsOdata())
        //   .filter("substringof(datePick,'" + vm.odata.enums.years.selected + "-" + vm.odata.enums.months.selected + "')")
        //   .query(function (result) {
        //     // cl("update quesry")
        //     //  cl(result)
        //     vm.rows.vals = result;
        //   });

      },

      getFieldModelByName = function (fieldName) {
        // put filter vals to selected field
        return _.find(odata.fieldModels, function (field) {
          return field.name === fieldName
        });

      },

      getFieldModelByKey = function (fieldKey) {
        // put filter vals to selected field
        return _.find(odata.fieldModels, function (field) {
          return field.key === fieldKey
        });

      },
    // todo: replace
    //   setInitialDateSelection = function () {
    //     // set default dates
    //     var startDateStr = moment().subtract(1, 'm').format('YYYY-MM-DD').toString();
    //     var endDateStr = moment().format('YYYY-MM-DD').toString();
    //
    //     var fieldObj = getFieldModelByKey("datePick");
    //     fieldObj.filterVals = [new Date(startDateStr.split("-")), new Date(endDateStr.split("-"))];
    //
    //   },


    //  assembleDateSearchOdata = function () {
    //    var searchStr = "$filter=";
    //    var field = getFieldModelByName("Date Pick");
    //
    // //   var startDateStr = moment(field.filterVals[0]).subtract(1, 'd').format('YYYY-MM-DD').toString();
    //  //  var endDateStr = moment(field.filterVals[1]).add(1, 'd').format('YYYY-MM-DD').toString();
    //
    //    searchStr += "datePick gt '" + startDateStr + "' and datePick lt '" + endDateStr + "' and ";
    //    return searchStr;
    //
    //  },

      assembleSelectedFieldsOdata = function () {

        var sortedFieldsList = _.sortBy(odata.fieldModels, "fieldOrder");
        var fieldsList = [];

        angular.forEach(sortedFieldsList, function (field) {
          if (field.isSelected) {
            fieldsList.push(field.key);
          }
        });

        return "&$select=" + fieldsList.join(",")

      },

      setFieldsList = function () {

        var sortedFieldsList = _.sortBy(odata.fieldModels, "fieldOrder");
        odata.fieldsList = [];

        angular.forEach(sortedFieldsList, function (field) {
          if (field.isSelected) {
            odata.fieldsList.push(field.key);
          }
        });
        //    cl("in init odata.fieldsList")
        //   cl(odata.fieldsList)
      },

    //Assemble the  filter portion of the odata url string
      assembleSearchFilterValsOdata = function () {

        // define date range cutoff (+/- a day)
        var startDateStr = moment(odata.dates.selectedDateStart).subtract(1, 'd').format('YYYY-MM-DD').toString();
        var endDateStr = moment(odata.dates.selectedDateEnd).add(1, 'd').format('YYYY-MM-DD').toString();

        //  write Date Search portion of Odata filter
        var searchStr = "$filter=datePick gt '" + startDateStr + "' and datePick lt '" + endDateStr + "' and ";
        var tmpStr = "";

        // write All  remaining filters, defined in field model
        angular.forEach(odata.fieldModels, function (field) {
          if (field.filterVals.length > 0 && field.key != "datePick") {
            tmpStr = field.key + " eq '" + field.filterVals.join("' or " + field.key + " eq '") + "' and ";
            searchStr += tmpStr; // tmpStr.slice(1);
          }
        });

        //  truncate trailing "and" , and return
        return searchStr.slice(0, -5);
      },


    /* put search selections to collection, assemble odata url, and call media service to update data display */
      updateSearchQuery = function (fieldName, filterVals, groupByFields) {
        //console.log("updateSearchQuery() called")
        groupByFields = groupByFields || false;
        var fieldObj = getFieldModelByName(fieldName)
        fieldObj.filterVals = filterVals;
        //    cl("in updateSearchQuery filter vals =")
        //   cl(filterVals);

        var odataUrl = odata.urlBase + '?' + assembleSearchFilterValsOdata() + assembleSelectedFieldsOdata();
        //   cl("odataUrl=");
        //   cl(odataUrl);
        //   console.log(" searchString ")
        //   console.log(odataUrl)


        requestSearchData(odataUrl, groupByFields)

      },


      requestSearchData = function (odataUrl, groupByFields) {
        //console.log("in requestSearchData")

        doQuery(odataUrl, function (result) {

          odata.result = initializeData(result.data.value);

          if (groupByFields) {
            //console.log("rows.vals")
            //console.log(JSON.stringify(rows.vals))
            rows.vals = doGroupBy(odata.result, groupByFields);

          } else {
            rows.vals = putListTo2d(odata.result, 3);
          }

        })
      },

      toggleItemSelection = function (id) {
        selectedItems[id] = !selectedItems[id];
        return selectedItems[id];
      },

      updateSelectedItems = function (key, val) {
        var updateDef = {"keyval": {}};
        updateDef.keyval[key] = val;
        updateDef.ids = selectedItems;
      },


    //  send def to bach update service
      runBatchUpdate = function (updateDef, callback, errCallback) {

        var url = globalVals.batchApiUrl;
        $http.post(url, updateDef)
          .then(
            function (response) {
              if (callback) {
                callback(response);
              } else {

              }
            },
            function (err) {
              if (errCallback) {
                errCallback(err);
              } else {

              }
            })

      },
      getImagePaths = function () {
        rows.vals.forEach(function (row) {
          row.imgPath = getDestDir(row);
        })
      },
      fields = function (flds) {
        //  if (!flds) {
        //  return odata.fieldsList;
        //  }
        //   odata.fieldsList = flds;
        return this
      },


    // assemble query parameters to OData URL and make request
      query = function (callback) {
        // todo : refactor to createOdataUrl method
        var url = odata.urlBase;        // Base url // filterStr + fieldsString + getPageOdataUrl();
        url += "/?$filter=" + odata.filters.join(" and "); // add  filters to odata url
        url += "&$select=" + odata.fieldsList.join(",");   // add selected fields to odata url
        var groupByFields = odata.groupByFields;
        clearLastQueryParams();

        doQuery(url, function (result) {
          odata.result = initializeData(result.data.value);

          if (globalConstants.userState.selectedView === "groupView") {
            //console.log("data.groupByFields.length > 0")

            odata.result = doGroupBy(odata.result, groupByFields);
          } else if (globalConstants.userState.selectedView === "tileView") {
            odata.result = putListTo2d(odata.result, 3);
          } else if (globalConstants.userState.selectedView === "listView") {
            odata.result = odata.result;
          }
          /*
           "simpleFilter": 'app/main/media/header/header.html',
           "listView": 'app/main/media/list.html',
           "tileView": 'app/main/media/grid.html',
           "groupView": 'app/main/media/media-view-card.html',
           "largeView": 'app/main/media/grid.html',
           "galleryView"
           * */
          // if (groupByFields.length > 0) {
          //   console.log("data.groupByFields.length > 0")
          //
          //   odata.result = doGroupBy(odata.result, groupByFields);
          // } else {
          //   odata.result = putListTo2d(odata.result, 3);
          // }


          if (callback) {
            callback(odata.result)
          }

        })
        return this;
      },
      cl = function (str) {
        console.log(str);
      },

    //  group data into sets - based on fields specified - to collection.
    // (used to identify any potential duplicate media)
      doGroupBy = function (mediaList, groupByFieldList) {
        //   var groupedSet = {}; // store grouped data
        //   var result = {}; // store grouped data where set n > 1


        // for each media item, join group fields to a single string
        // angular.forEach(mediaList, function (mediaItem) {
        //   var uid = _(groupByFieldList)
        //     .map(function (field) {
        //       return mediaItem[field] || "";
        //     })
        //     .join("-");
        //
        //   // add item to collection of arrays separated according to that string
        //   groupedSet[uid] = groupedSet[uid] || [];
        //   groupedSet[uid].push(mediaItem);
        //
        //   if(groupedSet[uid].length>1){
        //     result[uid]=groupedSet[uid];
        //   }
        //
        // });
        // group by fields
        // var result = _.groupBy(mediaList,  function (val) {
        //   //// get instance vals for specified vals, to create unique key for each field-val combination
        //   return   _(groupByFieldList).map(function(field){
        //     return val[field]
        //   }).join("-");

        //   group on key made of each field-to-group/item
        var result = _(mediaList).groupBy(function (val) {
            return _(groupByFieldList).map(function (field) {
              return val[field]
            }).join("-")
          })
          // filter where group has > 1 item
          .filter(function (grp) {
            return grp.length > 1;
          })
          .value();

        return result;
      },
      doGroupByggg = function (mediaList, groupByFieldList) {
        var groupedSet = {}; // store grouped data
        var result = {}; // store grouped data where set n > 1


        // for each media item, join group fields to a single string
        angular.forEach(mediaList, function (mediaItem) {
          var uid = _(groupByFieldList)
            .map(function (field) {
              return mediaItem[field] || "";
            })
            .join("-");

          // add item to collection of arrays separated according to that string
          groupedSet[uid] = groupedSet[uid] || [];
          groupedSet[uid].push(mediaItem);

          if (groupedSet[uid].length > 1) {
            result[uid] = groupedSet[uid];
          }

        });
        //console.log(result)
        return result;
      },
      doGroupBy2 = function () {

        var uniqValSets = [];
        var result = [];
        _.each(odata.result, function (val) {

          var valCombined = _(odata.groupByFields)
            .map(function (field) {
              return val[field]
            })
            .join("-");

          // get array index of val combo
          var keyIndex = uniqValSets.indexOf(valCombined);

          //  or if arr index does not exist, add to unique list
          if (keyIndex < 0) {
            keyIndex = uniqValSets.length;
            uniqValSets.push(valCombined);
            result.push([]);
          }
          // add media instance to corresponding group
          result[keyIndex].push(val)
        });
        odata.result = result;

      },

      setSelectionButtonStyles = function () {
        _.each(['months', 'years'], function (fieldName) {


          _.each(odata.enums[fieldName], function (mo) {
            if (mo.name === odata.enums[fieldName].selected) {
              mo.style = 'selected-gallery-category';
            } else {
              mo.style = 'unselected-gallery-category';
            }
          })
        })

      },

    // split image list into 2d array to work with material virtual list
    // and gain benefit of < rendering (only what is is viewport)
      putListTo2d = function (data, numCols) {
        var colI = 0,
          resultList = [],
          row = [];

        for (var i = 0; i < data.length; i++) {
          row.push(data[i]);
          // if row has mac number cols, then is new row: add row to main list and clear
          if (row.length >= numCols) {
            resultList.push(row);
            row = [];
          }
        }
        // add any remaining cols in last row
        if (row.length > 0) {
          resultList.push(row);
        }
        return resultList;
      },
      groupBy = function (fields) {
        odata.groupByFields = fields;

        return this;
      },

      substringof = function (vals, direction) {
        // odata.orderByStr="&$orderby="+vals.join("',")+direction;
        return this;
      },
      orderBy = function (vals, direction) {
        return this;
      },
      initializeData = function (data) {
        angular.forEach(data, function (val) {
          val.destDir = getDestDir(val);
          val.OrientationClass = ( val.Orientation === "Horizontal (normal)") ? "landscape" : "portrait";
          val.isSelected = false;
        });
        return data;

      },
      clearLastQueryParams = function () {

        odata.lastFilters = angular.copy(odata.filters);
        odata.filters = []; // clearFilter
        odata.groupByFields = [];
        odata.grouped = [];
        odata.orderByStr = "";

      },
      init = function () {
        //  buildMonthsList();
        initializeDateDefaultParams();

        odata.enums.years = prepEnumList(2000, moment().year(), false, 'unselected-gallery-category');

        odata.enums.months = prepEnumList(1, 12, '0', 'unselected-gallery-category', 2);

        // set default - current year month
        odata.enums.years.selected = moment().year().toString();
        odata.enums.months.selected = monthsDirs[moment().month()];
        setSelectionButtonStyles();

        // get config params
        configSvc.get(function (response) {
          odata.fieldModels = response.fieldModels;
          setFieldsList();
          //    setInitialDateSelection();
        });

      };
    init();
    return {
      "filter": filter,
      "fields": fields,
      "substringof": substringof,
      "query": query,
      "orderBy": orderBy,
      "getDestDir": getDestDir,
      "rows": rows,
      "odata": odata,
      "groupBy": groupBy,
      "filterDateRange": filterDateRange,
      "initializeData": initializeData,
      "putListTo2d": putListTo2d,
      "runBatchUpdate": runBatchUpdate,
      "assembleSelectedFieldsOdata": assembleSelectedFieldsOdata,
      "subStringOf": subStringOf,
      "updateQuery": updateQuery,
      "toggleItemSelection": toggleItemSelection,
      "updateSearchQuery": updateSearchQuery, 
      "updateSelectedItems": mergeAllGroups,
      "mergeAllGroups": mergeAllGroups,
      "mergeGroup": mergeGroup,


    };
  }
})();
