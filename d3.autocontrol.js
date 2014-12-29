/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Automagically make tools to manipulate data when attr is called
/*
/* Like Bret Victor's dream
/*
/* 

WARNING: Just loading this script modifies d3's main functionality.
          See Config.
WARNING: Use of eval().

/*
/* Dependencies:
/*   * D3.js
/*   * JSColor (for color picker)
/*
/* Example useage: 
/*
/* d3.select('svg').selectAll('circle')
/*   .data([1, 2, 3, 4])
/*     .attr('fill', 'blue',
/*       'color')
/*     .attr('cx', 0, 
/*       'slider', function (value, d, i) { 
/*         return (i + 1) * value;
/*       }, 1, 400)
/*     .attr('cy', function (d, i) { return 20 * (i + 1); })
/*     .attr('r', function (d, i) { return i + 5; },
/*       'code', function (d, i) { return d; })
/*
/* 
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
(function () { 

/* Begin Config */
  CONFIG = {
    EXTEND_D3: true,

// WARNING: Be very careful with this set to Truthy
    MODIFY_D3: true
  }
/* End Config */

/* Begin Extension functions */
  function __playground_attr(name, initial, type, passedFilter, a,r,g,s) {
    if (arguments.length < 3) {
      return original_d3_selection_attr.apply(this, arguments)
    }

    passedFilter = typeof passedFilter === 'function' 
                    ? passedFilter
                    : function (d) { return d };

    var filter = function (value, d, i) {
      if (typeof value === 'function') {
        value = value.call(this, d, i);
      }

      return passedFilter.call(this, value, d, i);
    }

    var wires = makeWires();

    d3.playground.createFromAutocontrol(wires.trigger, arguments)
    
    return this.each(function (d, i) {
      var that = d3.select(this);

      wires.register(function (value) {
        original_d3_selection_attr.call(that, name, filter.bind(this, value))
      })

      original_d3_selection_attr.call(that, name, initial)
    })
  }


/* Begin Extension functions */
  function __playground_style(name, value, priority, type, passedFilter, a,r,g,s) {
    var priority = 'important';

    if (arguments.length < 4) {
      return original_d3_selection_style.apply(this, arguments)
    }

    passedFilter = typeof passedFilter === 'function' 
                ? passedFilter
                : function (d) { return d };

    // Wrap filter
    filter = function (value, d, i) {
      if (typeof value === 'function') {
        value = value(d, i);
      }

      return passedFilter(value, d, i);
    }

    var wires = makeWires()

    d3.playground.createFromAutocontrol(trigger, arguments)

    return this.each(function (d, i) {
      var that = d3.select(this);

      wires.register(function (value) {
        original_d3_selection_style.call(that, name, priority, filter.bind(this, value))
      })

      // Set initial value through normal d3 method
      original_d3_selection_style.call(that, name, priority, value)
    });
  }

  __playground_transition_attr = (function () {

// Act like the d3.selection.transition.attr() but take some extra arguments
    function _attr(name, value, control, a,r,g,s) {
      if (arguments.length > 2) { 
        var filter = function (d) { return d };

        if (arguments.length > 5) {;
          filter = arguments[arguments.length - 1];
        }

        var wires = makeWires();

        d3.playground.create.apply(this, [].concat.apply([wires.trigger], arguments))

        return __transition_tween(this, name, value, wires.register, 
          function (value, d, i) {
              if (typeof value === 'function') {
                value = value(d, i);
              }

              return filter(value, d, i);
            });
      }

// Defer to original attr function if no extra arguments
// So we've added 
//  * 1 simple logic
//  * 1 fn.apply to every attr call
//  * 1 closure
      return original_d3_selection_transition_attr.apply(this, arguments)
    }

    function __transition_tween (groups, name, value, register, filter) {
      register(function (value) { 
          original_d3_selection_attr.call(d3.selectAll(groups[0]), 
            name,
            function (d, i) {
                return filter.call(this, value, d, i)
              })
      })

      // Continue with original d3 transitioning
      return original_d3_selection_transition_attr.call(groups, name, value)
    }

    return _attr;
  })();

  __playground_transition_style = (function () {

// Act like the d3.selection.transition.attr() but take some extra arguments
    function _attr(name, value, control, a,r,g,s) {
      // Our priorities are always important!
      var priority = 'important';

      if (arguments.length > 2) {

        var filter = function (d) { return d };

        if (arguments.length > 5) {;
          filter = arguments[arguments.length - 1];
        }

        var wires = makeWires();

        d3.playground.create.apply(this, [].concat.apply([wires.trigger], arguments))

        return __transition_tween(this, name, value, priority, wires.register, 
          function (value, d, i) {
              if (typeof value === 'function') {
                value = value(d, i);
              }

              return filter(value, d, i);
            });
      }

// Defer to original attr function if no extra arguments
// So we've added 
//  * 1 simple logic
//  * 1 fn.apply to every attr call
//  * 1 closure
      return original_d3_selection_transition_attr.apply(this, arguments)
    }

    function __transition_tween (groups, name, value, priority, register, filter) {
      register(function (value) { 
          original_d3_selection_style.call(d3.selectAll(groups[0]), 
            name,
            function (d, i) {
                return filter.call(this, value, d, i)
              },
            priority)
      })

      // Continue with original d3 transitioning
      return original_d3_selection_transition_attr.call(groups, name, value, priority)
    }

    return _attr;
  })();
/* End Extension functions */

/* Begin Utility */
function makeWires(d, i) { 
  var wires = d3.dispatch('zap');       
  var wireId = 0;      

  function register(callback) {
    // Register under a silly name to keep from overwriting friends
    wires.on('zap.attr'+ wireId++, callback);
  }

  function trigger(value, value2) {
    wires.zap(value2 || value);
  }

  return {
    trigger: trigger,
    register: register
  }
}
/* End Utility */


/* Begin Edit Outside World */
  var original_d3_selection_attr = d3.selection.prototype.attr
  var original_d3_selection_style = d3.selection.prototype.style

  var original_d3_selection_transition_attr = d3.transition.prototype.attr
  var original_d3_selection_transition_style = d3.transition.prototype.style

  if (CONFIG.EXTEND_D3) {
    d3.selection.prototype.PGattr = __playground_attr
    d3.selection.prototype.PGstyle = __playground_style

    d3.transition.prototype.PGattr = __playground_transition_attr
    d3.transition.prototype.PGstyle = __playground_transition_style
  } 

  if (CONFIG.MODIFY_D3) {
    d3.selection.prototype.attr = __playground_attr
    d3.selection.prototype.style = __playground_style

    d3.transition.prototype.attr = __playground_transition_attr
    d3.transition.prototype.style = __playground_transition_style
  }
/* End Edit Outside World */
})();
