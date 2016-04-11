/**
 * Created by todd on 3/11/2016.
 */


(function () {
  'use strict';


  /* Directive to contain auto-complete, multi-select control */
  angular
    .module('app.media')
    .controller('autoCompleteMultiSelCtrl', autoCompleteMultiSelCtrl);

  /** @ngInject */
  function autoCompleteMultiSelCtrl(distinctFieldsSvc, mediaFactory) {


    var ac = this,
      fieldName = this.fieldName;

    ac.fieldKey = this.fieldKey,
    ac.label = "Search by " + fieldName;
    ac.readonly = false;
    ac.selectedItem = null;
    ac.searchText = '';
    ac.querySearch = querySearch;
    ac.Items = [];
    ac.selectedItems = [];
 //   ac.numberChips = [];
   // ac.numberChips2 = [];
    ac.numberBuffer = '';
    ac.updateText = updateText;
    ac.updateItems = updateItems;
    ac.chipRemoved = chipRemoved;

    // call API to populate field values
    getDistinctFieldVals();


    /**
     * lookup distinct field values from a service
     */
    function getDistinctFieldVals() {

      distinctFieldsSvc.getDistinctFieldVals(ac.fieldKey, function (response) {
        // return response.data
        ac.Items = response.data.map(function (item) {
          return {"name": item, "_lowername": item.toLowerCase()};
        });


      });
    }


    function querySearch(query) {
      var results = query ? ac.Items.filter(createFilterFor(query)) : [];
      return results;
    }


    function getSelectedChips() {
      var elem = document.getElementById(ac.fieldKey);
      var chipObj = angular.element(elem).controller('mdChips') || {};

      if (chipObj.items) {
        return chipObj.items;
      } else {
        return {}; // chipObj;
      }
    }

    function updateText() {
      return;
    }

    function updateItems() {

      var filterVals = _.map(getSelectedChips(),function(chip){
        return chip.name;
      });

      mediaFactory.updateSearchQuery(fieldName, filterVals)
    }

    // todo: implement 
    function chipRemoved() {
      return;
    }

    /**
     * Create filter function to match user selection(s) to current field values
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(Item) {
        return (Item._lowername.indexOf(lowercaseQuery) === 0)
      };

    }

  }


  angular
    .module('app.media')
    .directive('autoCompleteMultiSel', autoCompleteMultiSel);


  /** @ngInject */
  function autoCompleteMultiSel() {
    return {
      restrict: 'E',
      scope: {
        updateFilteredQuery: '&',
        fieldName: '@',
        fieldKey: '@'
      },
      controller: autoCompleteMultiSelCtrl,
      templateUrl: "app/main/media/components/autocomplete-multiselector/autocomplete-multiselector.html",
      bindToController: true,
      controllerAs: 'ac'
    }


  }
})();



