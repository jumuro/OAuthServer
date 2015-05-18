///#source 1 1 /appNugets/Espa.Angular.Grid/module.js
angular.module('espa.grid', ['mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.popover', 'ngAnimate', 'infinite-scroll']);
///#source 1 1 /appNugets/Espa.Angular.Grid/directives/gridDirective.js


'use strict';

angular.module('espa.grid')

.directive('espaGrid', function () {
    var gridDirective = {
        restrict: "AE",
        scope: {
            gridOptions: "&espaGridoptions"
        },
        templateUrl: "appNugets/Espa.Angular.Grid/templates/gridTemplate.html?v=2",
        controller: espaGridCtrl
    }

    espaGridCtrl.$inject = ['$scope', '$filter'];

    return gridDirective;

    function espaGridCtrl($scope, $filter) {

        //#region /**************************************** INIT ********************************************************/
        $scope.selectedFilterColumn = {};

        //Initialize this object in order to avoid popover bug with parent scope.
        $scope.filters = {};

        //get isolated scope grid Options
        $scope.gridOptions = $scope.gridOptions();

        if ($scope.gridOptions) {
            //Store original data for the filtering functionality
            var dataListOrig = $scope.gridOptions.dataList;

            //Initialize dataListFiltered with all the data
            $scope.dataListFiltered = $scope.gridOptions.dataList;

            ////By default the columns will have the ordering feature, unless you have specified the contrary
            //if ($scope.gridOptions.columnList && $scope.gridOptions.columnList.length > 0) {
            //    //Order the first column 
            //    if ($scope.gridOptions.columnList[0].isOrder === undefined || $scope.gridOptions.columnList[0].isOrder === true) {
            //        $scope.predicate = $scope.gridOptions.columnList[0].na    me;
            //        $scope.selectedOrderColumn = $scope.gridOptions.columnList[0];
            //    }
            //}

            //Default message when there is no data.
            if (!$scope.gridOptions.noDataMessage) {
                $scope.gridOptions.noDataMessage = 'No Data';
            }

            //CRUD variables
            $scope.isCrud = ($scope.gridOptions.crudOptions && $scope.gridOptions.crudOptions.enable);

            $scope.isCrudEdit = ($scope.gridOptions.crudOptions && $scope.gridOptions.crudOptions.edit) ? true : false;//&& $scope.gridOptions.crudOptions.edit.method);

            $scope.isCrudDelete = ($scope.gridOptions.crudOptions && $scope.gridOptions.crudOptions.delete) ? true : false;//&& $scope.gridOptions.crudOptions.delete.method);

            $scope.isCrudInsert = ($scope.gridOptions.crudOptions && $scope.gridOptions.crudOptions.insert) ? true : false;//&& $scope.gridOptions.crudOptions.insert.method);

            //Initialize InfiniteScroll options
            $scope.infiniteScroll = $scope.gridOptions.infiniteScroll || {};
            $scope.infiniteScroll.isActive = $scope.infiniteScroll.isActive || false;
            $scope.infiniteScroll.distance = $scope.infiniteScroll.distance || 0;
            $scope.infiniteScroll.elementsLimit = $scope.infiniteScroll.initialLoad;
        }
        //#endregion /**************************************** INIT ********************************************************/

        //#region scope methods

        $scope.showGrid = function () {
            var show = false;
            if ($scope.gridOptions.dataList != undefined){
                show = $scope.gridOptions.dataList.length > 0
            }
            return show;

        }

        //#region /**************************************** FILTER BY ********************************************************/

        $scope.isColumnFilter = function (column) {
            return (column.isFilter && $scope.gridOptions.dataList && $scope.gridOptions.dataList.length > 1);
        }

        $scope.openColumnFilter = function (column, $index) {

            //set the selected column and its index within the $scope.gridOptions.columnList
            $scope.selectedFilterColumn = column;
            $scope.selectedFilterColumnIndex = $index;

            //iterate each column of our grid in order to build the filter list
            for (var i = 0; i < $scope.gridOptions.columnList.length; i++) {
                //if the developer wanted to show the filter on the column for the selected column then....
                if ($scope.gridOptions.columnList[i].isFilter && $scope.gridOptions.columnList[i].name == column.name) {

                    /****************************** PARENT FILTER FUNCTIONALITY ***************************
                    The selected filter will have the last filtered list and  will be the parent filter 
                    which will rule over the others.
                    To do this we will use the filterByForFilterList function which will filter the data except
                    for the selected filter
                    **************************************************************************************/

                    var currentFilterList = $filter('filter')($scope.gridOptions.dataList, $scope.filterByForFilterList);

                    $scope.gridOptions.columnList[i].filterList =

                           Enumerable.From(currentFilterList).
                                       Distinct(function (d) {
                                           return d[column.name]
                                       }).
                                       Select(function (x) {
                                           return {
                                               "filterValue": x[column.name],
                                               "isIncluded":
                                                   Enumerable.From($scope.dataListFiltered).Any(
                                                   function (f) {
                                                       return f[column.name] == x[column.name];
                                                   })
                                           }
                                       }).ToArray();
                }
            }

            isAllChecked();

        }

        $scope.applyFilter = function () {

            //Build the filtered list
            $scope.filters[$scope.selectedFilterColumn.name] =
                Enumerable.From($scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filterList).
                Where(function (f) {
                    return f.isIncluded == true
                }).
                 Select(function (x) {
                     return {
                         "filterValue": x.filterValue,
                         "isIncluded": x.isIncluded

                     }
                 }).ToArray();

            $scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filtered = true;

        }

        $scope.removeFilter = function () {

            //remove filters
            $scope.filters[$scope.selectedFilterColumn.name] = null;

            //remove filtered flag
            $scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filtered = false;

        }

        $scope.checkAll = function () {
            //check all filters
            for (var c = 0; c < $scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filterList.length; c++) {
                $scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filterList[c].isIncluded = $scope.filters.isAll;
            }
        }

        $scope.canFilter = function () {
            //There has to be at least one item to be able to apply  the filter.
            var isIncludedCount = 0;
            for (var c = 0; c < $scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filterList.length; c++) {
                if ($scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filterList[c].isIncluded) {
                    isIncludedCount++;
                }
            }
            return isIncludedCount > 0;
        }

        $scope.checkItemFilter = function () {
            //Check the "All" checkbox depending on the number of filters checked.
            isAllChecked();
        }

        $scope.filterBy = function (item) {
            var filter = false;
            var filtered = 0;

            for (var c = 0; c < $scope.gridOptions.columnList.length; c++) {
                
                if ($scope.filters[$scope.gridOptions.columnList[c].name]) {
                    for (var i = 0; i < $scope.filters[$scope.gridOptions.columnList[c].name].length; i++) {

                        if ($scope.filters[$scope.gridOptions.columnList[c].name][i].isIncluded &&
                            $scope.filters[$scope.gridOptions.columnList[c].name][i].filterValue ==
                            item[$scope.gridOptions.columnList[c].name]) {
                            filtered++;
                            break;
                        }
                    }
                }
                else {
                    filtered++;
                }
            }

            if (filtered == $scope.gridOptions.columnList.length) {
                filter = true;
            }


            return filter;

        }

        $scope.filterByForFilterList = function (item) {
            var filter = false;
            var filtered = 0;

            for (var c = 0; c < $scope.gridOptions.columnList.length; c++) {
                //filter the data except for the selected filter
                if ($scope.filters[$scope.gridOptions.columnList[c].name] && $scope.gridOptions.columnList[c].name != $scope.selectedFilterColumn.name) {
                    for (var i = 0; i < $scope.filters[$scope.gridOptions.columnList[c].name].length; i++) {

                        if ($scope.filters[$scope.gridOptions.columnList[c].name][i].isIncluded &&
                            $scope.filters[$scope.gridOptions.columnList[c].name][i].filterValue ==
                            item[$scope.gridOptions.columnList[c].name]) {
                            filtered++;
                            break;
                        }
                    }
                }
                else {
                    filtered++;
                }
            }

            if (filtered == $scope.gridOptions.columnList.length) {
                filter = true;
            }


            return filter;

        }

        $scope.columnIsFiltered = function ($index) { 
            var isFiltered = false;
            if ($scope.gridOptions.columnList[$index].filtered) {
                isFiltered = true
            }
            return isFiltered;
        }

        $scope.selectedColumnIsFiltered = function () {
            var isFiltered = false;
            if ($scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filtered) {
                isFiltered = true
            }
            return isFiltered;
        }

        //#endregion FILTER BY

        //#region /**************************************** ORDER BY ********************************************************/
        
        $scope.sortBy = function (column) {
            //By default we the columns will have the ordering feature, unless you have specified the contrary
            if (column.isOrder === undefined || column.isOrder === true) {
                $scope.predicate = column.name;
                $scope.reverse = !$scope.reverse;
                $scope.selectedOrderColumn = column;
            }
        }

        $scope.isColumnOrdered = function (column) {
            var name = $scope.selectedOrderColumn ? $scope.selectedOrderColumn.name : '';
            return (column.name == name && $scope.gridOptions.dataList && $scope.gridOptions.dataList.length > 1);
        }
        /************************************************************************************************************/
        //#endregion ORDER BY

        //#region /**************************************** INFINITE SCROLL ********************************************************/
        $scope.loadMore = function () {
            ////appNotificationChannel.requestStarted();
            if ($scope.dataListFiltered !== undefined) {
                if (!$scope.infiniteScroll.isActive) {
                    $scope.infiniteScroll.elementsLimit = $scope.dataListFiltered.length;
                }
                else {
                    $scope.infiniteScroll.elementsLimit += $scope.infiniteScroll.perPage;
                }
            }
        };

        $scope.getLimit = function () {
            return (!$scope.infiniteScroll.isActive && $scope.showGrid() ? $scope.gridOptions.dataList.length : $scope.infiniteScroll.elementsLimit);
        }
        //#ENDregion /**************************************** INFINITE SCROLL ********************************************************/

        //#endregion scope methods

        //#region private methods

        var isAllChecked = function () {
            var isIncludedCount = 0;
            for (var c = 0; c < $scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filterList.length; c++) {
                if ($scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filterList[c].isIncluded) {
                    isIncludedCount++;
                }
            }

            var checkAll = (isIncludedCount == $scope.gridOptions.columnList[$scope.selectedFilterColumnIndex].filterList.length);
            $scope.filters.isAll = checkAll;
            return checkAll;
        }

        //#endregion private methods
    }


   
});
///#source 1 1 /appNugets/Espa.Angular.Grid/directives/onePopoverDirective.js
angular.module('espa.grid')
    .directive('espaOnepopover',
    function ($document, $rootScope, $timeout, $popover) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                var $element = $(element);
                $element.click(function () {
                    $('.popover').each(function () {
                            var $this = $(this);
                            if ($this.parent().find('button').attr('id') != $element.parent().attr('id')) {
                                $this.scope().$hide();
                            }
                        }
                    );
                });
            }
        }
    }
);
///#source 1 1 /appNugets/Espa.Angular.Grid/directives/hideWhenOutDirective.js
angular.module('espa.grid')
    .directive('espaHideout',
    function ($document, $rootScope, $timeout, $popover) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                //var $element = $(element);
                //$(document).on('click', function (event) {
                //    var isClickedElementChildOfPopup = $element.find(event.target).length > 0
                //        || event.target.className == 'fa fa-filter'
                //        || event.target.className == 'ng-scope btn btn-xs btn-default';

                //    if (isClickedElementChildOfPopup)
                //        return;

                //    $element.hide();

                //});
            }
        }
    }
);
