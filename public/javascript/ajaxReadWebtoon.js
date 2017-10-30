function goLogin() {
    location.href="/users/login";
}

function onclickFunction(aId) {
    $.ajax({
        type: "POST",
        url: "/users/webtoon/read",
        data: {
            webtoon_id: aId
        },
        success: function(data) {
            var user = data.user;
            var webtoonMap = new Map();
            user.readWebtoon.forEach(function(userToon) {
                webtoonMap.set(userToon.name, userToon);
            });

            console.log('data.webtoon=', data.webtoon.name);
            var checkWebtoon = webtoonMap.get(data.webtoon.name);
            if(checkWebtoon) {
                var location = $("#read").attr('href');
                $("#read").removeAttr('href');
                $("#read").addClass('disabled');
            }



        },
        error: function(xhr, ajaxOptions, thrownError) {
            goLogin();
        }
    });
    return false;
}
