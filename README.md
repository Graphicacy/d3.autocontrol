# D3 Autocontrol Playground

Easily generate controls for yourself while you create your D3 visualization/application.

Dependencies
* D3 version >= 3.5.2 (Untested with lower versions) - http://d3js.org
* d3 Slider - https://github.com/turban/d3.slider
* JSColor - http://jscolor.com/

Example Useage:
1. Load all libraries/dependencies into HTML (order matters)

`````
<!-- Begin D3 Autocontrol Playground dependencies -->
<script src="/scripts/vendor/d3.js"></script>
<link rel="stylesheet" href="/scripts/vendor/d3.slider.css">
<script src="/scripts/vendor/d3.slider.js"></script>
<script src='/scripts/vendor/jscolor/jscolor.js'></script>
<script src="/scripts/d3.playground.js"></script>
<script src="/scripts/d3.autocontrol.js"></script>
<!-- End D3 Autocontrol Playground dependencies -->
`````
2. Use it in your d3 code

`````
d3.select('svg').selectAll('circle')
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
`````

This code will generate a color picker, slider, and code area that all update your code automagically.

Author(s): [Reed Spool](https://github.com/reedspool)

Built by [Graphicacy](http://www.graphicacy.com)