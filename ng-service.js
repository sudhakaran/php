'use strict';

EarnSmartApp.service('cart', function Cart( $rootScope, $http,$filter,Configs) {
  //common variables
  var self        = this;
  var sno         = 0;
  //Order usage variables
  var refno = 0;
  self.order      ={};
  self.viewStatus = {view:1};
  self.stock=[];
  self.marketNeed=[];
  //Receipt usage variables
  var vocherRefno = 0;
  self.receipt = {};
  self.chqOptionExpiredBills=[];
  self.wardaysBills=[];
  self.lockedBills=[];

 //Order functions
 // Add quantity for a particular item (called from item view)
  self.addItem = function(item,quantity,itemFrom){
    var ts = moment().format('YYYY-MM-DD hh:mm:ss');
    var dt=moment().format('YYYY-MM-DD');
    var added = false;
    var prodCode='';
    var cmpCode='';
    self.order.trdate=dt;
    self.order.ts=ts;
    if(itemFrom==='List'){
      prodCode=item.prodCode;
      cmpCode=item.compcode;
    }else {
      prodCode=item.sodpcode;
      cmpCode=item.retailoutletid;
    }
    //Updating the amount and quantity of the item from the cart
    if (self.order.items){
      self.order.items.forEach(function(cartItem) {
        if (cartItem.sodpcode ===prodCode && cartItem.retailoutletid===cmpCode) {
          added = true;
          cartItem.sodqty=quantity;
          cartItem.sodamount=parseFloat((quantity* cartItem.sodrate).toFixed(2));
        }
      });
    }
    //Add the item to the cart
    if (!added){
      sno ++;
      self.order.items.push({sodsno:sno, sodpname:item.prodName,sodpcode:item.prodCode, sodpack:item.pack,sodqty:quantity,sodfqty:0,sodrate
        :parseFloat(item.srate.toFixed(2)),actuvalsrate:parseFloat(item.srate.toFixed(2)),sodprate:parseFloat(item.prate.toFixed(2)),sodmrp:parseFloat(item.mrp.toFixed(2)), sodpackcode: 0,ts:ts,sodamount:parseFloat((item.srate*quantity).toFixed(2)),retailoutletid:item.compcode,sodpdis:0,sodpdisamt:0});
    }
  };

  //Delete the item from the cart (called from the orders view)
  self.deleteItem = function(index){
    self.order.items.splice(index, 1);
  };

  //calculate the order total
  self.orderTotal = function(){
    var amount = 0 ;
    self.order.items.forEach(function(item){
      item.sodamount=item.sodqty * item.sodrate-item.sodpdisamt;
      amount = amount + item.sodamount;
    });
    return amount;
  };

  //get the Item details like quantity,rate,free quantity
  self.getItemDetails = function(prodCode,cmpcode,returnParam){
    var items = $filter('filtermatch')(self.order.items,{sodpcode:prodCode});
    items =$filter('filtermatch')(items,{retailoutletid:cmpcode});
    if (items && items.length){
      if(returnParam==='rate'){
        return items.reduce(function(sum,item){ return sum + parseFloat(item.sodrate);},0);
      }else if(returnParam==='freeQuantity'){
        return items.reduce(function(sum,item){ return sum + item.sodfqty;},0);
      }else if(returnParam==='quantity'){
        return items.reduce(function(sum,item){ return sum + item.sodqty;},0);
      }
    }else{
      return 0;
    }
  };

  //Receipt Functions
  //add the bill in Receipts
  self.editReceipt = function(billDetails){
    var added = false ;
    var amount = self.receipt.amount;
    self.receipt.trdate = moment().format('YYYY-MM-DD');
    //Deletion of the receipt from the cart
    if(self.receipt.adjustedbilldetails){
      self.receipt.adjustedbilldetails.forEach(function(cartBill,index){
        if(billDetails.invseqno===cartBill.billseqno){
          added =true;
          self.adjustments =self.adjustments - cartBill.actadjustedamount;
          self.balance  = self.balance   + cartBill.actadjustedamount ;
          self.receipt.adjustedbilldetails.splice(index, 1);
          var billIndex =self.chqOptionExpiredBills.indexOf(billDetails.invno);
          if(billIndex!==null){
            self.chqOptionExpiredBills.splice(billIndex,1);
          }
          if(self.wardaysBills.indexOf(billDetails.invno)!==null){
            self.wardaysBills.splice(self.wardaysBills.indexOf(billDetails.invno),1);
          }
          if(self.lockedBills.indexOf(billDetails.invno)!==null){
            self.lockedBills.splice(self.wardaysBills.indexOf(billDetails.invno),1);
          }
        }
      });
    }
    //Adding the receipt to the cart
    if((self.receiptTotal()<(self.receipt.amount) && !added)  || (self.receipt.amount===0 && !added) ){
      sno++;
      var remainingAmount = billDetails.invbal;
      if(self.receipt.amount>0){
        if((amount-self.receiptTotal())<remainingAmount){
          remainingAmount = (amount-self.receiptTotal());
        }
      }
      self.adjustments = remainingAmount +self.adjustments;
      self.balance  = self.balance   - remainingAmount ;
      self.receipt.adjustedbilldetails.push({billseqno:billDetails.invseqno,billrefno:billDetails.invno,billdate:moment(billDetails.invdate).format('YYYY-MM-DD'),adjustedamount:remainingAmount,actadjustedamount:remainingAmount,discperc:billDetails.discperc,discamt:billDetails.billdiscount,shortage:0,excess:0});
      if(Configs.customer.custchqpymtdays>0 && billDetails.agedays>Configs.customer.custchqpymtdays){
        self.chqOptionExpiredBills.push(billDetails.invno);
      }else if(Configs.configList.txtwardays>0 && billDetails.agedays>Configs.configList.txtwardays){
        self.wardaysBills.push(billDetails.invno);
      }else if(Configs.configList.txtlockdays>0 && billDetails.agedays>Configs.configList.txtlockdays){
        self.lockedBills.push(billDetails.invno);
      }
    }
  };

  //Caluculating the total based on the perceantage discount
  self.discountAdd = function(billId,discPer,discAmt,shortage,excess){
    self.receipt.adjustedbilldetails.forEach(function(bill){
      if(billId===bill.billseqno){
        self.balance = self.balance - ((bill.discperc *bill.adjustedamount)/100) -bill.shortage - bill.excess ;
        self.adjustments = self.adjustments+((bill.discperc *bill.adjustedamount)/100)+bill.shortage-bill.excess;
        bill.discperc = discPer ;
        bill.shortage = shortage ;
        bill.excess = excess ;
        bill.discamt=discAmt;
        bill.actadjustedamount =  bill.adjustedamount + bill.excess - bill.shortage - ((bill.discperc *bill.adjustedamount)/100);
        self.balance = self.balance + ((bill.discperc *bill.adjustedamount)/100) + bill.shortage - bill.excess ;
        self.adjustments = self.adjustments - ((bill.discperc *bill.adjustedamount)/100)- (bill.shortage)+ (bill.excess);
      }
    });
  };

  //Caluclation of the receipt total in the billwise adjustments
  self.receiptTotal = function(){
    var amount = 0 ;
    if(self.receipt.adjustedbilldetails){
      self.receipt.adjustedbilldetails.forEach(function(bills){
        amount = parseFloat(bills.actadjustedamount)+ amount ;
      });
    }
    return amount ;
  };


  //get the billDetails whether is present in the cart or not
  self.getBilldetails= function(invseqno,info){
    var bills = $filter('filtermatch')(self.receipt.adjustedbilldetails,{billseqno:invseqno});
    if (bills && bills.length && info==='inCart' ){
      return 1;
    }else if(bills && bills.length && info==='discount'){
      return  bills.reduce(function(sum,bills){ return sum +((bills.discperc *bills.adjustedamount)/100);},0);
    }else if(bills && bills.length && info==='afterBilledit'){
      return  bills.reduce(function(sum,bills){ return sum +bills.actadjustedamount;},0);
    }else{
      return 0;
    }
  };

  // Initialize cart
  self.Init = function(repId,comid,custCode,multicompanyCode,onlineautobill,portId){
    sno = 0;
    refno++;
    self.viewStatus = {view:1};
    self.order = {
      repid :repId,
      compid :comid,
      ccode :custCode,
      sohmastercompany:'',
      sohmulticompanycode :multicompanyCode,
      trdate :'',
      sohautobill:onlineautobill,
      items : [],
      amount :0,
      visitid:0,
      retailoutletid:comid,
      sohrefno:refno,
      remarks:'',
      sohcdis:0,
      portid:portId
    };
    self.stock=[];
    self.marketNeed=[];
  };
  //Initialization of the receipt
  self.receiptInit = function(repId,comId,custCode,empId,isDE){
    vocherRefno++;
    self.billwiseAdjustments=false;
    sno = 0 ;
    self.receipt = {
      isde:isDE,
      compid:comId,
      repid:repId,
      empid:empId,
      ccode:custCode,
      refvoucherno:vocherRefno,
      trdate:'',
      amount:0,
      discount:0,
      paymentmode:'cash',
      counter:'mobile',
      chequebankid:'',
      chequeno:'',
      chequedt:'',
      isonacc:0,
      remarks:'',
      billadjustmentmode:'manual',
      adjustedbilldetails:[],
      dbnotermks:''
    };
    self.chqOptionExpiredBills=[];
    self.wardaysBills=[];
    self.lockedBills=[];
  };
  // Reset cart
  self.reset = function() {
    //Initialization hardcoded
    self.Init(0,0,0,0,0,0);
    self.receiptInit(0,0,0,0);
  };

  // Save cart information in localstorage
  var createPersistentProperty = function(localName,storageName,Type,cartFor) {
    var json = localStorage[storageName];

    var orderCart = function(){
      self.order[localName] = json ? JSON.parse(json) : new Type();
      $rootScope.$watch(
        function() {return self.order[localName];},
        function(newvalue,oldvalue) {
          if (newvalue!==oldvalue) {
            localStorage[storageName] = JSON.stringify(newvalue);
          }
        },true);
    };

    var receiptCart = function(){
      self.receipt[localName] = json ? JSON.parse(json) : new Type();
      $rootScope.$watch(
        function() {return self.receipt[localName];},
        function(newvalue,oldvalue) {
          if (newvalue!==oldvalue) {
            localStorage[storageName] = JSON.stringify(newvalue);
          }
        },true);
    };
    if(cartFor===1){
      orderCart();
    } else if(cartFor===2){
      receiptCart();
    } else{
      orderCart();
      receiptCart();
    }
  };
  createPersistentProperty('items','cartItems', Array,1);
  createPersistentProperty('repid','repId', Number,0);
  createPersistentProperty('compid','compId', String,0);
  createPersistentProperty('ccode','custCode', String,0);
  createPersistentProperty('sohmulticompanycode','multiCode',String,1);
  createPersistentProperty('trdate','Date', String,0);
  createPersistentProperty('amount','amount', Number,0);
  createPersistentProperty('remarks','Remarks', String,0);
  createPersistentProperty('adjustedbilldetails','BillDetails', Array,2);
  // Set sno to max of sno if cart is available
  if (self.order.items.length){
    angular.forEach(self.order.items, function(item){
      if (item.sno > sno){
        sno = item.sno;
      }
    });
  }
});
