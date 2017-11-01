// 공통적으로 쓰는 함수 모아두는 곳
var moment = require('moment-timezone');
module.exports = {
    regDateTime: function regDateTime() {
        // lang:ko를 등록한다. 한번 지정하면 자동적으로 사용된다.
        moment.locale('ko', {
            weekdays: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"],
        });

        var m = moment().tz('Asia/Seoul');
        var output = m.format("YYYY년MM월DD일 dddd HH:mm:ss ");
        return output;
    }
};
