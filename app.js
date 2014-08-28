
'use strict';
var userAgent = navigator.userAgent.toLowerCase();
var gaPlugin;
if (true && (/(android)/.test(userAgent) || /(ipad|iphone|ipod)/.test(userAgent))) {
  document.addEventListener('deviceready', function() {
    gaPlugin = window.plugins.gaPlugin;
    gaPlugin.init(null,null,'UA-1312621-18',10);
    console.log(userAgent);
    angular.bootstrap(document, [ 'EarnSmartApp' ]);
    document.addEventListener('backbutton', function(){}, false);
  }, false);
}else {
  console.log('Bootstrapping EarnSmartApp for non-android devices');
  setTimeout(function() {
    gaPlugin = window.plugins.gaPlugin;
    gaPlugin.init(null,null,'UA-1312621-18',10);
    angular.bootstrap(document, [ 'EarnSmartApp' ]);
  },500);
}

var EarnSmartApp = angular.module('EarnSmartApp', ['ngMobile','gf.sqlitewrapper','ui.bootstrap','gf.utils','ngCookies','geolocation','google-maps','angular-md5','ngProgress']);
EarnSmartApp.config(function($routeProvider,$httpProvider) {
  $routeProvider.when('/', {
    templateUrl : 'views/home.html',
    controller: 'HomeCtrl'
  }).when('/main',{
    templateUrl:'views/main.html',
    controller:'MainCtrl'
  }).when('/server_settings',{
    templateUrl:'views/server_settings.html',
    controller:'ServerSettingsCtrl'
  }).when('/login',{
    templateUrl:'views/login.html',
    controller:'LoginCtrl'
  }).when('/company_list',{
    templateUrl:'views/companyList.html',
    controller:'CompanyListCtrl'
  }).when('/customer_list',{
    templateUrl:'views/customerList.html',
    controller:'CustomerListCtrl'
  }).when('/customer_details',{
    templateUrl:'views/customerDetails.html',
    controller:'CustomerDetailsCtrl'
  }).when('/new_order',{
    templateUrl:'views/newOrder.html',
    controller:'NewOrderCtrl'
  }).when('/item/:prodCode/:index',{
    templateUrl:'views/item.html',
    controller:'ItemCtrl'
  }).when('/new_receipt',{
    templateUrl:'views/newReceipt.html',
    controller:'NewReceiptCtrl'
  }).when('/payment_type',{
    templateUrl:'views/paymentType.html',
    controller:'PaymentTypeCtrl'
  }).when('/adjustments',{
    templateUrl:'views/adjustments.html',
    controller:'AdjustmentsCtrl'
  }).when('/messages',{
    templateUrl:'views/messages.html',
    controller:'MessagesCtrl'
  }).when('/reports',{
    templateUrl:'views/reports.html',
    controller:'ReportsCtrl'
  }).when('/report_filter',{
    templateUrl:'views/report_filter.html',
    controller:'ReportFilterCtrl'
  }).when('/outstanding_report',{
    templateUrl:'views/outstanding_report.html',
    controller:'OutstandingReportCtrl'
  }).when('/visits_report',{
    templateUrl:'views/visits_report.html',
    controller:'VisitsReportCtrl'
  }).when('/report_subdetails',{
    templateUrl:'views/report_subdetails.html',
    controller:'ReportSubDetailsCtrl'
  }).when('/offline_order_report',{
    templateUrl:'views/offline_order_report.html',
    controller:'OfflineOrderReportCtrl'
  }).when('/report_summary',{
    templateUrl:'views/report_summary.html',
    controller:'ReportSummaryCtrl'
  }).when('/report_details',{
    templateUrl:'views/report_details.html',
    controller:'ReportDetailsCtrl'
  }).when('/places_visited',{
    templateUrl:'views/placesVisited.html',
    controller:'PlacesVisitedCtrl'
  }).when('/analytics',{
    templateUrl:'views/Analytics.html',
    controller:'AnalyticsCtrl'
  }).when('/dashboard',{
    templateUrl:'views/dashboard.html',
    controller:'DashboardCtrl'
  }).when('/analytics_summary',{
    templateUrl:'views/Analytics_summary.html',
    controller:'AnalyticsSummaryCtrl'
  }).when('/analytics_details',{
    templateUrl:'views/analytics_details.html',
    controller:'AnalyticsDetailsCtrl'
  }).otherwise({
    redirectTo: '/'
  });

  // Authentication interceptor
  var interceptor = ['$rootScope','$location', '$q', function($rootScope,$location, $q) {
    function success(response) {
      return response;
    }

    function error(response) {
      if(response.status === 401 && !$rootScope.loginprocess) {
        $location.path('/login');
      }
      return $q.reject(response);
    }

    return function(promise) {
      return promise.then(success, error);
    };
  }];
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common['Requested-With'] = '260';
  $httpProvider.responseInterceptors.push(interceptor);

});

// Moment js configuration
moment.lang('en', {
  relativeTime : {
    future: 'in %s',
    past:   '%s ago',
    s:  'secs',
    m:  'a min',
    mm: '%d mins',
    h:  'an hour',
    hh: '%d hours',
    d:  'a day',
    dd: '%d days',
    M:  'a month',
    MM: '%d months',
    y:  'a year',
    yy: '%d years'
  }
});
