/*global userAgent:false*/
/*global hideKeyboard:false*/
/*jshint camelcase: false */
'use strict';
EarnSmartApp.controller('NewOrderCtrl',function($scope,$http,$filter,cart,screen,SQLUtil,BaseService,createDialog,myToast,visits,Configs,CountService,Analytics){
  $scope.items={};
  $scope.cart= cart;
  $scope.Configs=Configs;
  $scope.ITEMLIST=1;
  $scope.ORDERS=2;
  $scope.promasList=[];
  $scope.deleteItems      = [];
  $scope.cart = cart;
  $scope.numpad=false;
  $scope.pad = ['1', '2', '3','4', '5', '6','7', '8', '9','0', '.', '<'];
  $scope.quantity = '';
  $scope.selectedItem={};
  $scope.selectionType='';
  $scope.prate=[];
  $scope.contentLoaded=false;
  $scope.concurrentMiss=0;
  $scope.menu= false;
  $scope.searchOn='item name';
  $scope.amountAfterDiscount=0;
  $scope.isOffline=false;
  $scope.menuaction = function(){
    $scope.menu = !$scope.menu;
  };
  $scope.menuFalse = function(){
    $scope.menu = false;
  };
  $scope.$watch('cart.order.sohcdis',function(value){
    if(value>0){
      $scope.amountAfterDiscount=$scope.total-(($scope.total*value)/100);
    }
  });
  var fieldName='prodname';
  var baseQuery='';
  var filterQuery='';
  var limit=' ORDER BY prodName LIMIT 30 ';
  var conditionStr ='';
  if ($scope.Configs.companyDetails.companyCode===$scope.Configs.companyDetails.transactionCode) {
    conditionStr = ' and compcode="'+$scope.Configs.companyDetails.companyCode+'"';
  }
  baseQuery='SELECT * FROM PromasList where isactive=1 ' + conditionStr ;
  filterQuery=baseQuery + limit;
  SQLUtil.serialized(filterQuery).then(function(callback){
    $scope.promasList = callback;
    $scope.contentLoaded=true;
  });
  $scope.searchOption=function(option){
    if (option===2) {
      $scope.opt='pcode';
      fieldName='prodcode';
      $scope.searchOn='item code';
    } else if (option===3) {
      $scope.opt='drug';
      fieldName='drugName';
      $scope.searchOn='drug name';
    } else if (option===4) {
      $scope.opt='alias';
      fieldName='aliasCode';
      $scope.searchOn='alias code';
    } else {
      $scope.opt='';
      fieldName='prodfullName';
      $scope.searchOn='item name';
    }
    $scope.menu=false;
  };
  //Searching the  item
  $scope.searchChange=function(){
    if ($scope.searchItem.length) {
      filterQuery= baseQuery + ' and ' + fieldName + ' MATCH "' + $scope.searchItem +'*"';
    } else {
      filterQuery= baseQuery;
    }
    filterQuery=filterQuery + limit;
    SQLUtil.serialized(filterQuery).then(function(callback){
      $scope.promasList = callback;
    });
  };
  $scope.popping= function(){
    $scope.popOver=true;
  };


  if($scope.cart.order.items.length){
    $scope.total=parseFloat(cart.orderTotal().toFixed(2));
    cart.order.amount =$scope.total;
  }
  var onConfirmNext=function(buttonIndex){
    $scope.$apply(function(){
      if (buttonIndex===2){
        cart.reset();
        Analytics.trackEvent('Button','Click','Delete Order',1);
        screen.load('/');
      }
    });
  };
  //moveBAck functionality
  $scope.moveBack = function(){
    if ($scope.cart.order.items.length && true && (/(android)/.test(userAgent)  || /(ipad|iphone|ipod)/.test(userAgent))) {
      var button=['No','Yes'];
      navigator.notification.confirm(
      'Do you wish to delete the order?',  // message;
      onConfirmNext,         // callback
      'Cancel Order',            // title
      button               // buttonName
      );
    }else{
      $scope.cart.stock=[];
      $scope.cart.marketNeed=[];
      $scope.cart.order.items=[];
      screen.load('/customer_details');
    }
  };
  //loading the cartItems in orders view
  $scope.loadOrderDetails= function(){
    $scope.cart.viewStatus.view = $scope.ORDERS;
  };
  //Loading the list of items
  $scope.loadItems = function(){
    $scope.cart.viewStatus.view = $scope.ITEMLIST;
  };

  $scope.clearSearch=function(){
    $scope.searchItem='';
    $scope.searchChange();
  };

  //saving the order to localstorage and posting the order to the server
  $scope.saveOrder=function(){
    if((cart.order.sohcdis>Configs.configList.cdiscLimit && Configs.configList.cdiscLimit>0 )|| cart.order.sohcdis>99.99){
      myToast.toast('Cash Discount limit is Exceeded','short');
      return ;
    }
    hideKeyboard();
    if(cart.order.sohcdis===null){
      cart.order.sohcdis=0;
    }
    $scope.contentLoaded=false;
    var offlineOrders = JSON.parse(localStorage.getItem('offlineOrders'));
    var orders =[];
    var order={};
    angular.copy($scope.cart.order, order);
    if($scope.Configs.companyDetails.companyCode!==$scope.Configs.companyDetails.transactionCode){
      var companyList = JSON.parse(localStorage.getItem('companyList')).companyList;
      companyList.forEach(function(company){
        if(company.companyCode!=='c0'){
          var companywiseOrder={};
          companywiseOrder.items=$filter('filter')(order.items,{retailoutletid:company.companyCode});
          companywiseOrder.amount=0;
          companywiseOrder.items.forEach(function(item){
            companywiseOrder.amount=companywiseOrder.amount+item.sodamount;
          });
          if(companywiseOrder.items.length){
            companywiseOrder = {
              repid :order.repid,
              compid :company.companyCode,
              ccode :order.ccode,
              sohmulticompanycode :order.sohmulticompanycode,
              trdate :order.trdate,
              sohautobill:order.sohautobill,
              amount :companywiseOrder.amount,
              visitid:order.visitid,
              retailoutletid:order.retailoutletid,
              sohrefno:order.sohrefno,
              remarks:order.remarks,
              sohcdis:order.sohcdis,
              sohmastercompany:order.sohmastercompany,
              portid:$filter('filtermatch')(JSON.parse(localStorage.getItem('configList')).configList,{cmpcode:company.companyCode})[0].txtes_portid,
              items:companywiseOrder.items,
              ts:order.ts
            };
            if(Configs.companyDetails.companyCode ==='c0' && Configs.companyDetails.transactionCode===companywiseOrder.compid){
              companywiseOrder.sohmastercompany='';
            }else{
              companywiseOrder.sohmastercompany='1';
            }
            orders.push(companywiseOrder);
          }
        }
      });
    }else{
      orders.push(order);
    }
    orders.forEach(function(order){
      offlineOrders.offlineOrders.push(order);
    });
    localStorage.setItem('offlineOrders',JSON.stringify(offlineOrders));
    //Posting the data to the server
    orders.forEach(function(order,index){
      BaseService.post('SalesOrder','',JSON.stringify(order),0,10000).then(function(callback){
        if(callback){
          offlineOrders = JSON.parse(localStorage.getItem('offlineOrders'));
          angular.forEach(offlineOrders.offlineOrders,function(offlineOrder,index){
            if (offlineOrder.sohrefno===cart.order.sohrefno && offlineOrder.compid===order.compid){
              offlineOrders.offlineOrders.splice(index,1);
            }
          });
          localStorage.setItem('offlineOrders',JSON.stringify(offlineOrders));
          var desc='Order place for the customer'+$scope.Configs.customer.custName;
          visits.location('ORDER',desc,'SAVE',order.sohrefno,order.compid,order.repid,order.ccode).then(function(data){
            if(data==='0' || data.error){
              myToast.toast('Not able to save place information','short');
            }
          });
          CountService.setMessageCount(Configs.repDetails.repcell);   //to get message and visit count
          if($scope.Configs.companyDetails.companyCode!==$scope.Configs.companyDetails.transactionCode){
            myToast.toast('Order number '+callback+' is created for the company '+order.compid,'short');
          }else{
            myToast.toast('Order number '+callback+' is created ','short');
          }
        } else {
          Analytics.trackEvent('Button','Click','Offline Order',1);
          myToast.toast('Connection not available. Order saved in local data','short');
        }
        var todayStatistics =JSON.parse(localStorage.getItem('todayStatistics'));
        todayStatistics.todayOrders++ ;
        todayStatistics.todayOrdersAmount = todayStatistics.todayOrdersAmount + cart.order.amount;
        localStorage.setItem('todayStatistics',JSON.stringify(todayStatistics));
        SQLUtil.executeSql('UPDATE CustomerList SET noorderRemarks="'+' '+'" WHERE custcode= "'+order.ccode+'" AND compcode="'+order.compid+'"');
        $scope.contentLoaded=true;
        if(index===(orders.length-1)){
          Analytics.trackEvent('Button','Click','Save Order',1);
          cart.reset();
          screen.load('/');
        }
      });
    });
  };
  //Removing the particular item from the cart
  $scope.removeCartItem = function(index){
    $scope.contentLoaded=true;
    Analytics.trackEvent('Button','Click','Delete item',1);
    var cartLength = $scope.deleteItems.length;
    if (cartLength>index){
      var i = index;
      while (i < cartLength){
        $scope.deleteItems[i]=$scope.deleteItems[i+1];
        i++;
      }
    }
    cart.deleteItem(index);
    $scope.total=parseFloat(cart.orderTotal().toFixed(2));
    cart.order.amount =$scope.total;
  };
  //All items edit
  $scope.allDetailsEdit=function(prodCode,cmpcode,cartIndex){
    if(cart.getItemDetails(prodCode,cmpcode,'quantity')){
      if($scope.Configs.configList.editItemDetailsInES){
        if(!cartIndex){
          var item = $filter('filtermatch')($scope.cart.order.items,{sodpcode:prodCode});
          item=$filter('filtermatch')(item,{retailoutletid:cmpcode});
          cartIndex=$scope.cart.order.items.indexOf(item[0]);
        }
        Analytics.trackEvent('Button','Click','Item edit',1);
        screen.load('/item/'+prodCode+ '/' + cartIndex);
      }else{
        myToast.toast('Item edit details are not enabled','short');
      }
    }else{
      myToast.toast('Item is not selected','short');
    }
  };
  //Editing the quantity and the rate of the particular item
  $scope.openNumpad = function(item,itemFrom){
    hideKeyboard();
    $scope.selectedItem = item;
    $scope.itemFrom = itemFrom;
    $scope.freeQuantity=0;
    $scope.numpad=true;
    var prodCode ='';
    var cmpCode ='';
    if(itemFrom==='cart'){
      $scope.itemName=item.sodpname;
      prodCode=item.sodpcode;
      cmpCode=item.retailoutletid;
    }else{
      $scope.itemName=item.prodName;
      prodCode=item.prodCode;
      cmpCode=item.compcode;
    }
    if(cart.getItemDetails(prodCode,cmpCode,'quantity')){
      $scope.quantity = cart.getItemDetails(prodCode,cmpCode,'quantity');
      $scope.quantity = $scope.quantity.toString();
    }else{
      $scope.quantity='';
    }
    if($scope.concurrentMiss<2){
      BaseService.get('OfferList','isoffer=0&cmpname='+cmpCode+'&pcode='+prodCode,0,2000,function(data){
        if(data.offerList){
          $scope.cart.stock[prodCode]=data.offerList[0].totstock;
          $scope.concurrentMiss=0;
        }
        else{
          $scope.concurrentMiss++;
          if(itemFrom==='List'){
            $scope.cart.stock[prodCode]=$scope.selectedItem.totStock;
          }
        }
        if($scope.concurrentMiss===2){
          $scope.isOffline=true;
        }
      });
    }else{
      $scope.isOffline=true;
      if(itemFrom==='List'){
        $scope.cart.stock[prodCode]=$scope.selectedItem.totStock;
      }
    }
  };
  //Adding the particular item to the cart and rate editing
  $scope.addItem = function(value,itemFrom){
    var ccode='';
    var pcode='';
    if(itemFrom==='List'){
      ccode = $scope.selectedItem.compcode;
      pcode = $scope.selectedItem.prodCode;
    }else{
      ccode=$scope.selectedItem.retailoutletid;
      pcode = $scope.selectedItem.sodpcode;
    }
    if(parseFloat(value)>0){
      cart.addItem($scope.selectedItem,parseFloat(value),itemFrom);
      $scope.cart.marketNeed[pcode]=false;
      if($scope.cart.stock[pcode] < parseFloat(value) ){
        var orderInfo={};
        orderInfo.repid=cart.order.repid;
        orderInfo.compid=ccode;
        orderInfo.ccode=cart.order.ccode;
        orderInfo.sohrefno=cart.order.sohrefno;
        orderInfo.sohpcode=pcode;
        orderInfo.sohaskqty=parseFloat(value);
        orderInfo.sohstock=$scope.cart.stock[pcode];
        $scope.cart.marketNeed[pcode]=true;
        BaseService.post('OrderInfo/Qtyinsert','',JSON.stringify(orderInfo),0,10000);
      }
      $scope.quantity='';
      $scope.numpad=false;
    } else {
      if(cart.getItemDetails(pcode,ccode,'quantity')){
        cart.order.items.forEach(function(item,index){
          if(pcode===item.sodpcode){
            cart.deleteItem(index);
          }
        });
      }
      $scope.numpad=false;
    }
    $scope.total=parseFloat(cart.orderTotal().toFixed(2));
    cart.order.amount =$scope.total;
  };
//Functions for the quantity view
  $scope.add = function(item) {
    if (item === '<') {
      $scope.remove();
    }else if(item==='.' && $scope.Configs.configList.chkdecimalqty===0){
      myToast.toast('Decimal not allowed','short');
    } else {
      var qty = $scope.quantity + item;
      if(parseFloat(qty)<99999.00){
        $scope.quantity=qty;
      }else{
        myToast.toast('Limit Exceeded','short');
      }
    }
  };
  //for the number remove in numpad
  $scope.remove = function() {
    var len = $scope.quantity.length;
    if(len>1){
      $scope.quantity = $scope.quantity.slice(0,len-1);
    }else{
      $scope.quantity ='';
    }
  };
  //OfferList table
  $scope.offerList = function(item){
    $scope.contentLoaded=false;
    Analytics.trackEvent('Button','Click','OfferList',1);
    BaseService.deferredGet('OfferList','isoffer=1&cmpname='+$scope.Configs.companyDetails.transactionCode+'&pcode='+item.prodCode).then(function(data){
      if(data.offerList){
        $scope.contentLoaded=true;
        var offerList = data.offerList[0];
        createDialog({
          id: 'simpleDialog',
          template:

          '<table class="popupTable">'+'<tr><th >QTY</th><th>FREE</th><th>DIS</th></tr>'+
          '<tr><td>'+offerList.offer1qty+'</td><td>'+offerList.offer1fqty+'</td><td>'+offerList.offer1pdisc+'</td></tr>'+
          '<tr><td>'+offerList.offer2qty+'</td><td>'+offerList.offer2fqty+'</td><td>'+offerList.offer2pdisc+'</td></tr>'+
          '<tr><td>'+offerList.offer3qty+'</td><td>'+offerList.offer3fqty+'</td><td>'+offerList.offer3pdisc+'</td></tr>'+
          '<tr><td>'+offerList.offer4qty+'</td><td>'+offerList.offer4fqty+'</td><td>'+offerList.offer4pdisc+'</td></tr>'+
          '</table>',
          title: item.prodName,
          backdrop: true,
          success: {label: 'Success', fn: function() {}}
        });
      }else{
        $scope.contentLoaded=true;
      }
    });
  };
  Analytics.trackPage('NewOrder');
});
