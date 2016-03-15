(function () {
  'use strict';

  /*
   * Cantral service provides core functionality to share across controllers and services
   * */

  angular
    .module('app.media')
    .factory("mediaFactory", mediaFactory);

  /** @ngInject */
  function mediaFactory($http, configSvc, globalVals) {


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
        fieldModels: []
      },
      viewTemplateUrls = {
        "list": 'app/main/mediavt/mediaview-list.html',
        "tile": 'app/main/mediavt/media-tile-grid.html',
        "card": 'app/main/mediavt/media-card-grid.html',
      },


    // calculate page start, and return paging portion og the odata url
      getPageOdataUrl = function () {
        rows.currentN = (pages.currentN - 1) * pages.rowsPerPage;
        var url = "&$skip=";
        url += rows.currentN;
        url += "&$top=";
        url += pages.rowsPerPage;
        return url;
      },

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
      getDestDir = function (img, size) {
        size = size || '_ti';

        var destpath = "";
        try {
          if (img.datePick && img.datePick.length > 10) {
            var ddate = img.datePick,
              monthI = moment(ddate).month(),
              year = moment(ddate).year().toString(),
              id = img._id.toString(),
              result = '/assets/images/app/' + year + '/' + monthsDirs[monthI] + '/' + id + size + ".jpg" || "";

            return result;
          }
        } catch (e) {

        }
        return destpath;
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
        mediaFactory
          .fields(flds)
          //         .fields(mediaFactory.getSelectedFieldNames())
          .filter("substringof(datePick,'" + vm.odata.enums.years.selected + "-" + vm.odata.enums.months.selected + "')")
          .query(function (result) {
            // cl("update quesry")
            //  cl(result)
            vm.rows.vals = result;
          });

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

      setInitialDateSelection = function () {
        // set default dates
        var startDateStr = moment().subtract(1, 'm').format('YYYY-MM-DD').toString();
        var endDateStr = moment().format('YYYY-MM-DD').toString();

        var fieldObj = getFieldModelByKey("datePick");
        fieldObj.filterVals = [new Date(startDateStr.split("-")), new Date(endDateStr.split("-"))];

      },


      assembleDateSearchOdata = function () {
        var searchStr = "$filter=";
        var field = getFieldModelByName("Date Pick");

        var startDateStr = moment(field.filterVals[0]).subtract(1, 'd').format('YYYY-MM-DD').toString();
        var endDateStr = moment(field.filterVals[1]).add(1, 'd').format('YYYY-MM-DD').toString();

        searchStr += "datePick gt '" + startDateStr + "' and datePick lt '" + endDateStr + "' and ";
        return searchStr;

      },

      getSelectedFieldNames = function () {


        var sortedFieldsList = _.sortBy(odata.fieldModels, "fieldOrder");
        var fieldsList = [];

        angular.forEach(sortedFieldsList, function (field) {
          if (field.isSelected) {
            fieldsList.push(field.key);
          }
        });

        return "&$select=" + fieldsList.join(",")

      },

      assembleSearchValsOdata = function () {
        var searchStr = assembleDateSearchOdata()
        var tmpStr = "";

        angular.forEach(odata.fieldModels, function (field) {
          if (field.filterVals.length > 0 && field.key != "datePick") {
            tmpStr = field.key + " eq '" + field.filterVals.join("' or " + field.key + " eq '") + "' and ";
            searchStr += tmpStr; // tmpStr.slice(1);
          }
        });
        console.log("getSelectedFieldNames")
        console.log(getSelectedFieldNames())
        return searchStr.slice(0, -5);
      },


    /* put search selections to collection, assemble odata url, and call media service to update data display */
      updateSearchQuery = function (fieldName, filterVals) {

        var fieldObj = getFieldModelByName(fieldName)
        fieldObj.filterVals = filterVals;

        var odataUrl = odata.urlBase + '?' + assembleSearchValsOdata() + getSelectedFieldNames();
        console.log(" searchString ")
        console.log(odataUrl)
        requestSearchData(odataUrl)

      },

      requestSearchData = function (odataUrl) {

        doQuery(odataUrl, function (result) {
          console.log("result")
          console.log(result)
          odata.result = initializeData(result.data.value);

          rows.vals = putListTo2d(odata.result, 3);


        })
      },

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
        if (!flds) {
          return odata.fieldsList;
        }
        odata.fieldsList = flds;
        return this
      },


    // assemble query parameters to OData URL and make request
      query = function (callback) {
        // todo : refactor to createOdataUrl method
        var url = odata.urlBase;        // Base url // filterStr + fieldsString + getPageOdataUrl();
        url += "/?$filter=" + odata.filters.join(" and "); // add  filters to odata url
        url += "&$select=" + odata.fieldsList.join(",");   // add selcted fields to odata url

        clearLastQueryParams();

        doQuery(url, function (result) {
          odata.result = initializeData(result.data.value);

          if (odata.groupByFields.length > 0) {
            doGroupBy();
          }

          odata.result = putListTo2d(odata.result, 3);

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
      doGroupBy = function () {

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
        console.log("group by files set")
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
        buildMonthsList();
        odata.enums.years = prepEnumList(2000, moment().year(), false, 'unselected-gallery-category');

        odata.enums.months = prepEnumList(1, 12, '0', 'unselected-gallery-category', 2);

        // set default - current year month
        odata.enums.years.selected = moment().year().toString();
        odata.enums.months.selected = monthsDirs[moment().month()];
        setSelectionButtonStyles();

        // get config params
        configSvc.get(function (response) {
          odata.fieldModels = response.fieldModels;
          setInitialDateSelection();
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
      "getSelectedFieldNames": getSelectedFieldNames,
      "subStringOf": subStringOf,
      "updateQuery": updateQuery,
      "updateSearchQuery": updateSearchQuery,

    };
  }
})();
