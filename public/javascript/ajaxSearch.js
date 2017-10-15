$(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $('#searchclick').click();
    }
});

$(document).ready(function() {
    $("#searchclick").click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/search",
            data: {
                name: $("#search").val()
            },
            success: function(data) {
                var web = data.webtoon;
                console.log('dat=', web);
            },
            error: function(result) {
                alert('error');
            }
        });
    });
});
