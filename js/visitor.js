/**
 * visitors graph module
 *
 * @author      ldw
 * @email       ouoiouoi@gmail.com
 * @version     1.0.0 2017.06.28
 */
'use strict';

// 방문자수 그래프 생성
function createVisitorGraph(data) {
    if (!data || data.length === 0) {
        return;
    }

    $('#visitor').remove();
    $('section').append('<div id="visitor" class="content"><h2>방문자 수 그래프</h2><div class="infobox"></div></div>');

    var xdomain = data.length,  // x축 길이 설정
        ydomain = 100;          // y축 길이 설정
    // 크기 설정
    var w = 760,
        h = 450,
        margin = {
            top: 40,
            right: 40,
            bottom: 50,
            left: 60
        },
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    var svg = d3.select('#visitor')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    var x = d3.scale.ordinal().rangeBands([0, width], 0.2),
        y = d3.scale.linear()
            .range([height, 0]),
        xAxis = d3.svg.axis().scale(x).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left');

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.visitor; })]);

    // x축 출력
    svg.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .attr('transform', 'translate(0, ' + height + ')');

    // y축 출력
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // 구간 선택 brush
    var brush = d3.svg.brush()
                .x(x)
                .on('brushend', brushed);

    // brush 선택시 실행
    function brushed() {
        var selected = x.domain()
                    .filter(function(d){
                        return (brush.extent()[0] < x(d)) && (x(d) < brush.extent()[1]);
                    }),
            updatedData = [];
        if (selected.length >= 2) {
            var start = selected[0] - 1,
                end = start + selected.length - 1;
            updatedData = data.slice(start, end);
        } else {
            updatedData = data;
        }
        createAccGraph(updatedData);
    }

    // brush 추가
    svg.append('g')
        .attr('class', 'x brush')
        .call(brush)
        .selectAll('rect')
        .attr('height', height);

    // tooltip 표시
    var infobox = d3.select('#visitor .infobox');
    function showData(obj, d) {
        var coord = d3.mouse(obj);
        infobox.style('left', (coord[0] + 20) + 'px');
        infobox.style('top', (coord[1] - 140) + 'px');
        infobox.html(d.date + '일: ' + d.visitor + '명');
        infobox.style('display', 'block');
    }
    function hideData() {
        infobox.style('display', 'none');
    }

    // 데이터 출력
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.date); })
        .attr('y', function(d) { return y(d.visitor); })
        .attr('width', x.rangeBand())
        .attr('height', function(d) { return height - y(d.visitor); })
        .on('mousemove', function(d) { showData(this, d); })
        .on('mouseout', function(){ hideData(); });
}