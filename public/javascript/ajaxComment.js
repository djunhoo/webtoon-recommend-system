$(document).ready(function() {
    $("#commentForm").submit(function(e) {
        if($('#flash')){
            for(var i=0; i<('#flash').length; i++) {
                $('#flash').remove();
            }
        }
        if ($('#commentContent').val() == "") {
            var flash = "<div id='flash' class='alert alert-danger' role='alert'><strong>확인!</strong>댓글을 입력해주세요.</div>";
            $("#comments-list").before(flash).fadeIn('slow', function() {
                $('#flash').delay(500).fadeOut('slow');
            });
            return false;
        } else if ($('#rating').val() == 0) {
            var flash = "<div id='flash' class='alert alert-danger' role='alert'><strong>확인!</strong>평점을 눌려주세요^^.</div>";
            $("#comments-list").before(flash).fadeIn('slow', function() {
                $('#flash').delay(500).fadeOut('slow');
            });
            return false;
        } else {
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
                    $("#commentForm")[0].reset();
                    if (comment.error) {
                        var flash = "<div id='flash' class='alert alert-danger' role='alert'><strong>"+ comment.error +"</div>";
                        $("#comments-list").before(flash).fadeIn('slow', function() {
                            $('#flash').delay(700).fadeOut('slow');

                        });
                    } else {
                        console.log('comment=', comment);
                        var starValue = "";
                        for (i = 0; i < parseInt(comment.point); i++) {
                            starValue += "<i class='glyphicon glyphicon-star'></i>";
                        }
                        for (i = 0; i < 5 - parseInt(comment.point); i++) {
                            starValue += "<i class='glyphicon glyphicon-star-empty'></i>"
                        }
                        $("#comments-list").append("<li><div class='comment-main-level'><div class='comment-avatar'><img src='http://i9.photobucket.com/albums/a88/creaticode/avatar_1_zps8e1c80cd.jpg'></div><div class='comment-box'><div class='comment-head'><b style='float: left;'>" + comment.userId.email + "&nbsp;&nbsp;&nbsp;</b><span>" + comment.regdate + "&nbsp;&nbsp;</span>" + starValue + "</div><div class='comment-content'>" + comment.content + "</div></div></div></li>");
                    }
                },
                error: function(result) {
                    console.log('result=', result);
                }
            });
        }

    });
});
