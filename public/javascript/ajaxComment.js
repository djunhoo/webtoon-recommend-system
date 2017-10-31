$(document).ready(function() {
    $("#commentForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/webtoon/comment/write",
            data: {
                webtoonId: $('#webtoonId').val(),
                content: $('#commentContent').val(),
                point: $('#rating').val()
            },
            success: function(comment) {
                console.log('comment=', comment);
            },
            error: function(result) {
                alert('ajaxError');
            }
        });
    });
});
