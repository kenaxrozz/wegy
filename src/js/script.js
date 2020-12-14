import $ from 'jquery';

window.addEventListener('load', function () {
    let $navBurger = $('.nav-burger');
    let $navMenu = $('.nav-menu');
    let $navLinks = $('.nav-menu a');
    
    $navBurger.on('click', function () {
        if ($(window).innerWidth() <= '720') {
            $navBurger.toggleClass('active');
            $navMenu.toggleClass('active');
            $('body').toggleClass('lock');
        }
    });
    
    $navLinks.on('click', function (e) {
        e.preventDefault();
        
        let $link = $(this);
        let id = $link.attr('href');
        let target = $(id);

        if (target.length > 0) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 700);
        }

        if ($(window).innerWidth() <= '720') {
            $navBurger.toggleClass('active');
            $navMenu.toggleClass('active');
            $('body').toggleClass('lock');
        }
    });

    function checkWidth() {
        if ($(window).innerWidth() <= '720') {
            $navBurger.toggleClass('active');
            $navMenu.toggleClass('active');
            $('body').toggleClass('lock');
        }
    };
});