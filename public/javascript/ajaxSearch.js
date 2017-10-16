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
                var webtoonData = data.webtoon;
                console.log('dat=', webtoonData);
                $(".card-container").remove();
                $("#card").append("<ul id='card_ul' class='card-container' data-reactid='.0.1.0.2'></ul>");
                webtoonData.forEach(function(webtoon) {
                    $("#card_ul").append("<li class='kit card' data-reactid='.0.1.0.2.$0'><div class='kit-image-container' data-reactid='.0.1.0.2.$0.0'><img src=" + webtoon.img_src + "><div class='kit-bottom-info' data-reactid='.0.1.0.2.$0.1'><h2 class='kit-title' data-reactid='.0.1.0.2.$0.1.0'>" + webtoon.name + "</h2><div class='kit-creator' data-reactid='.0.1.0.2.$0.1.1'>" + webtoon.writer + "</div></div><div class='kit-synced-notification sync-flag' data-reactid='.0.1.0.2.$0.2'><div class='kit-synced-notification-inner' data-reactid='.0.1.0.2.$0.2.0'><svg viewBox='0 0 100 100' class='icon' data-reactid='.0.1.0.2.$0.2.0.0'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#checkmark' data-reactid='.0.1.0.2.$0.2.0.0.0'></use></svg></div></div></li>");
                });     
                $("#card_ul").append("<li class='kit card empty' data-reactid='.0.1.0.2.$1'></li>");
                $("#card_ul").append("<li class='kit card empty' data-reactid='.0.1.0.2.$11'></li>");
            },
            error: function(result) {
                alert('error');
            }
        });
    });
});
