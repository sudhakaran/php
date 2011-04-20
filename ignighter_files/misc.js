
function brandpopPositioningFix()
{$('iframe').each(function(){var source_str=$(this).attr('src');if(source_str&&source_str.match(/ultraofferwall.com\/brandpop/))
{if($.browser.msie)
{$that=$(this).parent('div');$that.css('position','absolute');$(window).bind('scroll',function(){$that.css('top',$(this).scrollTop()+($(this).height()-25)+"px");});}
else
$(this).parent('div').css('position','fixed');}});}
$("img.hoverStyle, input.hoverStyle, a.hoverStyle img, a.hoverStyle").live('mouseover mouseout',function(event){if(!$(this).hasClass('disabled'))
{if(event.type=='mouseover'){$(this).addClass('imgHoverEffects');}else{$(this).removeClass('imgHoverEffects');}}});$("img.hoverStyle, input.hoverStyle, a.hoverStyle img, a.hoverStyle").live('mousedown',function(){if(!$(this).hasClass('disabled'))
{$(this).addClass('imgPressEffects');}});$("img.hoverStyle, input.hoverStyle, a.hoverStyle img, a.hoverStyle").live('mouseup',function(){if(!$(this).hasClass('disabled'))
{$(this).removeClass('imgPressEffects');}});function turnOffAutoCompleteForChrome()
{var is_chrome=navigator.userAgent.toLowerCase().indexOf('chrome')>-1;if(is_chrome)
turnOffAutoComplete();}
function turnOffAutoComplete()
{$('.turnOffAutoComplete').attr('autocomplete','off');}
$(document).ready(function(){turnOffAutoCompleteForChrome();brandpopPositioningFix();setTimeout('brandpopPositioningFix();',1000);setTimeout('brandpopPositioningFix();',2000);$('#keywords').live('keydown',function(event){if($.browser.msie)
{if(event==undefined)
event=window.event;var code=event.keyCode;if(code==13)
$('#s_search').click();}});$('#start_group_form .submit_button').click(function(){if($('#uploadPhoto').val()==""&&$('#groupPhotoID').val()==0)
{$().notification({content:"No Photo was uploaded. Please try again or click 'skip this step'.",classes:['error'],contentClasses:['container_16'],closeButton:true,closeTimeout:2500});return false;}
return true;});$('.enter_reason').live('blur',function(e){var defaultVar='Enter reason here...';if($(this).val()=='')
$(this).val(defaultVar);});$('.enter_reason').live('focus',function(e){var defaultVar='Enter reason here...';if($(this).val()==defaultVar)
$(this).val('');});});