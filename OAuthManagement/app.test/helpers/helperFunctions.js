
exports.selectDropdownByNumber = function (element, index, milliseconds) {
    element.all(by.tagName('option'))
        .then(function (options) {
            options[index].click();
        });
    if (typeof milliseconds != 'undefined') {
        browser.sleep(milliseconds);
    }
};