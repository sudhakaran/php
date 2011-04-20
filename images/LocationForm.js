
function addLocationEventHandlers(){$(".zip_code").autocomplete($("link[rel='baseurl']").attr('href')+"Page/AjaxInternationalZip/",{width:($('.zip_code').width()>1)?($('.zip_code').width()+13):171,delay:350,scroll:false,max:10,extraParams:{"ignoreCML":1},dataType:'json',parse:function(data){var row=new Array();for(var i=0;i<data.length;i++)
{row[row.length]={data:data[i],value:data[i].name,result:data[i].name};}
return row;},formatItem:function(row){return row.name;}});$(".zip_code").result(function(event,data,formatted){$(this).parents(".zip_container").children(".zip_hidden").val(data.value);});$(".zip_code.noclearField").click(function(){$(this).val("");$(this).parents(".zip_container").children(".zip_hidden").val("");});}
function doLocationBasedDomReady(){addLocationEventHandlers();}
$(document).ready(function(){doLocationBasedDomReady();});