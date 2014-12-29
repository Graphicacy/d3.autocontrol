d3.select('svg#playground').selectAll('circle')
  .data([1, 2, 3, 4])
    .attr('fill', 'blue',
      'color')
    .attr('cx', 0, 
      'slider', function (value, d, i) { 
        return (i + 1) * value;
      }, 1, 400)
    .attr('cy', function (d, i) { return 20 * (i + 1); })
    .attr('r', function (d, i) { return i + 5; },
      'code', function (d, i) { return d; })