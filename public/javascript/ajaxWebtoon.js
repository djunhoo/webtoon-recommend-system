function onclickFunction(aId) {
    $.ajax({
        type: "POST",
        url: "/",
        data: {
            category_id: aId
        },
        success: function(data) {
            console.log('dat=', data);
            $(".tab-content").remove();
            var webtoonData = data.webtoons
            $("#tab-card").append("<div class='tab-content'><div class='row' id='row-content'></div></div>");
            webtoonData.forEach(function(webtoon) {
                $("#row-content").append("<div class='col-xs-3'><div class='card' id='webtoon_card'><a class='img-card' href='/webtoon/" + webtoon._id + "'><img src='" + webtoon.img_src + "'/></a><div class='card-content'><h4 class='card-title'><a href='#'>" + webtoon.name + "</a></h4><div class=''>" + webtoon.writer + "</div></div><div class='card-read-more'><a class='btn btn-link btn-block' href='/webtoon/" + webtoon._id + "'>더 보기</a></div></div></div>");
            });
        },
        error: function(xhr, ajaxOptions, thrownError) {

        }
    });
    return false;
}
