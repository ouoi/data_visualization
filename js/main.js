/**
 * main
 *
 * @author      ldw
 * @email       ouoiouoi@gmail.com
 * @version     1.0.0 2017.06.28
 */
'use strict';

var MIN_DATE = 10,
    MAX_DATE = 150,
    MAX_VISITOR = 100;

// 그래프 생성
function createGraph(value) {
    if (typeof value !== 'number' || value < MIN_DATE || value > MAX_DATE) {
        alert(MIN_DATE + ' ~ ' + MAX_DATE + ' 사이의 숫자만 입력해주세요.');
        return;
    }

    // 방문자수 랜덤 생성
    var dataVisitor = [];
    for (var i = 0; i < value; i++) {
        dataVisitor.push({date: i + 1, visitor: parseInt(Math.random() * MAX_VISITOR)});
    }

    // 방문자수 그래프 생성
    createVisitorGraph(dataVisitor);

    // 누적 방문자수 그래프 생성
    createAccGraph(dataVisitor);
}

(function () {
    // input box 엔터 키 입력
    $('#date_count').on('keydown', function (e) {
        if (e.keyCode === 13) {
            createGraph(Number(e.target.value));
        }
    });

    // 생성 버튼 click
    $('#btn_create').on('click', function () {
        createGraph(Number($('#date_count').val()));
    });
})();
