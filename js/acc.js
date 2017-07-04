/**
 * accumulation visitors graph module
 *
 * @author      ldw
 * @email       ouoiouoi@gmail.com
 * @version     1.0.0 2017.06.28
 */
'use strict';

// 누적 방문자수 데이터 생성
function getAccumulationData(data) {
    if (!data || data.length == 0) {
        return;
    }

    var addCount = 0;
    return data.map(function (v) {
        addCount += v.visitor;
        return {date: v.date, visitor: addCount};
    });
}


// 누적 방문자수 그래프 생성
function createAccGraph(data) {
    if (!data || data.length === 0) {
        return;
    }

    $('#accumulation').remove();
    $('section').append('<div id="accumulation" class="content"><h2>기간 별 누적 그래프</h2><div class="infobox"></div></div>');

    // 누적 데이터 생성
    data = getAccumulationData(data);

    var xdomain = data[data.length - 1].date,           // x축 길이 설정
        ydomain = data[data.length - 1].visitor + 20;   // y축 길이 설정
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
    
    var svg = d3.select('#accumulation')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    var x = d3.scale.linear()
            .range([0, width])
            .domain([data[0].date, xdomain]);
    var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, ydomain]),
        xAxis = d3.svg.axis().scale(x).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left');
    var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.visitor); });

    // x축 출력
    svg.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .attr('transform', 'translate(0, ' + height + ')');

    // y축 출력
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)

    // tooltip 표시
    var infobox = d3.select('#accumulation .infobox');
    function showData(obj, d) {
        var coord = d3.mouse(obj);
        infobox.style('left', (coord[0] + 10) + 'px');
        infobox.style('top', (coord[1] - 140) + 'px');
        infobox.html(d.date + '일: ' + d.visitor + '명');
        infobox.style('display', 'block');
    }
    function hideData() {
        infobox.style('display', 'none');
    }
    
    // point 출력
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', 'green')
        .attr('r', 4)
        .attr('cx', function(d) { return x(d.date); })
        .attr('cy', function(d) { return y(d.visitor); })
        .on('mouseover', function(d) { showData(this, d); })
        .on('mouseout', function(){ hideData(); });

    // 데이터 출력
    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .style('stroke', 'green')
        .attr('d', line);
}
