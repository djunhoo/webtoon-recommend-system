$(document).ready(function() {
    var myNav = document.getElementById('mynav');
    var scroll_start = 0;
    var startchange = $('.navbar-centerNavbar');
    var offset = startchange.offset();
    $(document).scroll(function() {
        scroll_start = $(this).scrollTop();
        if (scroll_start > offset.top) {
            myNav.classList.add('navbar-centerNavbar');
            myNav.classList.remove('navbar-findcond');
        } else {
            myNav.classList.add('navbar-findcond');
            myNav.classList.remove('navbar-centerNavbar');
        }
    });
});
