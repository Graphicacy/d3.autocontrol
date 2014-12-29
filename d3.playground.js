d3.playground = (function (d, i) { 
  var turnedOn = false;
  // Make a special home for our controls
  var holder = d3.select('body')
                .append('div')
                  .style({
                    display: turnedOn ? 'block' : 'none',
                    height: '500px',
                    width: '500px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    'background-color': 'rgba(132,234,12, 0.4)'
                  });


  function turnOn() {
    if (turnedOn) return;

    holder.style('display', 'block');
  }

/* Begin Utilities */
  function createSlider(trigger, name, value, control, arg4, arg5,a,r,g,s) {
    var min = arg4 || 0;
    var max = arg5 || 10;
    var step =  1;
    var initial = typeof value === 'function' ?
                    min && max && (max + min) / 2
                  : value;

    var slider = d3.slider()
                  .value(initial)
                  .min(min)
                  .max(max)
                  .step(step || 1)

    holder.append('div').call(slider);

    slider.on('slide', trigger)
  }

  function createTextbox(trigger, name, value, control, a,r,g,s) {
    var box = holder.append('div')
      .append('center')
        .append('input')
          .attr('type', 'text')
          .attr('value', value.toString())
          .on('keyup', function (evt) {
            trigger(evt, box.node().value)
          })
  }

  function createCodeArea(trigger, name, value, control, a,r,g,s) {
    var initial = typeof value === 'function'
                    ? value.toString() // ECMA5 print out user code as string
                    : 'function (d, i) { return ' + value + '; }'

    var textarea = holder.append('textarea') 
      .text(initial)
      .on('keyup', function (evt) {
        var userCode = textarea.node().value

        // Not sure this should be here. 
        // Seems to violate  knowing about d3 w/ d, i
        trigger(evt, function (d, i) {
          var args = [d, i];
          try {
            // Wrap user code in a IIFE
            return eval('(' + userCode + ')(' + args.join(',') + ')')
          } catch (e) {
            // Do nothing but report
            console.error('Value not legal JS', value, e, e.stack)
            return undefined;
          }
        })
      })
  }

  function createColorPicker(trigger, name, value, control, a,r,g,s) {
    function rgbToHex(rgb) { 
      return 'rgb(' +
          ~~(rgb[0] * 255) + ',' +
          ~~(rgb[1] * 255) + ',' +
          ~~(rgb[2] * 255) + ')' ;
    }
    var textarea = holder.append('input') 
      .classed('color', true)
      .on('change', function () {
        trigger(rgbToHex(this.color.rgb))
      })
  }
/* End Utilities */

  function create(trigger, name, value, control, a,r,g,s) {
    // Show panel only when in use
    turnOn();

    switch(control) {
      case "code":
        createCodeArea.apply(null, arguments)
        break;

      case "slider":
        createSlider.apply(null, arguments)
        break;

      case "color":
        createColorPicker.apply(null, arguments)
        break;

      case "text":
        createTextbox.apply(null, arguments);
        break;

      default:
        console.error.bind(console)('d3.playground::create not behaving', arguments, this, C=window.C&&window.C+1||1); // Testing - Delete me 
    }
  }

  function createFromAutocontrol(trigger, args) {
    create.apply(null, [].concat.apply([trigger], args))
  }

  return {
    create: create,
    createFromAutocontrol: createFromAutocontrol
  };
})()