/*-------------------------------------------------------------------------



	Theme Name: Cutting Edge

	

-------------------------------------------------------------------------*/



$(document).ready(function () {

	/*vars used throughout*/

	var wh,

		scrollSpeed = 1000,

		parallaxSpeedFactor = 0.6,

		scrollEase = 'easeOutExpo',

		targetSection,

		sectionLink = 'a.navigateTo',

	 	section = $('.section');





//INIT--------------------------------------------------------------------------------/

	if (isMobile == true) {

		$('.header').addClass('mobileHeader');	//add mobile header class

		$('.statGrid').addClass('statGridMobile');

	} else {

		$('.page').addClass('desktop');

		$('.parallax').addClass('fixed-desktop');

	}





//MENU --------------------------------------------------------------------------------/

	$(".menu a").click(function () {

        $("html, body").animate({

            scrollTop: $($(this).attr("href")).offset().top + "px"

        }, {

            duration: 1000,

            easing: "swing"

        });

        return false;

    });



//DIRECTIONAL HOVER --------------------------------------------------------------------/  

 	$(function() {

    	$('.da-thumbs > article').hoverdir();

	});

   



//PARALLAX ----------------------------------------------------------------------------/

	$(window).bind('load', function () {

		parallaxInit();						  

	});



	function parallaxInit() {

		if (isMobile == true) return false;

		$('#parallax-1').parallax();

		$('#parallax-2').parallax();

		$('#parallax-3').parallax();

		$('#parallax-4').parallax();

		$('#parallax-5').parallax();

		$('#parallax-6').parallax();

		$('.imageClip').parallax();

		/*add as necessary*/

	}





//HOMEPAGE SPECIFIC -----------------------------------------------------------------/

	function sliderHeight() {

		wh = $(window).height();

		$('#homepage').css({height: wh});

	}

	sliderHeight();

	



//FORM PLACEHOLDER -----------------------------------------------------------------/

	$(".formField").focus(function(){

    	if($(this).val()==$(this).attr('title')){

        	$(this).val('');

        }

    });

    $(".formField").blur(function(){

    	if($(this).val()==''){

       		$(this).val($(this).attr('title'));

       	}

    });

    $(".formField").blur();





//ACCORDION ------------------------------------------------------------------------/



	(function () {



		var $container = $('.accContainer'),

			$trigger   = $('.accTrigger');

			fullWidth = $container.outerWidth(true);



		$container.hide();

		$trigger.first().addClass('active').next().show();



		$trigger.css('width', fullWidth - 2);

		$container.css('width', fullWidth - 2);



		$trigger.on('click', function (e) {

			if ($(this).next().is(':hidden') ) {

			$trigger.removeClass('active').next().slideUp(300);

			$(this).toggleClass('active').next().slideDown(300);

			}

			e.preventDefault();

		});



		// Resize

		$(window).on('resize', function () {

			fullWidth = $container.outerWidth(true)

			$trigger.css('width', $trigger.parent().width());

			$container.css('width', $container.parent().width());

		});



	})();



//SUPERSIZED SLIDESHOW -----------------------------------------------------------------/

	$.supersized({



		// Functionality

		slideshow               :   1,			// Slideshow on/off

		autoplay				:	1,			// Slideshow starts playing automatically

		start_slide             :   1,			// Start slide (0 is random)

		stop_loop				:	0,			// Pauses slideshow on last slide

		random					:	0,			// Randomize slide order (Ignores start slide)

		slide_interval          :   5000,		// Length between transitions

		transition				:	2, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left

		transition_speed		:	600,		// Speed of transition

		new_window				:	1,			// Image links open in new window/tab

		pause_hover             :   0,			// Pause slideshow on hover

		keyboard_nav            :   1,			// Keyboard navigation on/off

		performance				:	1,			// 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)

		image_protect			:	1,			// Disables image dragging and right click with Javascript



		// Size & Position

		min_width				:	0,			// Min width allowed (in pixels)

		min_height				:	0,			// Min height allowed (in pixels)

		vertical_center         :   1,			// Vertically center background

		horizontal_center       :   1,			// Horizontally center background

		fit_always				:	0,			// Image will never exceed browser width or height (Ignores min. dimensions)

		fit_portrait			:	1,			// Portrait images will not exceed browser height

		fit_landscape			:   0,			// Landscape images will not exceed browser width



		// Components							

		slide_links				:	'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')

		thumb_links				:	0,			// Individual thumb links for each slide

		thumbnail_navigation    :   0,			// Thumbnail navigation

		slides					:	[			// Slideshow Images

			{image : './images/slider/image1.jpg',

				title : '<h2><span>Responsive</span> Design</h2>',

				thumb : '',

				url : ''

				},



			{image : './images/slider/image3.jpg',

				title : '<h2><span>Fullscreen</span> Slideshow</h2>',

				thumb : '',

				url : ''

				},



			{image : './images/slider/image2.jpg',

				title : '<h2><span>Parallax</span> Background</h2>',

				thumb : '',

				url : ''

				},



			{image : './images/slider/image4.jpg',

				title : '<h2><span>Directional Hover</span> Gallery</h2>',

				thumb : '',

				url : ''

				},



			{image : './images/slider/image5.jpg',

				title : '<h2><span>Showcase</span> your style</h2>',

				thumb : '',

				url : ''

				}

		],

									

		// Theme Options			   

		progress_bar			:	0,			// Timer for each slide							

		mouse_scrub				:	0



	});







//WINDOW EVENTS ---------------------------------------------------------------------/	

	 

	$(window).bind('resize',function () {



		//Update slider height

		sliderHeight();



	});



});