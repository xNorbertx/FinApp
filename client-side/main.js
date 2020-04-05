$(document).ready(function() {
    callGraphQL('{ categories { _id, name, type, totalValue } }')
        .then(function(res) {
            ko.applyBindings(new AppViewModel(res))
        })
});


function AppViewModel(data) {
    var self = this;
    self.title = "Norb's and Zhana's moolah meter";

    self.selectedYear = ko.observable();
    self.selectedMonth = ko.observable();

    self.showYears = ko.observable(true);
    self.showDetails = ko.observable(false);
    
    self.categories = ko.observableArray(data.categories);

    self.years = ko.observableArray([2016, 2017, 2018, 2019]);
    self.months = ko.observableArray(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

    self.setYear = function(el) {
        self.selectedYear(el);   
        self.showYears(false);
    }

    self.setMonth = function(el) {
        self.selectedMonth(el);
    }

    self.menuBack = function() {
        self.showYears(true);
        self.selectedYear(null);
        self.selectedMonth(null);
    }

    self.goToDetails = function(el, evt) {
        $(evt.currentTarget).addClass("fullsize");
        setTimeout(function() {
            self.showDetails(true);
        }, 1000);
    }

    self.goToOverview = function() {
        self.showDetails(false);
    }
}

ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

function getInitData() {
    return ;
}



