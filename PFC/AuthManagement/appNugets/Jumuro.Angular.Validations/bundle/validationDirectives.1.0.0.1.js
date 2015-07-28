///#source 1 1 /appNugets/Jumuro.Angular.Validations/module.js
(function () {
    'use strict';

    angular.module('jumuro.validations', []);
})();
///#source 1 1 /appNugets/Jumuro.Angular.Validations/directives/jumuroRangeDirective.js
(function () {
    'use strict';

    angular.module('jumuro.validations')
    //function link(scope, el, attrs, ngModelCtrl) {

    //$scope.isInvalid = function (Start, End) {
    //    if (($scope.form.ESAPricePerPoint[Start].$modelValue < $scope.form.ESAPricePerPoint[End].$modelValue) &&
    //        ($scope.form.ESAPricePerPoint[End].$modelValue != undefined)) {
    //        $scope.form.ESAPricePerPoint.$invalid;
    //        return $scope.form.ESAPricePerPoint[Start].$invalid;
    //    }
    //    else {
    //        return $scope.form.ESAPricePerPoint[Start].$valid;
    //    }
    //};

    .directive('lowerThan', [
      function () {

          var link = function ($scope, $element, $attrs, ctrl) {

              var validate = function (viewValue) {
                  var comparisonModel = $attrs.lowerThan;

                  if (!viewValue || !comparisonModel) {
                      // It's valid because we have nothing to compare against
                      ctrl.$setValidity('lowerThan', true);
                  }

                  // It's valid if model is lower than the model we're comparing against
                  ctrl.$setValidity('lowerThan', parseInt(viewValue, 10) <= parseInt(comparisonModel, 10));
                  return viewValue;
              };

              ctrl.$parsers.unshift(validate);
              ctrl.$formatters.push(validate);

              $attrs.$observe('lowerThan', function (comparisonModel) {
                  return validate(ctrl.$viewValue);
              });

          };

          return {
              require: 'ngModel',
              link: link
          };
      }
    ]);
})();
///#source 1 1 /appNugets/Jumuro.Angular.Validations/directives/jumuroMoneyDirective.js
(function () {
    'use strict';

    angular.module('jumuro.validations')

    .directive('jumuroMoney', function () {

        var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

        function link(scope, el, attrs, ngModelCtrl) {

            var min = parseFloat(scope.$eval(attrs.min) || 0);
            var max = parseFloat(scope.$eval(attrs.min) || 0);
            var scale = parseFloat(scope.$eval(attrs.jumuroMoneyScale) || 10);
            var precision = parseFloat(scope.$eval(attrs.jumuroMoneyPrecision) || 2);
            var lastValidValue;

            function round(num) {
                var d = Math.pow(10, precision);
                return Math.round(num * d) / d;
            }

            function formatPrecision(value) {
                if (value.toString().split(".")[0].length > scale) {
                    var decimalpart = "";
                    for (i = 0; i < precision; i++) {
                        decimalpart += "9";
                    }
                    value = parseFloat((value - 1).toString() + "." + decimalpart);
                }
                return parseFloat(value).toFixed(precision);
            }

            function formatViewValue(value) {
                return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
            }


            ngModelCtrl.$parsers.push(function (value) {
                if (angular.isUndefined(value)) {
                    value = '';
                }

                // Handle leading decimal point, like ".5"
                if (value.indexOf('.') === 0) {
                    value = '0' + value;
                }

                // Allow "-" inputs only when min < 0
                if (value.indexOf('-') === 0) {
                    if (min >= 0) {
                        value = null;
                        ngModelCtrl.$setViewValue('');
                        ngModelCtrl.$render();
                    } else if (value === '-') {
                        value = '';
                    }
                }

                var empty = ngModelCtrl.$isEmpty(value);
                var isValidValue = true;
                if (empty || NUMBER_REGEXP.test(value)) {
                    if (value.split(".")[0].length <= scale) {
                        if (value.split(".").length > 1 && value.split(".")[1].length > precision) {
                            isValidValue = false;
                        }
                    }
                    else {
                        isValidValue = false;
                    }
                }
                else {
                    isValidValue = false;
                }

                if (isValidValue) {
                    lastValidValue = (value === '') ? null : (empty ? value : parseFloat(value));
                }
                else {
                    // Render the last valid input in the field
                    ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
                    ngModelCtrl.$render();
                }

                ngModelCtrl.$setValidity('money', true);
                if (lastValidValue != null) {
                    if (lastValidValue.toString().split(".").length > 1 && lastValidValue.toString().split(".")[1].length > precision) {
                        lastValidValue = parseFloat(lastValidValue.toString().split(".")[0] + "." + lastValidValue.toString().split(".")[1].substring(0, precision));
                    }
                    return formatPrecision(lastValidValue);
                } else {
                    return null;
                }
            });
            ngModelCtrl.$formatters.push(formatViewValue);

            var minValidator = function (value) {
                if (!ngModelCtrl.$isEmpty(value) && value < min) {
                    ngModelCtrl.$setValidity('moneyMinValue', false);
                    return undefined;
                } else {
                    ngModelCtrl.$setValidity('moneyMinValue', true);
                    return value;
                }
            };
            ngModelCtrl.$parsers.push(minValidator);
            ngModelCtrl.$formatters.push(minValidator);

            if (max) {
                var max = parseFloat(max);
                var maxValidator = function (value) {
                    if (!ngModelCtrl.$isEmpty(value) && value > max) {
                        ngModelCtrl.$setValidity('moneyMaxValue', false);
                        return undefined;
                    } else {
                        ngModelCtrl.$setValidity('moneyMaxValue', true);
                        return value;
                    }
                };

                ngModelCtrl.$parsers.push(maxValidator);
                ngModelCtrl.$formatters.push(maxValidator);
            }

            // Round off
            if (precision > -1) {
                ngModelCtrl.$parsers.push(function (value) {
                    return value ? round(value) : value;
                });
                ngModelCtrl.$formatters.push(function (value) {
                    return (!angular.isUndefined(value) && value != null) ? formatPrecision(value) : value;
                });
            }

            el.bind('blur', function () {
                var value = ngModelCtrl.$modelValue;
                if (!angular.isUndefined(value) && value != null) {
                    ngModelCtrl.$viewValue = formatPrecision(value);
                    ngModelCtrl.$render();
                }
            });
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    });
})();
///#source 1 1 /appNugets/Jumuro.Angular.Validations/directives/jumuroIntegerDirective.js
(function () {
    'use strict';

    angular.module('jumuro.validations')

    .directive('jumuroInteger', jumuroInteger);

    function jumuroInteger() {
        var INTEGER_REGEXP = /^\-?\d+$/;
        return {
            require: 'ngModel',
            scope: {
                zero: '@jumuroIntegerZero'
            },
            link: function (scope, elm, attrs, ctrl) {
                var zero = scope.zero;
                //if (zero === undefined)
                //{
                //    zero = 'false';
                //}

                ctrl.$parsers.unshift(function (viewValue) {
                    if (viewValue == '' || (INTEGER_REGEXP.test(viewValue) && viewValue < 999999999)
                        && (zero == 'true' ? (viewValue >= 0) : (viewValue > 0))) {
                        // it is valid
                        ctrl.$setValidity('integer', true);

                        return viewValue;
                    } else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('integer', false);

                        return viewValue;
                    }
                });
            }
        };
    }
})();
///#source 1 1 /appNugets/Jumuro.Angular.Validations/directives/jumuroEmailDirective.js
(function () {
    'use strict';
    angular.module('jumuro.validations')

    .directive('jumuroEmail', jumuroEmail);

    function jumuroEmail() {
        var EMAIL_REGEXP = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (viewValue == '' || EMAIL_REGEXP.test(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('email', true);

                        return viewValue;
                    } else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('email', false);

                        return viewValue;
                    }
                });
            }
        };
    }
})();
///#source 1 1 /appNugets/Jumuro.Angular.Validations/directives/jumuroDecimalDirective.js
(function () {
    'use strict';
    angular.module('jumuro.validations')

    .directive('jumuroDecimal', jumuroDecimal);

    function jumuroDecimal() {
        var DECIMAL_REGEXP = /^\d+(\.\d{1,5})?$/;
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (viewValue == '' || (DECIMAL_REGEXP.test(viewValue) && viewValue >= 0 && viewValue < 999999999)) {
                        // it is valid
                        ctrl.$setValidity('decimal', true);

                        return viewValue;
                    } else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('decimal', false);

                        return viewValue;
                    }
                });
            }
        };
    }
})();
///#source 1 1 /appNugets/Jumuro.Angular.Validations/directives/jumuroColorDirective.js
(function () {
    'use strict';
    angular.module('jumuro.validations')

    .directive('jumuroColor', jumuroColor);

    function jumuroColor() {
        return {
            require: 'ngModel',
            scope: {
                colorList: "&jumuroColorlist",
                colorObject: "@jumuroColorobject"
            },
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    var isValidColor = true;
                    var colorList = scope.colorList();
                    var colorObject = scope.colorObject;
                    for (var i = 0; i < colorList.length; i++) {
                        if (colorList[i].color) {
                            if (colorList[i].color == viewValue) {
                                isValidColor = false;
                                break;
                            }
                        }
                        else if (colorList[i][colorObject].color) {
                            if (colorList[i][colorObject].color == viewValue) {
                                isValidColor = false;
                                break;
                            }
                        }

                    }

                    ctrl.$setValidity('color', isValidColor);

                    return viewValue;
                });
            }
        };
    }
})();
