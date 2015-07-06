/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// `redshift` to be deprecated in 4.0.0
	window.Redshift = window.redshift = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Redshift = __webpack_require__(2);

	Redshift
	    /*
	        Core Redshift route
	    */
	    .addRoute('values', __webpack_require__(3))
	    /*
	        Core Redshift Actions
	    */
	    .addAction('play', __webpack_require__(4))
	    .addAction('run', __webpack_require__(5))
	    .addAction('fire', __webpack_require__(6))
	    .addAction('track', __webpack_require__(7))

	    /*
	        Seek Action - depedent on 'play' Action
	    */
	    .addAction('seek', __webpack_require__(8))

	    /*
	        Optional value type support
	    */
	    .addValueType('px', __webpack_require__(9))
	    .addValueType('angle', __webpack_require__(10))
	    .addValueType('hsl', __webpack_require__(11))
	    .addValueType('rgb', __webpack_require__(12))
	    .addValueType('hex', __webpack_require__(13))
	    .addValueType('color', __webpack_require__(14))
	    .addValueType('positions', __webpack_require__(15))
	    .addValueType('dimensions', __webpack_require__(16))
	    .addValueType('shadow', __webpack_require__(17))

	    /*
	        DOM Element type and CSS/Attr route - dependent on core value types being present
	    */
	    .addActorType('dom', __webpack_require__(18))
	    .addRoute('css', __webpack_require__(19))
	    .addRoute('attr', __webpack_require__(20))

	    /*
	        SVG route - dependent on DOM route
	    */
	    .addRoute('path', __webpack_require__(21));

	module.exports = Redshift;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var select = __webpack_require__(22),
	    actionManager = __webpack_require__(23),
	    easingManager = __webpack_require__(24),
	    presetManager = __webpack_require__(25),
	    routeManager = __webpack_require__(26),
	    simulationManager = __webpack_require__(27),
	    actorTypeManager = __webpack_require__(28),
	    valueTypeManager = __webpack_require__(29),
	    calc = __webpack_require__(30),

	    Actor = __webpack_require__(31),
	    ActorGroup = __webpack_require__(32),
	    Input = __webpack_require__(33),
	    Process = __webpack_require__(34),

	    Redshift = {

	        Actor: Actor,

	        ActorGroup: ActorGroup,

	        Input: Input,

	        Process: Process,

	        select: function (items) {
	            return select(items);
	        },

	        addAction: function () {
	            actionManager.extend.apply(actionManager, arguments);
	            return this;
	        },

	        addEasing: function () {
	            easingManager.extend.apply(easingManager, arguments);
	            return this;
	        },

	        addPreset: function () {
	            presetManager.extend.apply(presetManager, arguments);
	            return this;
	        },

	        addSimulation: function () {
	            simulationManager.extend.apply(simulationManager, arguments);
	            return this;
	        },

	        addActorType: function () {
	            actorTypeManager.extend.apply(actorTypeManager, arguments);
	            return this;
	        },

	        addValueType: function () {
	            valueTypeManager.extend.apply(valueTypeManager, arguments);
	            return this;
	        },

	        addRoute: function () {
	            routeManager.extend.apply(routeManager, arguments);
	            return this;
	        },

	        calc: calc,

	        /* Depricated methods, removing in 4.0.0 */
	        newAction: function (a, b) {
	            return new Actor(a, b);
	        },
	        newActionGroup: function (a) {
	            return new ActorGroup(a);
	        },
	        newInput: function (a, b) {
	            return new Input(a, b);
	        },
	        newProcess: function (a, b) {
	            return new Process(a, b);
	        }
	    };

	Redshift.addBezier = Redshift.addEasing;
	Redshift.addRubix = Redshift.addAction;

	module.exports = Redshift;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Values route (Redshift default)
	    
	    Handles raw values and outputs to user-defined callbacks
	*/
	"use strict";

	var valuesRoute = {},

	    fireCallback = function (name, output, actor) {
	        if (actor[name]) {
	            actor[name].call(actor, output);
	        }
	    };

	['onStart', 'onFrame', 'onChange', 'onEnd'].forEach(function (key) {
	    valuesRoute[key] = function (output, actor) {
	        fireCallback(key, output, actor);
	    };
	});

	module.exports = valuesRoute;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Play action
	    
	    Translate numbers for a set amount of time, applying easing if defined
	*/
	"use strict";

	var calc = __webpack_require__(30),
	    utils = __webpack_require__(35),
	    easingManager = __webpack_require__(24),

	    playAction = {

	        // [object] Default Action properties
	        actionDefaults: __webpack_require__(36),

	        // [object]: Default value properties
	        valueDefaults: __webpack_require__(37),

	        // [boolean] Prevent Redshift from autogenerating Element.prototype.play()
	        surpressMethod: true,

	        // [object] Methods to add to Actor.prototype
	        actorMethods: __webpack_require__(38),

	        /*
	            Update Action elapsed time
	            
	            @param [object]: Action properties
	            @param [number]: Timestamp of current frame
	        */
	        onFrameStart: function (frameDuration) {
	            this.elapsed += (frameDuration * this.dilate) * this.playDirection;
	            this.hasEnded = true;
	        },

	        /*
	            Calculate progress of value based on time elapsed,
	            value delay/duration/stagger properties

	            @param [string]: Name of value being processed
	            @param [object]: Value state and properties
	            @return [number]: Calculated value
	        */
	        process: function (key, value) {
	            var target = value.to,
	                progressTarget = (this.playDirection === 1) ? 1 : 0,
	                newValue = value.current,
	                progress;

	            // If this value has a to property, otherwise we just return current value
	            if (target !== undefined) {
	                progress = calc.restricted(calc.progress(this.elapsed - value.delay, value.duration) - value.stagger, 0, 1);

	                // Mark Action as NOT ended if still in progress
	                if (progress !== progressTarget) {
	                    this.hasEnded = false;

	                // Or, if we have ended, clear value target
	                } else {
	                    value.to = undefined;
	                }

	                // Step progress if we're stepping
	                if (value.steps) {
	                    progress = utils.stepProgress(progress, value.steps);
	                }

	                // Ease value
	                newValue = easingManager.withinRange(progress, value.origin, target, value.ease);
	            }

	            return newValue;
	        },
	        
	        /*
	            Return hasEnded property
	            
	            @return [boolean]: Have all Values hit 1 progress?
	        */
	        hasEnded: function () {
	            return this.hasEnded;
	        }
	    };

	module.exports = playAction;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Run physics simulation
	*/
	"use strict";

	var calc = __webpack_require__(30),
	    simulate = __webpack_require__(39);

	module.exports = {

	    // [object] Default Action properties
	    actionDefaults: __webpack_require__(40),

	    // [object] Default value properties
	    valueDefaults: __webpack_require__(41),

	    parse: __webpack_require__(42),

	    // [boolean]: Tell Redshift this rubix calculates a new velocity itself
	    calculatesVelocity: true,
	    
	    /*
	        Simulate the Value's per-frame movement
	        
	        @param [string]: Key of current value
	        @param [Value]: Current value
	        @param [number]: Duration of frame in ms
	        @return [number]: Calculated value
	    */
	    process: function (key, value, frameDuration) {
	        value.velocity = simulate(value.simulate, value, frameDuration, this.started);
	        return value.current + calc.speedPerFrame(value.velocity, frameDuration);
	    },
	    
	    /*
	        Has this action ended?
	        
	        Use a framecounter to see if Action has changed in the last x frames
	        and declare ended if not
	        
	        @param [boolean]: Has Action changed?
	        @return [boolean]: Has Action ended?
	    */
	    hasEnded: function (hasChanged) {
	        this.inactiveFrames = hasChanged ? 0 : this.inactiveFrames + 1;
	        return (this.inactiveFrames > this.maxInactiveFrames);
	    },
	    
	    /*
	        Limit output to value range, if any
	        
	        If velocity is at or more than range, and value has a bounce property,
	        run the bounce simulation
	        
	        @param [number]: Calculated output
	        @param [Value]: Current Value
	        @return [number]: Limit-adjusted output
	    */
	    limit: function (output, value) {
	        var isOutsideMax = (output >= value.max),
	            isOutsideMin = (output <= value.min),
	            isOutsideRange = isOutsideMax || isOutsideMin;
	        
	        if (isOutsideRange) {
	            output = calc.restricted(output, value.min, value.max);

	            if (value.bounce) {
	                value.velocity = simulate('bounce', value);

	            } else if (value.capture) {
	                simulate('capture', value, isOutsideMax ? value.max : value.min);
	            }
	        }
	        
	        return output;
	    }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Return current value and immedietly end
	*/
	"use strict";

	module.exports = {

	    parse: __webpack_require__(42),

	   /*
	        Process new value
	        
	        Return existing current
	        
	        @param [string]: Name of value
	        @param [Value]: Current value
	    */
	    process: function (key, value) {
	        return value.current;
	    },
	    
	    /*
	        Has Action ended?
	        
	        Returns true to end immedietly
	        
	        @return [boolean]: true
	    */
	    hasEnded: function () {
	        return true;
	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Track user input
	*/
	"use strict";

	var calc = __webpack_require__(30),
	    genericParser = __webpack_require__(42),
	    Pointer = __webpack_require__(43);

	module.exports = {

	    valueDefaults: __webpack_require__(44),

	    /*
	        Parse Input arguments
	    */
	    parse: function () {
	        var props = genericParser.apply(this, arguments),
	            input = arguments[arguments.length - 1];

	        // Create Pointer if this isn't an Input
	        props.input = (!input.current) ? new Pointer(input) : input;

	        // Set input origin if not user-defined
	        if (!props.inputOrigin) {
	            props.inputOrigin = input.get();
	        }

	        return props;
	    },
	    
	    /*
	        Update input offset
	    */
	    onFrameStart: function () {
	        this.inputOffset = calc.offset(this.inputOrigin, this.input.current);
	    },
	        
	    /*
	        Move Value relative to Input movement
	        
	        @param [string]: Key of current value
	        @param [Value]: Current value
	        @return [number]: Calculated value
	    */
	    process: function (key, value) {
	        return (this.inputOffset.hasOwnProperty(key)) ? value.origin + this.inputOffset[key] : value.current;
	    },
	    
	    /*
	        Has this Action ended? 
	        
	        @return [boolean]: False to make user manually finish .track()
	    */
	    hasEnded: function () {
	        return false;
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Return current value and immedietly end
	*/
	"use strict";

	var play = __webpack_require__(4);

	module.exports = {

	    surpressMethod: true,

	    actorMethods: {
	        seek: function (seekTo) {
	            this.elapsed = this.duration * seekTo;

	            if (!this.isActive) {
	                this.action = 'seek';
	                this.activate();
	            }

	            return this;
	        }
	    },

	   /*
	        Process new value
	        
	        Return existing current
	        
	        @param [string]: Name of value
	        @param [Value]: Current value
	    */
	    process: play.process,
	    
	    /*
	        Has Action ended?
	        
	        Returns true to end animation, and sets rubix to 'play'
	        
	        @return [boolean]: true
	    */
	    hasEnded: function () {
	        this.rubix = 'play';
	        return true;
	    }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    defaultProps: {
	        unit: 'px'
	    }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    defaultProps: {
	        unit: 'deg'
	    }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var createDelimited = __webpack_require__(45),
	    getColorValues = __webpack_require__(46),
	    functionCreate = __webpack_require__(47),
	    defaultProps = __webpack_require__(48),
	    terms = __webpack_require__(49).hsl;

	module.exports = {

	    defaultProps: {
	        Hue: {
	            min: 0,
	            max: 360
	        },
	        Saturation: defaultProps.percent,
	        Lightness: defaultProps.percent,
	        Alpha: defaultProps.opacity
	    },

	    test: function (value) {
	        return (value && value.indexOf('hsl') > -1);
	    },
	    
	    split: function (value) {
	        return getColorValues(value, terms);
	    },

	    combine: function (values) {
	        return functionCreate(createDelimited(values, terms, ', ', 2), 'hsla');
	    }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var createDelimited = __webpack_require__(45),
	    getColorValues = __webpack_require__(46),
	    functionCreate = __webpack_require__(47),
	    defaultProps = __webpack_require__(48),
	    colorDefaults = defaultProps.color,
	    terms = __webpack_require__(49).colors;

	module.exports = {

	    defaultProps: {
	        Red: colorDefaults,
	        Green: colorDefaults,
	        Blue: colorDefaults,
	        Alpha: defaultProps.opacity
	    },

	    test: function (value) {
	        return (value && value.indexOf('rgb') > -1);
	    },
	    
	    split: function (value) {
	        return getColorValues(value, terms);
	    },

	    combine: function (values) {
	        return functionCreate(createDelimited(values, terms, ', ', 2), 'rgba');
	    }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var rgb = __webpack_require__(12);

	module.exports = {

	    defaultProps: rgb.defaultProps,

	    test: function (value) {
	        return (value && value.indexOf('#') > -1);
	    },
	    
	    split: function (value) {
	        var r, g, b;

	        // If we have 6 characters, ie #FF0000
	        if (value.length > 4) {
	            r = value.substr(1, 2);
	            g = value.substr(3, 2);
	            b = value.substr(5, 2);

	        // Or we have 3 characters, ie #F00
	        } else {
	            r = value.substr(1, 1);
	            g = value.substr(2, 1);
	            b = value.substr(3, 1);
	            r += r;
	            g += g;
	            b += b;
	        }

	        return {
	            Red: parseInt(r, 16),
	            Green: parseInt(g, 16),
	            Blue: parseInt(b, 16),
	            Alpha: 1
	        };
	    },

	    combine: function (values) {
	        return rgb.combine(values);
	    }
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(35),
	    rgb = __webpack_require__(12),
	    hsl = __webpack_require__(11),
	    hex = __webpack_require__(13),
	    supported = [rgb, hsl, hex],
	    numSupported = 3,

	    runSupported = function (method, value) {
	        for (var i = 0; i < numSupported; i++) {
	            if (supported[i].test(value)) {
	                return supported[i][method](value);
	            }
	        }
	    };

	module.exports = {

	    defaultProps: utils.merge(rgb.defaultProps, hsl.defaultProps),

	    test: function (value) {
	        return rgb.test(value) || hex.test(value) || hsl.test(value);
	    },

	    split: function (value) {
	        return runSupported('split', value);
	    },

	    combine: function (values) {
	        return (values.Red) ? rgb.combine(values) : hsl.combine(values);
	    }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var createDelimited = __webpack_require__(45),
	    pxDefaults = __webpack_require__(9).defaultProps,
	    splitSpaceDelimited = __webpack_require__(50),
	    terms = __webpack_require__(49).positions;

	module.exports = {

	    defaultProps: pxDefaults,
	        
	    /*
	        Split positions in format "X Y Z"
	        
	        @param [string]: Position values
	            "20% 30% 0" -> {20%, 30%, 0}
	            "20% 30%" -> {20%, 30%}
	            "20%" -> {20%, 20%}
	    */
	    split: function (value) {
	        var positions = splitSpaceDelimited(value),
	            numPositions = positions.length,
	            splitValue = {
	                X: positions[0],
	                Y: (numPositions > 1) ? positions[1] : positions[0]
	            };
	            
	        if (numPositions > 2) {
	            splitValue.Z = positions[2];
	        }

	        return splitValue;
	    },

	    combine: function (values) {
	        return createDelimited(values, terms, ' ');
	    }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var terms = __webpack_require__(49).dimensions,
	    pxDefaults = __webpack_require__(9).defaultProps,
	    createDelimited = __webpack_require__(45),
	    splitSpaceDelimited = __webpack_require__(50);

	module.exports = {

	    defaultProps: pxDefaults,
	    
	    /*
	        Split dimensions in format "Top Right Bottom Left"
	        
	        @param [string]: Dimension values
	            "20px 0 30px 40px" -> {20px, 0, 30px, 40px}
	            "20px 0 30px" -> {20px, 0, 30px, 0}
	            "20px 0" -> {20px, 0, 20px, 0}
	            "20px" -> {20px, 20px, 20px, 20px}
	        
	        @return [object]: Object with T/R/B/L metrics
	    */
	    split: function (value) {
	        var dimensions = splitSpaceDelimited(value),
	            numDimensions = dimensions.length,
	            jumpBack = (numDimensions !== 1) ? 2 : 1,
	            i = 0,
	            j = 0,
	            splitValue = {};

	        for (; i < 4; i++) {
	            splitValue[terms[i]] = dimensions[j];

	            // Jump back (to start) counter if we've reached the end of our values
	            j++;
	            j = (j === numDimensions) ? j - jumpBack : j;
	        }

	        return splitValue;
	    },

	    combine: function (values) {
	        return createDelimited(values, terms, ' ');
	    }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var color = __webpack_require__(14),
	    utils = __webpack_require__(35),
	    pxDefaults = __webpack_require__(9).defaultProps,
	    terms = __webpack_require__(49).shadow,
	    splitSpaceDelimited = __webpack_require__(50),
	    createDelimited = __webpack_require__(45),
	    shadowTerms = terms.slice(0,4);

	module.exports = {

	    defaultProps: utils.merge(color.defaultProps, {
	        X: pxDefaults,
	        Y: pxDefaults,
	        Radius: pxDefaults,
	        Spread: pxDefaults
	    }),

	    /*
	        Split shadow properties "X Y Radius Spread Color"
	        
	        @param [string]: Shadow property
	        @return [object]
	    */
	    split: function (value) {
	        var bits = splitSpaceDelimited(value),
	            numBits = bits.length,
	            hasReachedColor = false,
	            colorProp = '',
	            thisBit,
	            i = 0,
	            splitValue = {};

	        for (; i < numBits; i++) {
	            thisBit = bits[i];

	            // If we've reached the color property, append to color string
	            if (hasReachedColor || color.test(thisBit)) {
	                hasReachedColor = true;
	                colorProp += thisBit;

	            } else {
	                splitValue[terms[i]] = thisBit;
	            }
	        }
	        
	        return utils.merge(splitValue, color.split(colorProp));
	    },

	    combine: function (values) {
	        return createDelimited(values, shadowTerms, ' ') + color.combine(values);
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var styleDOM = __webpack_require__(51),
	    getterSetter = __webpack_require__(52);

	module.exports = {

	    /*
	        Get or set attribute

	        @param [object || string]: Properties to set or name of attribute to get/set
	        @param [string || number]: Property to set if setting single prop
	    */
	    attr: function (opts, prop) {
	        return getterSetter.call(this, opts, prop,
	            // Getter
	            function (name) {
	                return this.element.getAttribute(name);
	            },
	            // Setter
	            function (name, prop) {
	                this.element.setAttribute(name, prop);
	                return this;
	            }
	        );
	    },

	    /*
	        Style DOM element

	        @param [string || object]: Either name of style to get/set or an object of properties to set
	        @parma [string] (optional): Property to set
	        @return [object || Element]: Returns calculated style if get, or Element if set
	    */
	    style: function (opts, prop) {
	        return getterSetter.call(this, opts, prop,
	            // Getter
	            function (name) {
	                return styleDOM.get(this.element, name);
	            },
	            // Setter
	            function (name, rule) {
	                styleDOM.set(this.element, name, rule);
	                return this;
	            }
	        );
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var build = __webpack_require__(53),
	    typeMap = __webpack_require__(54),
	    CSS_CACHE = '_cssCache';

	module.exports = {
	    typeMap: typeMap,
	    
	    onChange: function (output, actor) {
	        actor[CSS_CACHE] = actor[CSS_CACHE] || {};
	        actor.style(build(output, actor[CSS_CACHE]));
	    }
	    
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	    onChange: function (output, actor) {
	        for (var key in output) {
	            if (output.hasOwnProperty(key)) {
	                actor.attr(key, output[key]);
	            }
	        }
	    }
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var createStyles = __webpack_require__(55);

	module.exports = {

	    typeMap: {
	        stroke: 'color'
	    },

	    onStart: function (output, actor) {
	        if (actor.actor) {
	            actor.pathLength = actor.element.getTotalLength();
	        }
	    },
	    
	    onChange: function (output, actor) {
	        actor.style(createStyles(output, actor.pathLength));
	    }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var ActorGroup = __webpack_require__(32);

	/*
	    Create an ActorGroup based on a selection of DOM nodes

	    @param [string || NodeList || jQuery object]:
	        If string, treated as selector.
	        If not, treated as preexisting NodeList || jQuery object.
	*/
	module.exports = function (selector) {
	    var nodes = (typeof selector === 'string') ? document.querySelectorAll(selector) : selector,
	        elements = [];

	    // If jQuery selection, get array of Elements
	    if (nodes.get) {
	        elements = nodes.get();

	    // Or convert NodeList to array
	    } else if (nodes.length) {
	        elements = [].slice.call(nodes);

	    // Or if it's just an Element, put into array
	    } else {
	        elements.push(nodes);
	    }

	    return new ActorGroup(elements, { type: 'dom' });
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Actor,
	    ActorGroup,
	    utils = __webpack_require__(35),
	    generateMethodIterator = __webpack_require__(56),
	    genericActionProps = __webpack_require__(57),
	    genericValueProps = __webpack_require__(58),

	    ModManager = __webpack_require__(59),

	    actionManager = new ModManager();
	/*
	    Add module to ActionManager

	    Creates a new Action for Elements
	*/
	actionManager.extend = function (name, mod) {
	    var methodName = '';

	    /*
	        Generate new method for Elements if module doesn't have a
	        surpressMethod flag and Element doesn't already have a
	        method with that name
	    */
	    if (!mod.surpressMethod && !Actor.prototype[name]) {
	        Actor.prototype[name] = function () {
	            this.action = name;
	            this.set(mod.parse.apply(this, arguments));

	            return this.start();
	        };

	        ActorGroup.prototype[name] = generateMethodIterator(name);
	    }

	    // If module has methods to add to Element.prototype
	    if (mod.actorMethods) {
	        for (methodName in mod.actorMethods) {
	            if (mod.actorMethods.hasOwnProperty(methodName)) {
	                Actor.prototype[methodName] = mod.actorMethods[methodName];
	                ActorGroup.prototype[methodName] = generateMethodIterator(methodName);
	            }
	        }
	    }

	    // Merge action props with defaults
	    mod.actionDefaults = mod.actionDefaults ? utils.merge(genericActionProps, mod.actionDefaults) : genericActionProps;

	    // Merge value props with defaults
	    mod.valueDefaults = mod.valueDefaults ? utils.merge(genericValueProps, mod.valueDefaults) : genericValueProps;
	    
	    // Call parent extend method
	    ModManager.prototype.extend.call(this, name, mod);
	};

	actionManager.setActor = function (actor) {
	    Actor = actor;
	};

	actionManager.setActorGroup = function (actorGroup) {
	    ActorGroup = actorGroup;
	};

	module.exports = actionManager;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Easing functions
	    ----------------------------------------
	    
	    Generates and provides easing functions based on baseFunction definitions
	    
	    A call to easingFunction.get('functionName') returns a function that can be passed:
	        @param [number]: Progress 0-1
	        @param [number] (optional): Amp modifier, only accepted in some easing functions
	                                    and is used to adjust overall strength
	        @return [number]: Eased progress
	        
	    We can generate new functions by sending an easing function through easingFunction.extend(name, method).
	    Which will make nameIn, nameOut and nameInOut functions available to use.
	        
	    Easing functions from Robert Penner
	    http://www.robertpenner.com/easing/
	        
	    Bezier curve interpretor created from Gaëtan Renaudeau's original BezierEasing  
	    https://github.com/gre/bezier-easing/blob/master/index.js  
	    https://github.com/gre/bezier-easing/blob/master/LICENSE
	*/
	"use strict";

	var calc = __webpack_require__(30),
	    Bezier = __webpack_require__(60),

	    EASE_IN = 'In',
	    EASE_OUT = 'Out',
	    EASE_IN_OUT = EASE_IN + EASE_OUT,
	    
	    // Generate easing function with provided power
	    generatePowerEasing = function (power) {
	        return function (progress) {
	            return Math.pow(progress, power);
	        };
	    },

	    /*
	        Each of these base functions is an easeIn
	        
	        On init, we use EasingFunction.mirror and .reverse to generate easeInOut and
	        easeOut functions respectively.
	    */
	    baseEasing = {
	        circ: function (progress) {
	            return 1 - Math.sin(Math.acos(progress));
	        },
	        back: function (progress) {
	            var strength = 1.5;

	            return (progress * progress) * ((strength + 1) * progress - strength);
	        }
	    },
	    
	    /*
	        Mirror easing
	        
	        Mirrors the provided easing function, used here for mirroring an
	        easeIn into an easeInOut
	        
	        @param [number]: Progress, from 0 - 1, of current shift
	        @param [function]: The easing function to mirror
	        @returns [number]: The easing-adjusted delta
	    */
	    mirrorEasing = function (progress, method) {
	        return (progress <= 0.5) ? method(2 * progress) / 2 : (2 - method(2 * (1 - progress))) / 2;
	    },
	            
	    /*
	        Reverse easing
	        
	        Reverses the output of the provided easing function, used for flipping easeIn
	        curve to an easeOut.
	        
	        @param [number]: Progress, from 0 - 1, of current shift
	        @param [function]: The easing function to reverse
	        @returns [number]: The easing-adjusted delta
	    */
	    reverseEasing = function (progress, method) {
	        return 1 - method(1 - progress);
	    },
	    
	    /*
	        Add new easing function
	        
	        Takes name and generates nameIn, nameOut, nameInOut, and easing functions to match
	        
	        @param [string]: Base name of the easing functions to generate
	        @param [function]: Base easing function, as an easeIn, from which to generate Out and InOut
	    */
	    generateVariations = function (name, method) {
	        var easeIn = name + EASE_IN,
	            easeOut = name + EASE_OUT,
	            easeInOut = name + EASE_IN_OUT,
	            baseName = easeIn,
	            reverseName = easeOut;

	        // Create the In function
	        easingManager[baseName] = method;

	        // Create the Out function by reversing the transition curve
	        easingManager[reverseName] = function (progress) {
	            return reverseEasing(progress, easingManager[baseName]);
	        };
	        
	        // Create the InOut function by mirroring the transition curve
	        easingManager[easeInOut] = function (progress) {
	            return mirrorEasing(progress, easingManager[baseName]);
	        };
	    },

	    ModManager = __webpack_require__(59),
	    easingManager = new ModManager();

	/*
	    Extend easing functions
	*/
	easingManager.extend = function (name, x1, y1, x2, y2) {
	    // If this is an easing function, generate variations
	    if (typeof x1 === 'function') {
	        generateVariations(name, x1);

	    // Otherwise it's a bezier curve, so generate new Bezier curve function
	    } else {
	        this[name] = new Bezier(x1, y1, x2, y2);
	    }

	    return this;
	};

	/*
	    Ease value within ranged parameters
	    
	    @param [number]: Progress between 0 and 1
	    @param [number]: Value of 0 progress
	    @param [number]: Value of 1 progress
	    @param [string]: Easing to use
	    @param [number]: Amplify progress out of specified range
	    @return [number]: Value of eased progress in range
	*/  
	easingManager.withinRange = function (progress, from, to, ease, escapeAmp) {
	    var progressLimited = calc.restricted(progress, 0, 1);

	    if (progressLimited !== progress && escapeAmp) {
	        ease = 'linear';
	        progressLimited = progressLimited + ((progress - progressLimited) * escapeAmp);
	    }

	    return calc.valueEased(progressLimited, from, to, this[ease]);
	};
	            
	/*
	    Linear easing adjustment
	    
	    The default easing method, not added with .extend as it has no Out or InOut
	    variation.
	    
	    @param [number]: Progress, from 0-1
	    @return [number]: Unadjusted progress
	*/
	easingManager.linear = function (progress) {
	    return progress;
	};

	// Generate power easing easing
	['ease', 'cubic', 'quart', 'quint'].forEach(function (easingName, i) {
	    baseEasing[easingName] = generatePowerEasing(i + 2);
	});

	// Generate in/out/inOut variations
	for (var key in baseEasing) {
	    if (baseEasing.hasOwnProperty(key)) {
	        generateVariations(key, baseEasing[key]);
	    }
	}

	module.exports = easingManager;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(35),
	    ModManager = __webpack_require__(59),
	    presetManager = new ModManager(),

	    DOT = '.',

	    generateKeys = function (key) {
	        var keys = key.split(DOT),
	            numKeys = keys.length,
	            lastKey = keys[0],
	            i = 1;

	        for (; i < numKeys; i++) {
	            keys[i] = lastKey += DOT + keys[i];
	        }

	        return keys;
	    };

	/*
	    Get defined action
	    
	    @param [string]: The name of the predefined action
	*/
	presetManager.getDefined = function (name) {
	    var props = {},
	        thisProp = {},
	        keys = generateKeys(name),
	        numKeys = keys.length,
	        i = 0;

	    for (; i < numKeys; i++) {
	        thisProp = this[keys[i]];

	        if (thisProp) {
	            props = utils.merge(props, thisProp);
	        }
	    }

	    return props;
	};

	module.exports = presetManager;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var ModManager = __webpack_require__(59),
	    routeManager = new ModManager();

	/*
	    Shard function

	    Run callback once for every value route

	    @param [function]: Function to run for each route
	    @param [object] (optional): Object containing keys of routes to check
	*/
	routeManager.shard = function (callback, validRoutes) {
	    var key = '',
	        route = '',
	        routeIsValid = false,
	        i = 0;

	    for (; i < this._numKeys; i++) {
	        key = this._keys[i];
	        routeIsValid = (validRoutes && validRoutes.hasOwnProperty(key));
	        route = routeIsValid ? validRoutes[key] : {};

	        // If we've been given this route, or this is the default route ('values')
	        if (routeIsValid || key === 'values') {
	            callback(this[key], key, route);
	        }
	    }
	};

	module.exports = routeManager;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var calc = __webpack_require__(30),
	    utils = __webpack_require__(35),
	    speedPerFrame = calc.speedPerFrame,

	    ModManager = __webpack_require__(59),
	    simulationManager = new ModManager();

	/*
	    Add core physics simulations
	*/
	simulationManager

	    /*
	        Velocity
	        
	        The default .run() simulation.
	        
	        Applies any set deceleration and acceleration to existing velocity
	    */
	    .extend('velocity', function (value, duration) {
	        return value.velocity - speedPerFrame(value.deceleration, duration) + speedPerFrame(value.acceleration, duration);
	    })
	    
	    /*
	        Glide
	        
	        Emulates touch device scrolling effects with exponential decay
	        http://ariya.ofilabs.com/2013/11/javascript-kinetic-scrolling-part-2.html
	    */
	    .extend('glide', function (value, duration, started) {
	        var timeUntilFinished = - utils.currentTime() - started,
	            delta = - value.to * Math.exp(timeUntilFinished / value.timeConstant);

	        return (value.to + delta) - value.current;
	    })

	    /*
	        Friction

	        TODO: fold into core physics simulation
	    */
	    .extend('friction', function (value, duration) {
	        var newVelocity = speedPerFrame(value.velocity, duration) * (1 - value.friction);
	        return calc.speedPerSecond(newVelocity, duration);
	    })
	    
	    /*
	        Spring
	    */
	    .extend('spring', function (value, duration) {
	        var distance = value.to - value.current;
	        
	        value.velocity += distance * speedPerFrame(value.spring, duration);
	        
	        return simulationManager.friction(value, duration);
	    })
	    
	    /*
	        Bounce
	        
	        Invert velocity and reduce by provided fraction
	    */
	    .extend('bounce', function (value) {
	        var distance = 0,
	            to = value.to,
	            current = value.current,
	            bounce = value.bounce;
	        
	        // If we're using glide simulation we have to flip our target too
	        if (value.simulate === 'glide') {
	            distance = to - current;
	            value.to = current - (distance * bounce);
	        }
	        
	        return value.velocity *= - bounce;
	    })
	    
	    /*
	        Capture
	        
	        Convert simulation to spring and set target to limit
	    */
	    .extend('capture', function (value, target) {
	        value.to = target;
	        value.simulate = 'spring';
	        value.capture = value.min = value.max = undefined;
	    });

	module.exports = simulationManager;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Actor,

	    /*
	        Generate an Element function
	    */
	    generateFunction = function (name) {
	        return function () {
	            var type = this.type,
	                returnVal;
	            if (type && type[name]) {
	                returnVal = type[name].apply(this, arguments);
	            }
	            return returnVal;
	        };
	    },

	    ModManager = __webpack_require__(59),
	    actorTypeManager = new ModManager();

	actorTypeManager.extend = function (name, mod) {
	    var methodName = '';

	    for (methodName in mod) {
	        if (mod.hasOwnProperty(methodName) && !Actor.prototype[methodName]) {
	            Actor.prototype[methodName] = generateFunction(methodName);
	        }
	    }

	    // Call parent extend method
	    ModManager.prototype.extend.call(this, name, mod);
	};

	actorTypeManager.setActor = function (actor) {
	    Actor = actor;
	};

	module.exports = actorTypeManager;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var ModManager = __webpack_require__(59),
	    valueTypeManager = new ModManager();

	valueTypeManager.defaultProps = function (type, key) {
	    var valueType = this[type],
	        defaultProps = (valueType.defaultProps) ? valueType.defaultProps[key] || valueType.defaultProps : {};

	    return defaultProps;
	};

	valueTypeManager.test = function (value) {
	    var type = false;

	    this.each(function (key, mod) {
	        if (mod.test && mod.test(value)) {
	            type = key;
	        }
	    });

	    return type;
	};

	module.exports = valueTypeManager;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Calculators
	    ----------------------------------------
	    
	    Simple I/O snippets
	*/
	"use strict";

	var utils = __webpack_require__(35),

	    calc = {
	        
	        /*
	            Angle between points
	            
	            Translates the hypothetical line so that the 'from' coordinates
	            are at 0,0, then return the angle using .angleFromCenter()
	            
	            @param [object]: X and Y coordinates of from point
	            @param [object]: X and Y cordinates of to point
	            @return [radian]: Angle between the two points in radians
	        */
	        angle: function (pointA, pointB) {
	            var from = pointB ? pointA : {x: 0, y: 0},
	                to = pointB || pointA,
	                point = {
	                    x: to.x - from.x,
	                    y: to.y - from.y
	                };
	            
	            return this.angleFromCenter(point.x, point.y);
	        },

	        /*
	            Angle from center
	            
	            Returns the current angle, in radians, of a defined point
	            from a center (assumed 0,0)
	            
	            @param [number]: X coordinate of second point
	            @param [number]: Y coordinate of second point
	            @return [radian]: Angle between 0, 0 and point in radians
	        */
	        angleFromCenter: function (x, y) {
	            return this.radiansToDegrees(Math.atan2(y, x));
	        },
	        
	        /*
	            Convert degrees to radians
	            
	            @param [number]: Value in degrees
	            @return [number]: Value in radians
	        */
	        degreesToRadians: function (degrees) {
	            return degrees * Math.PI / 180;
	        },

	        /*
	            Dilate
	            
	            Change the progression between a and b according to dilation.
	            
	            So dilation = 0.5 would change
	            
	            a --------- b
	            
	            to
	            
	            a ---- b
	            
	            @param [number]: Previous value
	            @param [number]: Current value
	            @param [number]: Dilate progress by x
	            @return [number]: Previous value plus the dilated difference
	        */
	        dilate: function (a, b, dilation) {
	            return a + ((b - a) * dilation);
	        },
	            
	        /*
	            Distance
	            
	            Returns the distance between (0,0) and pointA, unless pointB
	            is provided, then we return the difference between the two.
	            
	            @param [object/number]: x and y or just x of point A
	            @param [object/number]: (optional): x and y or just x of point B
	            @return [number]: The distance between the two points
	        */
	        distance: function (pointA, pointB) {
	            return (typeof pointA === "number") ? this.distance1D(pointA, pointB) : this.distance2D(pointA, pointB);
	        },
	    
	        /*
	            Distance 1D
	            
	            Returns the distance between point A and point B
	            
	            @param [number]: Point A
	            @param [number]: (optional): Point B
	            @return [number]: The distance between the two points
	        */
	        distance1D: function (pointA, pointB) {
	            var bIsNum = (typeof pointB === 'number'),
	                from = bIsNum ? pointA : 0,
	                to = bIsNum ? pointB : pointA;
	    
	            return absolute(to - from);
	        },
	    
	      
	        /*
	            Distance 2D
	            
	            Returns the distance between (0,0) and point A, unless point B
	            is provided, then we return the difference between the two.
	            
	            @param [object]: x and y of point A
	            @param [object]: (optional): x and y of point B
	            @return [number]: The distance between the two points
	        */
	        distance2D: function (pointA, pointB) {
	            var bIsObj = (typeof pointB === "object"),
	                from = bIsObj ? pointA : {x: 0, y: 0},
	                to = bIsObj ? pointB : pointA,
	                point = {
	                    x: absolute(to.x - from.x),
	                    y: absolute(to.y - from.y)
	                };
	                
	            return this.hypotenuse(point.x, point.y);
	        },
	            
	        /*
	            Hypotenuse
	            
	            Returns the hypotenuse, side C, given the lengths of sides A and B.
	            
	            @param [number]: Length of A
	            @param [number]: Length of B
	            @return [number]: Length of C
	        */
	        hypotenuse: function (a, b) {
	            var a2 = a * a,
	                b2 = b * b,
	                c2 = a2 + b2;
	                
	            return Math.sqrt(c2);
	        },
	        
	        /*
	            Offset between two inputs
	            
	            Calculate the difference between two different inputs
	            
	            @param [Point]: First input
	            @param [Point]: Second input
	            @return [Offset]: Distance metrics between two points
	        */
	        offset: function (a, b) {
	            var offset = {};
	    
	            for (var key in b) {
	                if (b.hasOwnProperty(key)) {
	                    if (a.hasOwnProperty(key)) {
	                        offset[key] = b[key] - a[key];
	                    } else {
	                        offset[key] = 0;
	                    }
	                } 
	            }

	            if (isNum(offset.x) && isNum(offset.y)) {
	                offset.angle = this.angle(a, b);
	                offset.distance = this.distance2D(a, b);
	            }
	                
	            return offset;
	        },
	        
	        /*
	            Point from angle and distance
	            
	            @param [object]: 2D point of origin
	            @param [number]: Angle from origin
	            @param [number]: Distance from origin
	            @return [object]: Calculated 2D point
	        */
	        pointFromAngleAndDistance: function (origin, angle, distance) {
	            var point = {};
	    
	    		point.x = distance * Math.cos(angle) + origin.x;
	            point.y = distance * Math.sin(angle) + origin.y;
	    
	            return point;
	        },
	    
	        /*
	            Progress within given range
	            
	            Given a lower limit and an upper limit, we return the progress
	            (expressed as a number 0-1) represented by the given value, and
	            limit that progress to within 0-1.
	            
	            @param [number]: Value to find progress within given range
	            @param [number]: Lower limit if full range given, upper if not
	            @param [number] (optional): Upper limit of range
	            @return [number]: Progress of value within range as expressed 0-1
	        */
	        progress: function (value, limitA, limitB) {
	            var bIsNum = (typeof limitB === 'number'),
	                from = bIsNum ? limitA : 0,
	                to = bIsNum ? limitB : limitA,
	                range = to - from,
	                progress = (value - from) / range;
	    
	            return progress;
	        },
	        
	        /*
	            Convert radians to degrees
	            
	            @param [number]: Value in radians
	            @return [number]: Value in degrees
	        */
	        radiansToDegrees: function (radians) {
	            return radians * 180 / Math.PI;
	        },
	    
	        
	        /*
	            Calculate relative value
	            
	            Takes the operator and value from a string, ie "+=5", and applies
	            to the current value to resolve a new target.
	            
	            @param [number]: Current value
	            @param [string]: Relative value
	            @return [number]: New value
	        */
	        relativeValue: function (current, rel) {
	            var newValue = current,
	                equation = rel.split('='),
	                operator = equation[0],
	                splitVal = utils.splitValUnit(equation[1]);

	            switch (operator) {
	                case '+':
	                    newValue += splitVal.value;
	                    break;
	                case '-':
	                    newValue -= splitVal.value;
	                    break;
	                case '*':
	                    newValue *= splitVal.value;
	                    break;
	                case '/':
	                    newValue /= splitVal.value;
	                    break;
	            }
	            
	            if (splitVal.unit) {
	                newValue += splitVal.unit;
	            }
	    
	            return newValue;
	        },
	    
	    
	        /*
	            Restrict value to range
	            
	            Return value within the range of lowerLimit and upperLimit
	            
	            @param [number]: Value to keep within range
	            @param [number]: Lower limit of range
	            @param [number]: Upper limit of range
	            @return [number]: Value as limited within given range
	        */
	        restricted: function (value, min, max) {
	            var restricted = (min !== undefined) ? Math.max(value, min) : value;
	            restricted = (max !== undefined) ? Math.min(restricted, max) : restricted;
	    
	            return restricted;
	        },
	    
	        /*
	            Convert x per second to per frame velocity based on fps
	            
	            @param [number]: Unit per second
	            @param [number]: Frame duration in ms
	        */
	        speedPerFrame: function (xps, frameDuration) {
	            return (isNum(xps)) ? xps / (1000 / frameDuration) : 0;
	        },
	    
	        /*
	            Convert velocity into velicity per second
	            
	            @param [number]: Unit per frame
	            @param [number]: Frame duration in ms
	        */
	        speedPerSecond: function (velocity, frameDuration) {
	            return velocity * (1000 / frameDuration);
	        },
	    
	     
	        /*
	            Value in range from progress
	            
	            Given a lower limit and an upper limit, we return the value within
	            that range as expressed by progress (a number from 0-1)
	            
	            @param [number]: The progress between lower and upper limits expressed 0-1
	            @param [number]: Lower limit of range, or upper if limit2 not provided
	            @param [number] (optional): Upper limit of range
	            @return [number]: Value as calculated from progress within range (not limited within range)
	        */
	        value: function (progress, limitA, limitB) {
	            var bIsNum = (typeof limitB === 'number'),
	                from = bIsNum ? limitA : 0,
	                to = bIsNum ? limitB : limitA;
	    
	            return (- progress * from) + (progress * to) + from; 
	        },
	    
	    
	        /*
	            Eased value in range from progress
	            
	            Given a lower limit and an upper limit, we return the value within
	            that range as expressed by progress (a number from 0-1)
	            
	            @param [number]: The progress between lower and upper limits expressed 0-1
	            @param [number]: Lower limit of range, or upper if limit2 not provided
	            @param [number]: Upper limit of range
	            @param [function]: Easing to apply to value
	            @return [number]: Value as calculated from progress within range (not limited within range)
	        */
	        valueEased: function (progress, from, to, easing) {
	            var easedProgress = easing(progress);
	            
	            return this.value(easedProgress, from, to);
	        }
	    },

	    /*
	        Caching functions used multiple times to reduce filesize and increase performance
	    */
	    isNum = utils.isNum,
	    absolute = Math.abs;
	    
	module.exports = calc;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Process = __webpack_require__(34),
	    Queue = __webpack_require__(61),
	    utils = __webpack_require__(35),
	    update = __webpack_require__(62),
	    valueOps = __webpack_require__(63),
	    actionManager = __webpack_require__(23),
	    routeManager = __webpack_require__(26),
	    actorTypeManager = __webpack_require__(28),

	    Actor = function (element, options) {
	        this.element = element || false;
	        this.values = {};
	        this.output = {};
	        this.queue = new Queue();
	        this.process = new Process(this, update);

	        this.clearOrder();

	        if (options) {
	            this.type = options.type;
	        }

	        // Check if this element is a DOM node, set type to 'dom'
	        if (!this.type && this.element && this.element.nodeType) {
	            this.type = 'dom';
	        }
	    };

	Actor.prototype = {
	    
	    /*
	        Set Action values and properties
	        
	        @param [object]: Element properties
	        @param [string] (option): Name of default value property
	    */
	    set: function (props, defaultValueProp) {
	        var self = this;

	        // Reset Element properties and write new props
	        this.clearOrder();
	        this.resetProps();
	        this.setProps(props);

	        // Loop over routes and process value definitions
	        routeManager.shard(function (route, routeName, values) {
	            // Create output object for this route if none exists
	            self.output[routeName] = self.output[routeName] || {};

	            // Set values
	            self.setValues(values, routeName, defaultValueProp);
	        }, props);

	        return this;
	    },

	    /*
	        Start currently defined Action
	    */
	    start: function () {
	        this.resetProgress();
	        this.activate();
	        return this;
	    },

	    /*
	        Stop current Action
	    */
	    stop: function () {
	        this.queue.clear();
	        this.pause();
	        return this;
	    },

	    /*
	        Pause current Action
	    */
	    pause: function () {
	        this.isActive = false;
	        this.process.stop();
	        return this;
	    },

	    /*
	        Resume paused Action
	    */
	    resume: function () {
	        this.framestamp = this.started = utils.currentTime();
	        this.isActive = true;
	        this.process.start();
	        return this;
	    },

	    /*
	        Toggle current Action
	    */
	    toggle: function () {
	        if (this.isActive) {
	            this.pause();
	        } else {
	            this.resume();
	        }

	        return this;
	    },
	    
	    /*
	        Activate Element Action
	    */
	    activate: function () {
	        this.isActive = true;
	        this.started = utils.currentTime() + this.delay;
	        this.framestamp = this.started;
	        this.firstFrame = true;

	        this.process.start();
	    },

	    reset: function () {
	        this.resetProgress();
	        valueOps.all('reset', this.values);
	        return this;
	    },
	    
	    /*
	        Reset Action progress
	    */
	    resetProgress: function () {
	        this.elapsed = (this.playDirection === 1) ? 0 : this.duration;
	        this.started = utils.currentTime();

	        return this;
	    },
	    
	    /*
	        Loop through all values and create origin points
	    */
	    resetOrigins: function () {
	        valueOps.all('resetOrigin', this.values);
	        return this;
	    },
	    
	    /*
	        Reverse Action progress and values
	    */
	    reverse: function () {
	        this.playDirection *= -1;
	        valueOps.all('retarget', this.values);
	        return this;
	    },
	    
	    /*
	        Swap value origins and to
	    */
	    flipValues: function () {
	        this.elapsed = this.duration - this.elapsed;
	        valueOps.all('flip', this.values);
	        return this;
	    },

	    /*
	        Set properties

	        @param [object]: Properties to set
	    */
	    setProps: function (props) {
	        var key = '';

	        for (key in props) {
	            // Set if this isn't a route
	            if (props.hasOwnProperty(key) && !routeManager.hasOwnProperty(key)) {
	                this[key] = props[key];
	            }
	        }
	    },

	    /*
	        Reset properties to Action defaults
	    */
	    resetProps: function () {
	        this.setProps(actionManager[this.action].actionDefaults);
	        return this;
	    },

	    /*
	        Set values

	        @param [object || string || number]: Value
	        @param [string] (optional): Name of route
	        @param [string] (optional): Default property to set
	    */
	    setValues: function (values, namespace, defaultValueProp) {
	        valueOps.process(values, this, namespace, defaultValueProp);
	        return this;
	    },
	    
	    /*
	        Update order of value keys
	        
	        @param [string]: Key of value
	        @param [boolean]: Whether to move value to back
	    */
	    updateOrder: function (key, moveToBack, hasChildren) {
	        var order = !hasChildren ? this.order : this.parentOrder,
	            position = order.indexOf(key);

	        // If key isn't in list, or moveToBack is set to true, add key
	        if (position === -1 || moveToBack) {
	            order.push(key);

	            // If key already exists, remove
	            if (position !== -1) {
	                order.splice(position, 1);
	            }
	        }

	        return this;
	    },

	    /*
	        Clear value key update order
	    */
	    clearOrder: function () {
	        this.order = [];
	        this.parentOrder = [];
	        return this;
	    },

	    // [boolean]: Is this Element currently active?
	    get isActive() {
	        return this._isActive;
	    },

	    /*
	        Set Element active status

	        If active is being set to true, set hasChanged to true, too

	        @param [boolean]: New active status
	    */
	    set isActive(status) {
	        if (status === true) {
	            this.hasChanged = status;
	        }

	        this._isActive = status;
	    },

	    // [ElementType]
	    get type() {
	        return this._type;
	    },

	    /*
	        Set ElementType

	        @param [string]: Name of new element
	    */
	    set type(type) {
	        this._type = actorTypeManager[type];
	    }
	};

	// Register Actor with actionManager, so when a new Action is set,
	// We get a new method on Actor
	actionManager.setActor(Element);
	actorTypeManager.setActor(Element);

	module.exports = Actor;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Actor = __webpack_require__(31),
	    generateMethodIterator = __webpack_require__(56),
	    actionManager = __webpack_require__(23),

	    /*
	        ElementSystem constructor

	        @param [array]: Array of Elements, or valid Element subjects
	    */
	    ActorGroup = function (members, options) {
	        this.members = [];
	        this.add(members, options);
	    };

	ActorGroup.prototype = {

	    /*
	        Stagger the execution of Element methods

	        @param [string]: Name of method to execute
	        @param [number] (optional): Duration between Elements
	        @param [object] (optional): Properties to pass to method
	        @param [string] (optional): Ease over stagger
	    */
	    stagger: function (method, duration, props, ease) {
	        var self = this,
	            numMembers = this.members.length,
	            i = -1;

	        this._stagger = this._stagger || new Actor();
	        duration = duration || 250;
	        ease = ease || 'linear';

	        this._stagger.stop().play({
	            values: {
	                i: {
	                    current: i,
	                    to: numMembers - 1
	                }
	            },
	            round: true,
	            onChange: function (output) {
	                var newIndex = output.i;
	                
	                // If our new index is only one more than the last
	                if (newIndex === i + 1) {
	                    self.members[newIndex][method](props);
	                    
	                // Or it's more than one more than the last, so fire all indecies
	                } else {
	                    for (var index = i + 1; index <= newIndex; index++) {
	                        self.members[index][method](props);
	                    }
	                }

	                i = newIndex;
	            }
	        }, duration * numMembers, ease);

	        return this;
	    },

	    /*
	        Add a group of Actors to our System

	        @param [array]: Array of Actors, or valid Actor subjects
	    */
	    add: function (members, options) {
	        var numNewMembers = members.length,
	            i = 0,
	            newMember;

	        for (; i < numNewMembers; i++) {
	            newMember = (members[i].prototype !== Actor.prototype) ? new Actor(members[i], options) : members[i];
	            this.members.push(newMember);
	        }

	        return this;
	    }
	};

	// Initialise Element System methods
	(function () {
	    for (var method in Actor.prototype) {
	        if (Actor.prototype.hasOwnProperty(method)) {
	            ActorGroup.prototype[method] = generateMethodIterator(method);
	        }
	    }
	})();

	// Register Element with actionManager, so when a new Action is set,
	// We get a new method on Element
	actionManager.setActorGroup(ActorGroup);

	module.exports = ActorGroup;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Input controller
	*/
	"use strict";

	var calc = __webpack_require__(30),
	    utils = __webpack_require__(35),
	    History = __webpack_require__(64),

	    /*
	        Input constructor
	        
	            Syntax
	                newInput(name, value[, poll])
	                    @param [string]: Name of to track
	                    @param [number]: Initial value
	                    @param [function] (optional): Function to poll Input data
	                    
	                newInput(props[, poll])
	                    @param [object]: Object of values
	                    @param [function] (optional): Function to poll Input data

	        @return [Input]
	    */
	    Input = function () {
	        var pollPos = arguments.length - 1;

	        this.current = {};
	        this.offset = {};
	        this.velocity = {};
	        this.history = new History();
	        this.update(arguments[0], arguments[1]);
	        
	        if (utils.isFunc(arguments[pollPos])) {
	            this.poll = arguments[pollPos];
	        }
	    };

	Input.prototype = {
	    
	    // [number]: Number of frames of inactivity before velocity is turned to 0
	    maxInactiveFrames: 2,
	    
	    // [number]: Number of frames input hasn't been updated
	    inactiveFrames: 0,
	    
	    /*
	        Get latest input values
	        
	        @param [string] (optional): Name of specific property to return
	        @return [object || number]: Latest input values or, if specified, single value
	    */
	    get: function (prop) {
	        var latest = this.history.get(),
	            val = (prop !== undefined) ? latest[prop] : latest;
	        
	        return val;
	    },

	    /*
	        Update the input values
	        
	        Syntax
	            input.update(name, value)
	                @param [string]: Name of to track
	                @param [number]: Initial value
	                
	            input.update(props)
	                @param [object]: Object of values
	                
	        @return [Input]
	    */
	    update: function (arg0, arg1) {
	        var values = {};

	        if (utils.isNum(arg1)) {
	            values[arg0] = arg1;
	        } else {
	            values = arg0;
	        }

	        this.history.add(utils.merge(this.current, values));
	        
	        return this;
	    },
	    
	    /*
	        Check for input movement and update pointer object's properties
	        
	        @param [number]: Timestamp of frame
	        @return [Input]
	    */
	    onFrame: function (timestamp) {
	        var latest, hasChanged;
	        
	        // Check provided timestamp against lastFrame timestamp and return input has already been updated
	        if (timestamp === this.lastFrame) {
	            return;
	        }
	        
	        latest = (this.poll) ? this.poll() : this.history.get();
	        hasChanged = utils.hasChanged(this.current, latest);

	        // If input has changed between frames  
	        if (hasChanged) {
	            this.velocity = calc.offset(this.current, latest);
	            this.current = latest;
	            this.inactiveFrames = 0;

	        // Or it hasn't moved and our frame limit has been reached
	        } else if (this.inactiveFrames >= this.maxInactiveFrames) {
	            this.velocity = calc.offset(this.current, this.current);
	        
	        // Or input hasn't changed
	        } else {
	            this.inactiveFrames++;
	        }
	        
	        this.lastFrame = timestamp;
	        
	        return this;
	    }
	    
	};

	module.exports = Input;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var manager = __webpack_require__(65),

	    /*
	        Process constructor
	        
	        Syntax
	            var process = new Process(scope, callback);
	            var process = new Process(callback);
	    */
	    Process = function (scope, callback) {
	        var hasScope = (callback !== undefined);

	        this.callback = hasScope ? callback : scope;
	        this.scope = hasScope ? scope : this;

	        this.id = manager.register(this);

	        // [boolean]: Is this process currently active?
	        this.isActive = false;

	        // [boolean]: Has this process been killed?
	        this.isKilled = false;
	    };

	Process.prototype = {
	    /*
	        Fire callback
	        
	        @param [timestamp]: Timestamp of currently-executed frame
	        @param [number]: Time since last frame
	    */
	    fire: function (timestamp, elapsed) {
	        // Check timers
	        if (this.isActive) {
	            this.callback.call(this.scope, timestamp, elapsed);
	        }
	        
	        // If we're running at an interval, deactivate again
	        if (this.isInterval) {
	            this.deactivate();
	        }
	        
	        return this;
	    },
	    
	    /*
	        Start process
	        
	        @param [int]: Duration of process in ms, 0 if indefinite
	        @return [this]
	    */
	    start: function (duration) {
	        var self = this;
	        
	        this.reset();
	        this.activate();
	        
	        if (duration) {
	            this.stopTimer = setTimeout(function () {
	                self.stop();
	            }, duration);
	            
	            this.isStopTimerActive = true;
	        }

	        return this;
	    },
	    
	    /*
	        Stop process
	        
	        @return [this]
	    */
	    stop: function () {
	        this.reset();
	        this.deactivate();
	        
	        return this;
	    },
	    
	    /*
	        Activate process
	        
	        @return [this]
	    */
	    activate: function () {
	        if (!this.isKilled) {
	            this.isActive = true;
	            manager.activate(this.id);
	        }

	        return this;
	    },
	    
	    /*
	        Deactivate process
	        
	        @return [this]
	    */
	    deactivate: function () {
	        this.isActive = false;
	        manager.deactivate(this.id);
	        
	        return this;
	    },
	    
	    /*
	        Fire process every x ms
	        
	        @param [int]: Number of ms to wait between refiring process.
	        @return [this]
	    */
	    every: function (interval) {
	        var self = this;

	        this.reset();

	        this.isInterval = true;

	        this.intervalTimer = setInterval(function () {
	            self.activate();
	        }, interval);
	        
	        this.isIntervalTimeActive = true;
	        
	        return this;
	    },
	    
	    /*
	        Clear all timers
	        
	        @param 
	    */
	    reset: function () {
	        this.isInterval = false;
	        
	        if (this.isStopTimerActive) {
	            clearTimeout(this.stopTimer);
	        }
	        
	        if (this.isIntervalTimeActive) {
	            clearInterval(this.intervalTimer);
	        }
	        
	        return this;
	    },
	    
	    /*
	        Kill function in manager, release for garbage collection
	    */
	    kill: function () {
	        this.stop();
	        this.isKilled = true;
	        manager.kill(this.id);
	    }
	};

	module.exports = Process;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Utility functions
	*/
	"use strict";

	var protectedProperties = ['scope',  'dom'],
	    
	    isProtected = function (key) {
	        return (protectedProperties.indexOf(key) !== -1);
	    },

	    /*
	        Get var type as string
	        
	        @param: Variable to test
	        @return [string]: Returns, for instance 'Object' if [object Object]
	    */
	    varType = function (variable) {
	        return Object.prototype.toString.call(variable).slice(8, -1);
	    };

	module.exports = {
	    
	    /*
	        Has one object changed from the other
	        
	        Compares the two provided inputs and returns true if they are different
	        
	        @param [object]: Input A
	        @param [object]: Input B
	        @return [boolean]: True if different
	    */
	    hasChanged: function (a, b) {
	        var hasChanged = false,
	            key = '';

	        for (key in b) {
	            if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
	                if (a[key] !== b[key]) {
	                    hasChanged = true;
	                }
	            } else {
	                hasChanged = true;
	            }
	        }
	    
	        return hasChanged;
	    },
	    
	    /*
	        Is this var a number?
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if typeof === 'number'
	    */
	    isNum: function (num) {
	        return (typeof num === 'number');
	    },
	    
	    /*
	        Is this var an object?
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if typeof === 'object'
	    */
	    isObj: function (obj) {
	        return (typeof obj === 'object');
	    },
	    
	    /*
	        Is this var a function ? 
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if this.varType === 'Function'
	    */
	    isFunc: function (obj) {
	        return (varType(obj) === 'Function'); 
	    },
	    
	    /*
	        Is this var a string ? 
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if typeof str === 'string'
	    */
	    isString: function (str) {
	        return (typeof str === 'string'); 
	    },


	    /*
	        Is this a relative value assignment?
	        
	        @param [string]: Variable to test
	        @return [boolean]: If this looks like a relative value assignment
	    */
	    isRelativeValue: function (value) {
	        return (value && value.indexOf && value.indexOf('=') > 0);
	    },
	    
	    /*
	        Is this var an array ? 
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if this.varType === 'Array'
	    */
	    isArray: function (arr) {
	        return (varType(arr) === 'Array');
	    },
	    
	    /*
	        Copy object or array
	        
	        Checks whether base is an array or object and makes
	        appropriate copy
	        
	        @param [array || object]: Array or object to copy
	        @param [array || object]: New copy of array or object
	    */
	    copy: function (base) {
	        return (this.isArray(base)) ? this.copyArray(base) : this.copyObject(base);
	    },
	    
	    /*
	        Deep copy an object
	        
	        Iterates over an object and creates a new copy of every item,
	        deep copying if it finds any objects/arrays
	        
	        @param [object]: Object to copy
	        @param [object]: New copy of object
	    */
	    copyObject: function (base) {
	        var newObject = {};
	        
	        for (var key in base) {
	            if (base.hasOwnProperty(key)) {
	                newObject[key] = (this.isObj(base[key]) && !isProtected(key)) ? this.copy(base[key]) : base[key];
	            }
	        }
	        
	        return newObject;
	    },
	    
	    /*
	        Deep copy an array
	        
	        Loops through an array and creates a new copy of every item,
	        deep copying if it finds any objects/arrays
	        
	        @param [array]: Array to copy
	        @return [array]: New copy of array
	    */
	    copyArray: function (base) {
	        var newArray = [],
	            length = base.length,
	            i = 0;
	        
	        for (; i < length; i++) {
	            newArray[i] = (this.isObj(base[i])) ? this.copy(base[i]) : base[i];
	        }
	        
	        return newArray;
	    },
	    
	    /*
	        Non-destructive merge of object or array
	        
	        @param [array || object]: Array or object to use as base
	        @param [array || object]: Array or object to overwrite base with
	        @return [array || object]: New array or object
	    */
	    merge: function (base, overwrite) {
	        return (this.isArray(base)) ? this.copyArray(overwrite) : this.mergeObject(base, overwrite);
	    },
	    
	    /*
	        Non-destructive merge of object
	        
	        @param [object]: Object to use as base
	        @param [object]: Object to overwrite base with
	        @return [object]: New object
	    */
	    mergeObject: function (base, overwrite) {
	        var hasBase = this.isObj(base),
	            newObject = hasBase ? this.copy(base) : this.copy(overwrite),
	            key = '';

	        if (hasBase) {
	            for (key in overwrite) {
	                if (overwrite.hasOwnProperty(key)) {
	                    newObject[key] = (this.isObj(overwrite[key]) && !isProtected(key)) ? this.merge(base[key], overwrite[key]) : overwrite[key];
	                }
	            }
	        }
	        return newObject;
	    },
	    
	    /*
	        Split a value into a value/unit object
	        
	            "200px" -> { value: 200, unit: "px" }
	            
	        @param [string]: Value to split
	        @return [object]: Object with value and unit props
	    */
	    splitValUnit: function (value) {
	        var splitVal = value.match(/(-?\d*\.?\d*)(.*)/);

	        return {
	            value: parseFloat(splitVal[1]),
	            unit:  splitVal[2]
	        };
	    },

	    /*
	        Create stepped version of 0-1 progress
	        
	        @param [number]: Current value
	        @param [int]: Number of steps
	        @return [number]: Stepped value
	    */
	    stepProgress: function (progress, steps) {
	        var segment = 1 / (steps - 1),
	            target = 1 - (1 / steps),
	            progressOfTarget = Math.min(progress / target, 1);

	        return Math.floor(progressOfTarget / segment) * segment;
	    },
	    
	    /*
	        Generate current timestamp
	        
	        @return [timestamp]: Current UNIX timestamp
	    */
	    currentTime: function () {
		    return (typeof performance !== "undefined") ? performance.now() : new Date().getTime();
	    }
	    
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    
	    // [number]: Time of animation (if animating) in ms
	    duration: 400,
	    
	    // [string]: Ease animation
	    ease: 'easeInOut',
	    
	    // [number]: Multiply progress by this (.5 is half speed)
	    dilate: 1,
	    
	    // [boolean || number]: Number of times to loop values, true for indefinite
	    loop: false,
	    
	    // [boolean || number]: Number of times to yoyo values, true for indefinite
	    yoyo: false,
	    
	    // [boolean || number]: Number of times to flip values, true for indefinite
	    flip: false
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    // [number]: Duration of animation in ms
	    duration: 400,
	    
	    // [number]: Duration of delay in ms
	    delay: 0,
	    
	    // [number]: Stagger delay as factor of duration (ie 0.2 with duration of 1000ms = 200ms)
	    stagger: 0,
	    
	    // [string]: Easing to apply
	    ease: 'easeInOut',
	    
	    // [number]: Number of steps to execute animation
	    steps: 0,
	    
	    // [string]: Tells Redshift when to step, at the start or end of a step. Other option is 'start' as per CSS spec
	    stepDirection: 'end'
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var parseArgs = __webpack_require__(66),
	    utils = __webpack_require__(35);

	module.exports = {
	    /*
	        Play an animation

	        @param [object || string]: Parameters or preset names
	        @param [object]: Override parameters
	    */
	    play: function () {
	        var action = 'play';

	        // If there's an active Action, and its play, add to queue
	        if (this.isActive && this.action === action) {
	            this.queue.add.apply(this.queue, arguments);
	        
	        // Else, start playing
	        } else {
	            this.action = action;
	            this.set(parseArgs.apply(this, arguments), 'to');
	            this.start();
	        }

	        return this;
	    },

	    /*
	        Check for next steps and perform, stop if not
	    */
	    next: function () {
	        var nextSteps = [{
	                key: 'loop',
	                callback: this.reset
	            }, {
	                key: 'yoyo',
	                callback: this.reverse
	            }, {
	                key: 'flip',
	                callback: this.flipValues
	            }],
	            numSteps = nextSteps.length,
	            hasNextStep = false,
	            i = 0;

	        for (; i < numSteps; ++i) {
	            if (this.checkNextStep(nextSteps[i].key, nextSteps[i].callback)) {
	                hasNextStep = true;
	                break;
	            }
	        }

	        if (!hasNextStep && !this.playNext()) {
	            this.stop();
	        } else {
	            this.isActive = true;
	        }

	        return this;
	    },

	    /*
	        Check next step
	        
	        @param [string]: Name of step ('yoyo' or 'loop')
	        @param [callback]: Function to run if we take this step
	    */
	    checkNextStep: function (key, callback) {
	        var COUNT = 'Count',
	            stepTaken = false,
	            step = this[key],
	            count = this[key + COUNT],
	            forever = (step === true);

	        if (forever || utils.isNum(step)) {
	            ++count;
	            this[key + COUNT] = count;
	            if (forever || count <= step) {
	                callback.call(this);
	                stepTaken = true;
	            }
	        }

	        return stepTaken;
	    },

	    /*
	        Next in playlist
	    */
	    playNext: function () {
	        var stepTaken = false,
	            nextInQueue = this.queue.next(this.playDirection);

	        if (utils.isArray(nextInQueue)) {
	            this.set(parseArgs.apply(this, nextInQueue), 'to')
	                .reset();

	            stepTaken = true;
	        }

	        return stepTaken;
	    }
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var simulations = __webpack_require__(27);

	module.exports = function (simulation, value, duration, started) {
	    var velocity = simulations[simulation](value, duration, started);
	    return (Math.abs(velocity) >= value.stopSpeed) ? velocity : 0;
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    // [int]: Number of frames Action has been inactive
	    inactiveFrames: 0,
	    
	    // [number]: Number of frames of no change before Action is declared inactive
	    maxInactiveFrames: 3
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

	    // [string]: Simulation to .run
	    simulate: 'velocity',
	    
	    // [number]: Deceleration to apply to value, in units per second
	    deceleration: 0,
	    
	    // [number]: Acceleration to apply to value, in units per second
	    acceleration: 0,
	    
	    // [number]: Factor to multiply velocity by on bounce
	    bounce: 0,
	    
	    // [number]: Spring strength during 'string'
	    spring: 80,
	    
	    // [number]: Timeconstant of glide
	    timeConstant: 395,
	    
	    // [number]: Stop simulation under this speed
	    stopSpeed: 5,
	    
	    // [boolean]: Capture with spring physics on limit breach
	    capture: false,
	    
	    // [number]: Friction to apply per frame
	    friction: 0.05

	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var presetManager = __webpack_require__(25),
	    utils = __webpack_require__(35);

	module.exports = function (base, override) {
	    var props = (typeof base === 'string') ? presetManager.getDefined(base) : base;

	    // Override properties with second arg if it's an object
	    if (typeof override === 'object') {
	        props = utils.merge(props, override);
	    }

	    return props;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Input = __webpack_require__(33),
	    currentPointer, // Sort this out for multitouch
	    
	    TOUCHMOVE = 'touchmove',
	    MOUSEMOVE = 'mousemove',

	    /*
	        Convert event into point
	        
	        Scrape the x/y coordinates from the provided event
	        
	        @param [event]: Original pointer event
	        @param [boolean]: True if touch event
	        @return [object]: x/y coordinates of event
	    */
	    eventToPoint = function (event, isTouchEvent) {
	        var touchChanged = isTouchEvent ? event.changedTouches[0] : false;
	        
	        return {
	            x: touchChanged ? touchChanged.clientX : event.pageX,
	            y: touchChanged ? touchChanged.clientY : event.pageY
	        };
	    },
	    
	    /*
	        Get actual event
	        
	        Checks for jQuery's .originalEvent if present
	        
	        @param [event | jQuery event]
	        @return [event]: The actual JS event  
	    */
	    getActualEvent = function (event) {
	        return event.originalEvent || event;
	    },

	    
	    /*
	        Pointer constructor
	    */
	    Pointer = function (e) {
	        var event = getActualEvent(e), // In case of jQuery event
	            isTouch = (event.touches) ? true : false,
	            startPoint = eventToPoint(event, isTouch);
	        
	        this.update(startPoint);
	        this.isTouch = isTouch;
	        this.bindEvents();
	    },
	    
	    proto = Pointer.prototype = new Input();

	/*
	    Bind move event
	*/
	proto.bindEvents = function () {
	    this.moveEvent = this.isTouch ? TOUCHMOVE : MOUSEMOVE;
	    
	    currentPointer = this;
	    
	    document.documentElement.addEventListener(this.moveEvent, this.onMove);
	};

	/*
	    Unbind move event
	*/
	proto.unbindEvents = function () {
	    document.documentElement.removeEventListener(this.moveEvent, this.onMove);
	};

	/*
	    Pointer onMove event handler
	    
	    @param [event]: Pointer move event
	*/
	proto.onMove = function (e) {
	    var newPoint = eventToPoint(e, currentPointer.isTouch);
	    e = getActualEvent(e);
	    e.preventDefault();
	    currentPointer.update(newPoint);
	};

	proto.stop = function () {
	    this.unbindEvents();
	};

	module.exports = Pointer;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    // [number]: Factor of movement outside of maximum range (ie 0.5 will move half as much as 1)
	    escapeAmp: 0
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (values, terms, delimiter, chop) {
	    var combined = '',
	        key = '',
	        i = 0,
	        numTerms = terms.length;

	    for (; i < numTerms; i++) {
	        key = terms[i];

	        if (values.hasOwnProperty(key)) {
	            combined += values[key] + delimiter;
	        }
	    }

	    if (chop) {
	        combined = combined.slice(0, -chop);
	    }

	    return combined;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var splitCommaDelimited = __webpack_require__(67),
	    functionBreak = __webpack_require__(68);

	module.exports = function (value, terms) {
	    var splitValue = {},
	        numTerms = terms.length,
	        colors = splitCommaDelimited(functionBreak(value)),
	        i = 0;

	    for (; i < numTerms; i++) {
	        splitValue[terms[i]] = (colors[i] !== undefined) ? colors[i] : 1;
	    }

	    return splitValue;
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (value, prefix) {
	    return prefix + '(' + value + ')';
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	    color: {
	        min: 0,
	        max: 255,
	        round: true
	    },
	    opacity: {
	        min: 0,
	        max: 1
	    },
	    percent: {
	        min: 0,
	        max: 100,
	        unit: '%'
	    }
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var X = 'X',
	    Y = 'Y',
	    ALPHA = 'Alpha',

	    terms = {
	        colors: ['Red', 'Green', 'Blue', ALPHA],
	        positions: [X, Y, 'Z'],
	        dimensions: ['Top', 'Right', 'Bottom', 'Left'],
	        shadow: [X, Y, 'Radius', 'Spread', 'Color'],
	        hsl: ['Hue', 'Saturation', 'Lightness', ALPHA]
	    };

	module.exports = terms;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (value) {
	    return (typeof value === 'string') ? value.split(' ') : [value];
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var styleDOM = function () {
		var prefixes = ['Webkit','Moz','O','ms', ''],
			prefixesLength = prefixes.length,
			cache = {},
			
			/*
				Test style property for prefixed version
				
				@param [string]: Style property
				@return [string]: Cached property name
			*/
			testPrefix = function (key) {
	            var testElement = document.body;
				
	            cache[key] = key;

				for (var i = 0; i < prefixesLength; i++) {
					var prefixed = prefixes[i] + key.charAt(0).toUpperCase() + key.slice(1);

					if (testElement.style.hasOwnProperty(prefixed)) {
						cache[key] = prefixed;
					}
				}
				
				return cache[key];
			};
		
		/*
			Style DOM functions
		*/
		return {

			/*
				Get DOM styles

				@param [DOM Element]: Element to get styles from
				@param [string]: Name of style to read
			*/
			get: function (element, name) {
				return window.getComputedStyle(element, null)[cache[name] || testPrefix(name)];
			},

			/*
				Set DOM styles

				@param [DOM Element]: Element to set styles on
				@param [object]: Name of style to set
				@param [string]: New rule
			*/
			set: function (element, name, rule) {
				element.style[cache[name] || testPrefix(name)] = rule;
			}

		};
	};

	module.exports = new styleDOM();

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Multi-var getter/setter

	    @param [object || string]: Name of value to get/set
	    @param [string || number] (optional): Single property to set 
	    @param [function]: Getter
	    @param [function]: Setter
	*/
	module.exports = function (opts, prop, getter, setter) {
	    var typeOfOpts = typeof opts;

	    // Set single, if this is a string and we have a property
	    if (typeOfOpts == 'string' && prop) {
	        setter.call(this, opts, prop);

	    // Set multi, if we have an object
	    } else if (typeOfOpts == 'object') {
	        for (var key in opts) {
	            if (opts.hasOwnProperty(key)) {
	                setter.call(this, key, opts[key]);
	            }
	        }

	    // Or get, if we have a string and no props
	    } else {
	        return getter.call(this, opts);
	    }

	    return this;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var transformDictionary = __webpack_require__(69),
	    transformProps = transformDictionary.props,

	    TRANSFORM = 'transform',
	    TRANSLATE_Z = 'translateZ';

	module.exports = function (output, cache) {
	    var css = {},
	        key = '',
	        transform = '',
	        transformHasZ = false,
	        rule = '';

	    // Loop through output, check for transform properties and cache
	    for (key in output) {
	        if (output.hasOwnProperty(key)) {
	            rule = output[key];
	            // If this is a transform property, add to transform string
	            if (transformProps[key]) {
	                transform += key + '(' + rule + ')';
	                transformHasZ = (key === TRANSLATE_Z) ? true : transformHasZ;
	            
	            // Or just assign directly if different from cache
	            } else if (cache[key] !== rule) {
	                cache[key] = css[key] = rule;
	            }
	        }
	    }

	    // If we have transform properties, add translateZ
	    if (transform !== '' && transform !== cache[TRANSFORM]) {
	        if (!transformHasZ) {
	            transform += ' ' + TRANSLATE_Z + '(0px)';
	        }

	        cache[TRANSFORM] = css[TRANSFORM] = transform; 
	    }

	    return css;
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var COLOR = 'color',
	    POSITIONS = 'positions',
	    DIMENSIONS = 'dimensions',
	    SHADOW = 'shadow',
	    ANGLE = 'angle',
	    PX = 'px';

	module.exports = {
	    // Color properties
	    color: COLOR,
	    backgroundColor: COLOR,
	    borderColor: COLOR,
	    borderTopColor: COLOR,
	    borderRightColor: COLOR,
	    borderBottomColor: COLOR,
	    borderLeftColor: COLOR,
	    outlineColor: COLOR,
	    fill: COLOR,
	    stroke: COLOR,

	    // Dimensions
	    margin: DIMENSIONS,
	    padding: DIMENSIONS,

	    // Positions
	    backgroundPosition: POSITIONS,
	    perspectiveOrigin: POSITIONS,
	    transformOrigin: POSITIONS,
	    
	    // Shadows
	    textShadow: SHADOW,
	    boxShadow: SHADOW,

	    // Transform properties
	    rotate: ANGLE,
	    rotateX: ANGLE,
	    rotateY: ANGLE,
	    rotateZ: ANGLE,
	    skewX: ANGLE,
	    skewY: ANGLE,
	    translateX: PX,
	    translateY: PX,
	    translateZ: PX,
	    perspective: PX
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var lookup = __webpack_require__(70),

	    /*
	        Convert percentage to pixels
	        
	        @param [number]: Percentage of total length
	        @param [number]: Total length
	    */
	    percentToPixels = function (percentage, length) {
	        return (parseFloat(percentage) / 100) * length + 'px';
	    };

	/*
	    Create styles
	    
	    @param [object]: SVG Path properties
	    @param [object]: Length of path
	    @returns [object]: Key/value pairs of valid CSS properties
	*/
	module.exports = function (props, pathLength) {
	    var hasArray = false,
	        svgProperty = '',
	        arrayStyles = {
	            length: 0,
	            spacing: pathLength + 'px'
	        },
	        pathStyles = {};

	    // Loop over each property and create related css property
	    for (var key in props) {
	        if (props.hasOwnProperty(key)) {
	            svgProperty = lookup[key] || key;
	            
	            switch (key) {
	                case 'length':
	                case 'spacing':
	                    hasArray = true;
	                    arrayStyles[key] = percentToPixels(props[key], pathLength);
	                    break;
	                case 'offset':
	                    pathStyles[svgProperty] = percentToPixels(-props[key], pathLength);
	                    break;
	                default:
	                   pathStyles[svgProperty] = props[key]; 
	            }
	        }
	    }
	    
	    if (hasArray) {
	        pathStyles[lookup.length] = arrayStyles.length + ' ' + arrayStyles.spacing;
	    }
	console.log(pathStyles);
	    return pathStyles;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
		Generate method iterator
		
		Takes a method name and returns a function that will
		loop over all the Elements in a group and fire that
		method with those properties
		
		@param [string]: Name of method
	*/
	module.exports = function (method) {
		return function () {
	        var numElements = this.members.length,
	            i = 0,
				isGetter = false,
				getterArray = [],
				element,
				elementReturn;
				
			for (; i < numElements; i++) {
				element = this.members[i];
				elementReturn = element[method].apply(element, arguments);

				if (elementReturn != element) {
	    			isGetter = true;
	    			getterArray.push(elementReturn);
				}
			}
			
			return (isGetter) ? getterArray : this;
		};
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    
	    // [number]: Delay this action by x ms
	    delay: 0,
	    
	    // [function]: Callback when Action process starts
	    onStart: undefined,
	    
	    // [function]: Callback when any value changes
	    onChange: undefined,
	    
	    // [function]: Callback every frame
	    onFrame: undefined,
	    
	    // [function]: Callback when Action process ends
	    onEnd: undefined

	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

	    // [number]: Current target value
	    to: undefined,

	    // [number]: Maximum permitted value during .track and .run
	    min: undefined,
	    
	    // [number]: Minimum permitted value during .track and .run
	    max: undefined,
	    
	    // [number]: Origin
	    origin: 0,
	    
	    // [boolean]: Set to true when both min and max detected
	    hasRange: false,

	    // [boolean]: Round output if true
	    round: false

	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var ModManager = function () {
	        this._keys = [];
	        this._numKeys = 0;
	    };

	ModManager.prototype = {

	    /*
	        Add module key to keys list

	        @param [string]: Key to add
	    */
	    _addKey: function (name) {
	        this._keys.push(name);
	        this._numKeys++;
	    },

	    /*
	        Add a new module

	        @param [string || object]: Name of new module or multiple modules
	        @param [object] (optional): Module to add
	    */
	    extend: function (name, mod) {
	        var multiMods = (typeof name == 'object'),
	            mods = multiMods ? name : {},
	            key = '';

	        // If we just have one module, coerce
	        if (!multiMods) {
	            mods[name] = mod;
	        }

	        for (key in mods) {
	            if (mods.hasOwnProperty(key)) {
	                this._addKey(key);
	                this[key] = mods[key];
	            }
	        }

	        return this;
	    },

	    each: function (callback) {
	        var key = '';

	        for (var i = 0; i < this._numKeys; i++) {
	            key = this._keys[i];
	            callback(key, this[key]);
	        }
	    }
	};

	module.exports = ModManager;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	    Bezier function generator
	        
	    Gaëtan Renaudeau's BezierEasing
	    https://github.com/gre/bezier-easing/blob/master/index.js  
	    https://github.com/gre/bezier-easing/blob/master/LICENSE
	    You're a hero
	    
	    Use
	    
	        var easeOut = new Bezier(.17,.67,.83,.67),
	            x = easeOut(0.5); // returns 0.627...
	*/
	"use strict";

	var NEWTON_ITERATIONS = 8,
	    NEWTON_MIN_SLOPE = 0.001,
	    SUBDIVISION_PRECISION = 0.0000001,
	    SUBDIVISION_MAX_ITERATIONS = 10,
	    K_SPLINE_TABLE_SIZE = 11,
	    K_SAMPLE_STEP_SIZE = 1.0 / (K_SPLINE_TABLE_SIZE - 1.0),
	    FLOAT_32_SUPPORTED = 'Float32Array' in global,
	    
	    a = function (a1, a2) {
	        return 1.0 - 3.0 * a2 + 3.0 * a1;
	    },
	    
	    b = function (a1, a2) {
	        return 3.0 * a2 - 6.0 * a1;
	    },
	    
	    c = function (a1) {
	        return 3.0 * a1;
	    },

	    getSlope = function (t, a1, a2) {
	        return 3.0 * a(a1, a2) * t * t + 2.0 * b(a1, a2) * t + c(a1);
	    },

	    calcBezier = function (t, a1, a2) {
	        return ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
	    },
	    
	    /*
	        Bezier constructor
	    */
	    Bezier = function (mX1, mY1, mX2, mY2) {
	        var sampleValues = FLOAT_32_SUPPORTED ? new Float32Array(K_SPLINE_TABLE_SIZE) : new Array(K_SPLINE_TABLE_SIZE),
	            _precomputed = false,
	    
	            binarySubdivide = function (aX, aA, aB) {
	                var currentX, currentT, i = 0;

	                do {
	                    currentT = aA + (aB - aA) / 2.0;
	                    currentX = calcBezier(currentT, mX1, mX2) - aX;
	                    if (currentX > 0.0) {
	                        aB = currentT;
	                    } else {
	                        aA = currentT;
	                    }
	                } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

	                return currentT;
	            },
	        
	            newtonRaphsonIterate = function (aX, aGuessT) {
	                var i = 0,
	                    currentSlope = 0.0,
	                    currentX;
	                
	                for (; i < NEWTON_ITERATIONS; ++i) {
	                    currentSlope = getSlope(aGuessT, mX1, mX2);
	                    
	                    if (currentSlope === 0.0) {
	                        return aGuessT;
	                    }
	                    
	                    currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	                    aGuessT -= currentX / currentSlope;
	                }
	                
	                return aGuessT;
	            },
	            
	            
	            calcSampleValues = function () {
	                for (var i = 0; i < K_SPLINE_TABLE_SIZE; ++i) {
	                    sampleValues[i] = calcBezier(i * K_SAMPLE_STEP_SIZE, mX1, mX2);
	                }
	            },
	            
	            
	            getTForX = function (aX) {
	                var intervalStart = 0.0,
	                    currentSample = 1,
	                    lastSample = K_SPLINE_TABLE_SIZE - 1,
	                    dist = 0.0,
	                    guessForT = 0.0,
	                    initialSlope = 0.0;
	                    
	                for (; currentSample != lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
	                    intervalStart += K_SAMPLE_STEP_SIZE;
	                }
	                
	                --currentSample;
	                
	                dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample+1] - sampleValues[currentSample]);
	                guessForT = intervalStart + dist * K_SAMPLE_STEP_SIZE;
	                
	                initialSlope = getSlope(guessForT, mX1, mX2);
	                
	                // If slope is greater than min
	                if (initialSlope >= NEWTON_MIN_SLOPE) {
	                    return newtonRaphsonIterate(aX, guessForT);
	                // Slope is equal to min
	                } else if (initialSlope === 0.0) {
	                    return guessForT;
	                // Slope is less than min
	                } else {
	                    return binarySubdivide(aX, intervalStart, intervalStart + K_SAMPLE_STEP_SIZE);
	                }
	            },
	            
	            precompute = function () {
	                _precomputed = true;
	                if (mX1 != mY1 || mX2 != mY2) {
	                    calcSampleValues();
	                }
	            },
	            
	            /*
	                Generated function
	                
	                Returns value 0-1 based on X
	            */
	            f = function (aX) {
	                var returnValue;

	                if (!_precomputed) {
	                    precompute();
	                }
	                
	                // If linear gradient, return X as T
	                if (mX1 === mY1 && mX2 === mY2) {
	                    returnValue = aX;
	                    
	                // If at start, return 0
	                } else if (aX === 0) {
	                    returnValue = 0;
	                    
	                // If at end, return 1
	                } else if (aX === 1) {
	                    returnValue = 1;

	                } else {
	                    returnValue = calcBezier(getTForX(aX), mY1, mY2);
	                }
	                
	                return returnValue;
	            };
	            
	            return f;
	    };

	module.exports = Bezier;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Queue = function () {
	        this.clear();
	    };

	Queue.prototype = {
	    
	    /*
	        Add a set of arguments to queue
	    */
	    add: function () {
	        this.queue.push([].slice.call(arguments));
	    },
	    
	    /*
	        Get next set of arguments from queue
	    */
	    next: function (direction) {
	        var queue = this.queue,
	            returnVal = false,
	            index = this.index;
	            
	        direction = (arguments.length) ? direction : 1;
	        
	        // If our index is between 0 and the queue length, return that item
	        if (index >= 0 && index < queue.length) {
	            returnVal = queue[index];
	            this.index = index + direction;
	        
	        // Or clear
	        } else {
	            this.clear();
	        }
	        
	        return returnVal;
	    },

	    /*
	        Replace queue with empty array
	    */
	    clear: function () {
	        this.queue = [];
	        this.index = 0;
	    }
	};

	module.exports = Queue;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var actionManager = __webpack_require__(23),
	    routeManager = __webpack_require__(26),
	    valueTypeManager = __webpack_require__(29),
	    calc = __webpack_require__(30),

	    defaultRoute = 'values',

	    update = function (framestamp, frameDuration) {
	        var self = this,
	            values = this.values,
	            action = actionManager[this.action],
	            valueAction = action,
	            output = this.output,
	            numActiveValues = this.order.length,
	            numActiveParents = this.parentOrder.length,
	            key = '',
	            value = {},
	            updatedValue = 0,
	            i = 0;

	        // Update Input and attach new values to output
	        if (this.input) {
	            output.input = this.input.onFrame(framestamp);
	        }

	        // Update Action input
	        if (action.onFrameStart) {
	            action.onFrameStart.call(this, frameDuration);
	        }

	        // Fire onStart if first frame
	        if (this.firstFrame) {
	            routeManager.shard(function (route) {
	                if (route.onStart) {
	                    route.onStart(values, self);
	                }
	            }, output);
	        }

	        // Create default route output if not present
	        output[defaultRoute] = output[defaultRoute] || {};

	        // Update values
	        for (; i < numActiveValues; i++) {
	            // Get value and key
	            key = this.order[i];
	            value = values[key];

	            // Load value-specific action
	            valueAction = value.link ? actionManager.link : action;

	            // Calculate new value
	            updatedValue = valueAction.process.call(this, key, value, frameDuration);

	            // Limit if range
	            if (valueAction.limit) {
	                updatedValue = valueAction.limit(updatedValue, value);
	            }

	            // Round value if round set to true
	            if (value.round) {
	                updatedValue = Math.round(updatedValue);
	            }

	            // Update change from previous frame
	            value.frameChange = updatedValue - value.current;

	            // Calculate velocity if Action hasn't already
	            if (!valueAction.calculatesVelocity) {
	                value.velocity = calc.speedPerSecond(value.frameChange, frameDuration);
	            }

	            // Update current speed
	            value.speed = Math.abs(value.velocity);

	            // Check if changed and update
	            if (value.current != updatedValue) {
	                this.hasChanged = true;
	            }

	            // Set current
	            this.values[key].current = updatedValue;

	            // Put value in default route output
	            output[defaultRoute][key] = (value.unit) ? updatedValue + value.unit : updatedValue;

	            // Put in specific root if not a parent
	            if (!value.parent) {
	                output[value.route][value.name] = output[defaultRoute][key];

	            // Or add to parent output, to be combined
	            } else {
	                output[value.parent] = output[value.parent] || {};
	                output[value.parent][value.propName] = output[defaultRoute][key];
	            }
	        }

	        // Update parent values from calculated children
	        for (i = 0; i < numActiveParents; i++) {
	            key = this.parentOrder[i];
	            value = this.values[key];

	            // Update parent value current property
	            value.current = valueTypeManager[value.type].combine(output[key]);

	            // Update output
	            output[value.route][value.name] = output[defaultRoute][key] = value.current;
	        }

	        // Run onFrame and onChange for every output
	        routeManager.shard(function (route, routeName, routeOutput) {

	            // Fire onFrame every frame
	            if (route.onFrame) {
	                route.onFrame(routeOutput, self);
	            }

	            // Fire onChanged if any value has changed
	            if (self.hasChanged && route.onChange || self.firstFrame && route.onChange) {
	                route.onChange(routeOutput, self);
	            }

	        }, output);

	        // Fire onEnd if this Action has ended
	        if (action.hasEnded.call(this, this.hasChanged)) {
	            this.isActive = false;

	            routeManager.shard(function (route, routeName, routeOutput) {
	                if (route.onEnd) {
	                    route.onEnd(routeOutput, self);
	                }
	            }, output);

	            // If is a play action, and is not active, check next action
	            if (!this.isActive && this.action === 'play' && this.next) {
	                this.next();
	            }
	        } else {
	            this.hasChanged = false;
	        }

	        this.firstFrame = false;
	        this.framestamp = framestamp;
	    };

	module.exports = function () {
	    if (this.isActive) {
	        update.apply(this, arguments);
	    }
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var calc = __webpack_require__(30),
	    utils = __webpack_require__(35),
	    isNum = utils.isNum,
	    actionsManager = __webpack_require__(23),
	    valueTypesManager = __webpack_require__(29),
	    routeManager = __webpack_require__(26),

	    numericalValues = ['current', 'to', 'start', 'min', 'max'],
	    numNumericalValues = numericalValues.length;

	module.exports = {


	    /*
	        Perform operation on set of values
	        
	        @parma [string]: Name of operation
	        @param [object]: Value object
	    */
	    all: function (op, values) {
	        var key = '';

	        for (key in values) {
	            if (values.hasOwnProperty(key)) {
	                this[op](values[key]);
	            }
	        }

	        return this;
	    },

	    /*
	        Reset the value current to its origin

	        @param [object]: Value object
	    */
	    reset: function (value) {
	        this.retarget(value);
	        value.current = value.origin;
	    },

	    /*
	        Set value origin property to current value
	        
	        @param [object]: Value object
	    */
	    resetOrigin: function (value) {
	        value.origin = value.current;
	    },

	    /*
	        Set value to property back to target
	        
	        @param [object]: Value object
	    */
	    retarget: function (value) {
	        value.to = value.target;
	    },

	    /*
	        Swap value to and origin property
	        
	        @param [object]: Value object
	    */
	    flip: function (value) {
	        var newOrigin = (value.target !== undefined) ? value.target : value.current;

	        value.target = value.to = value.origin;
	        value.origin = newOrigin;
	    },

	    /*
	        Returns an initial value state

	        @param [number] (optional): Initial current
	        @return [object]: Default value state
	    */
	    initialState: function (start, route) {
	        return {
	            // [number]: Current value
	            current: start || 0,
	            
	            // [number]: Change per second
	            speed: 0,
	            
	            // [number]: Change per second plus direction (ie can be negative)
	            velocity: 0,
	            
	            // [number]: Amount value has changed in the most recent frame
	            frameChange: 0,

	            route: route
	        };
	    },

	    /*
	        Split value into sub-values

	        @param [string]: Name of value
	        @param [object]: Base value properties
	        @param [Elememt]
	    */
	    split: function (name, value, actor, valueType) {
	        var splitValues = {},
	            splitProperty = {},
	            propertyName = '',
	            key = '',
	            i = 0;

	        for (; i < numNumericalValues; i++) {
	            propertyName = numericalValues[i];

	            if (value.hasOwnProperty(propertyName)) {
	                if (utils.isFunc(value[propertyName])) {
	                    value[propertyName] = value[propertyName].call(actor);
	                }

	                splitProperty = valueType.split(value[propertyName]);

	                // Assign properties to each new value
	                for (key in splitProperty) {
	                    if (splitProperty.hasOwnProperty(key)) {
	                        // Create new value if it doesn't exist
	                        splitValues[key] = splitValues[key] || utils.copy(valueTypesManager.defaultProps(value.type, key));
	                        splitValues[key][propertyName] = splitProperty[key];
	                    }
	                }
	            }
	        }

	        return splitValues;
	    },

	    /*
	        Split value into number and unit, set unit to value if present

	        @param [string]: Property to split
	        @param [object]: Value object to save unit to
	    */
	    splitUnit: function (property, value) {
	        var returnVal = property,
	            splitUnitValue;

	        // Check for unit property
	        if (utils.isString(property)) {
	            splitUnitValue = utils.splitValUnit(property);

	            if (!isNaN(splitUnitValue.value)) {
	                returnVal = splitUnitValue.value;
	                value.unit = splitUnitValue.unit;
	            }
	        }

	        return returnVal;
	    },

	    /*
	        Resolve property

	        @param [string]: Name of value
	        @param [string || number || function]: Property
	        @param [object]: Parent value
	        @param [actor]: Parent actor
	    */
	    resolve: function (name, property, value, actor) {
	        var currentValue = value.current || 0,
	            isNumericalValue = (numericalValues.indexOf(name) > -1);

	        // If this is a function, resolve
	        if (utils.isFunc(property)) {
	            property = property.call(actor, currentValue);
	        }

	        // If this is a string, check for relative values and units
	        if (utils.isString(property)) {
	            // If this is a relative value (ie '+=10')
	            if (property.indexOf('=') > 0) {
	                property = calc.relativeValue(currentValue, property);
	            }

	            // Check for unit if should be numerical property
	            if (isNumericalValue) {
	                this.splitUnit(property, value);
	            }
	        }

	        // If this is a numerical value, coerce
	        if (isNumericalValue) {
	            property = parseFloat(property);
	        }

	        return property;
	    },

	    /*
	        Preprocess new values


	    */
	    preprocess: function (values, actor, route, suffix, defaultValueProp) {
	        var preprocessedValues = {},
	            value = {},
	            splitValue = {},
	            childValue = {},
	            type = {},
	            existingValue = {},
	            isValueObj = false,
	            key = '',
	            namespacedKey = '',
	            propKey = '';

	        defaultValueProp = defaultValueProp || 'current';

	        for (key in values) {
	            if (values.hasOwnProperty(key)) {

	                isValueObj = utils.isObj(values[key]);
	                value = (isValueObj) ? values[key] : {};
	                namespacedKey = key + suffix;
	                existingValue = actor.values[namespacedKey];

	                value.name = key;

	                if (isValueObj) {
	                    value[defaultValueProp] = values[key];
	                }

	                // If this value doesn't have a special type, check for one
	                if (!value.type && utils.isString(value[defaultValueProp])) {

	                    // Check if existing value with this key
	                    if (existingValue && existingValue.type) {
	                        value.type = existingValue.type;
	                    
	                    // Or if this route has a typemap
	                    } else if (route.typeMap && route.typeMap[key]) {
	                        value.type = route.typeMap[key];

	                    // Otherwise, check by running tests
	                    } else {
	                        value.type = valueTypesManager.test(value[defaultValueProp]);
	                    }
	                }

	                // Set value
	                preprocessedValues[namespacedKey] = value;

	                // If process has type, split or assign default props
	                if (value.type) {
	                    type = valueTypesManager[value.type];

	                    // If this has a splitter function, split
	                    if (type.split) {
	                        value.children = {};
	                        splitValue = this.split(key, value, actor, type);

	                        for (propKey in splitValue) {
	                            if (splitValue.hasOwnProperty(propKey)) {
	                                childValue = utils.merge(value, splitValue[propKey]);
	                                childValue.parent = key + suffix;
	                                childValue.name = key;
	                                childValue.propName = propKey;
	                                delete childValue.type;
	                                delete childValue.children;

	                                preprocessedValues[key + propKey + suffix] = childValue;
	                            }
	                        }
	                    } else {
	                        preprocessedValues[namespacedKey] = utils.merge(valueTypesManager.defaultProps(value.type, key), value);
	                    }
	                }
	            }
	        }

	        return preprocessedValues;
	    },

	    /*
	        Process new values
	    */
	    process: function (values, actor, namespace, defaultValueProp) {
	        var route = routeManager[namespace],
	            namespaceSuffix = (namespace === 'values') ? '' : '.' + namespace,
	            preprocessedValues = this.preprocess(values, actor, route, namespaceSuffix, defaultValueProp),
	            key = '',
	            propKey = '',
	            preprocessedValue = {},
	            thisValue = {},
	            defaultProps = actionsManager[actor.action].valueDefaults,
	            hasChildren = false,
	            prop;

	        for (key in preprocessedValues) {
	            if (preprocessedValues.hasOwnProperty(key)) {
	                preprocessedValue = preprocessedValues[key];
	                thisValue = actor.values[key] || this.initialState(this.resolve('start', preprocessedValue.start, {}, actor), namespace);
	                hasChildren = (thisValue.children !== undefined);

	                // Inherit properties from Actor
	                for (propKey in defaultProps) {
	                    if (defaultProps.hasOwnProperty(propKey)) {
	                        thisValue[propKey] = actor[propKey];
	                    } else {
	                        thisValue[propKey] = defaultProps[propKey];
	                    }
	                }

	                // Loop through all properties and resolve
	                for (propKey in preprocessedValue) {
	                    if (preprocessedValue.hasOwnProperty(propKey)) {
	                        prop = preprocessedValue[key];

	                        thisValue[propKey] = (!isNum(prop) && !hasChildren) ? this.resolve(propKey, prop, thisValue, actor) : prop;

	                        if (propKey === 'to') {
	                            thisValue.target = thisValue.to;
	                        }
	                    }
	                }

	                thisValue.origin = thisValue.current;
	                thisValue.hasRange = (isNum(thisValue.min) && isNum(thisValue.max)) ? true  : false;

	                actor.values[key] = thisValue;
	                actor.updateOrder(key, utils.isString(thisValue.link), hasChildren);
	            }
	        }
	    }
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var // [number]: Default max size of history
	    maxHistorySize = 3,
	    
	    /*
	        History constructor
	        
	        @param [var]: Variable to store in first history slot
	        @param [int] (optional): Maximum size of history
	    */
	    History = function (obj, max) {
	        this.max = max || maxHistorySize;
	        this.entries = [];
	        this.add(obj);
	    };
	    
	History.prototype = {
	    
	    /*
	        Push new var to history
	        
	        Shift out oldest entry if we've reached maximum capacity
	        
	        @param [var]: Variable to push into history.entries
	    */
	    add: function (obj) {
	        var currentSize = this.getSize();
	        
	        this.entries.push(obj);
	        
	        if (currentSize >= this.max) {
	            this.entries.shift();
	        }
	    },
	    
	    /*
	        Get variable at specified index

	        @param [int]: Index
	        @return [var]: Var found at specified index
	    */
	    get: function (i) {
	        i = (typeof i === 'number') ? i : this.getSize() - 1;

	        return this.entries[i];
	    },
	    
	    /*
	        Get the second newest history entry
	        
	        @return [var]: Entry found at index size - 2
	    */
	    getPrevious: function () {
	        return this.get(this.getSize() - 2);
	    },
	    
	    /*
	        Get current history size
	        
	        @return [int]: Current length of entries.length
	    */
	    getSize: function () {
	        return this.entries.length;
	    }
	    
	};

	module.exports = History;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var theLoop = __webpack_require__(71),
	    ProcessManager = function () {
	        this.all = {};
	        this.active = [];
	        this.deactivateQueue = [];
	        theLoop.setCallback(this, this.fireActive);
	    };
	    
	ProcessManager.prototype = {
	    
	    /*
	        [int]: Used for process ID
	    */
	    processCounter: 0,
	    
	    /*
	        [int]: Number of active processes
	    */
	    activeCount: 0,
	    
	    /*
	        Get the process with a given index
	        
	        @param [int]: Index of process
	        @return [Process]
	    */
	    getProcess: function (i) {
	        return this.all[i];
	    },
	    
	    /*
	        Get number of active processes
	        
	        @return [int]: Number of active processes
	    */
	    getActiveCount: function () {
	        return this.activeCount;
	    },
	    
	    /*
	        Get active tokens

	        @return [array]: Active tokens
	    */
	    getActive: function () {
	        return this.active;
	    },
	    
	    /*
	        Get the length of the deactivate queue
	        
	        @return [int]: Length of queue
	    */
	    getQueueLength: function () {
	        return this.deactivateQueue.length;
	    },
	    
	    /*
	        Fire all active processes
	        
	        @param [int]: Timestamp of executing frames
	        @param [int]: Time since previous frame
	        @return [boolean]: True if active processes found
	    */
	    fireActive: function (framestamp, elapsed) {
	        var process,
	            activeCount = 0,
	            activeProcesses = [];

	        // Purge and check active count before execution
	        this.purge();
	        activeCount = this.getActiveCount();
	        activeProcesses = this.getActive();
	        
	        // Loop through active processes and fire callback
	        for (var i = 0; i < activeCount; i++) {
	            process = this.getProcess(activeProcesses[i]);
	            
	            if (process) {
	                process.fire(framestamp, elapsed);
	            }
	        }

	        // Repurge and recheck active count after execution
	        this.purge();
	        activeCount = this.getActiveCount();
	        
	        return activeCount ? true : false;
	    },
	    
	    /*
	        Register a new process
	        
	        @param [Process]
	        @return [int]: Index of process to be used as ID
	    */
	    register: function (process) {
	        var id = this.processCounter;

	        this.all[id] = process;
	        
	        this.processCounter++;
	        
	        return id;
	    },
	    
	    /*
	        Activate a process
	        
	        @param [int]: Index of active process
	    */
	    activate: function (i) {
	        var queueIndex = this.deactivateQueue.indexOf(i),
	            isQueued = (queueIndex > -1),
	            isActive = (this.active.indexOf(i) > -1);
	        
	        // Remove from deactivateQueue if in there
	        if (isQueued) {
	            this.deactivateQueue.splice(queueIndex, 1);
	        }
	        
	        // Add to active processes array if not already in there
	        if (!isActive) {
	            this.active.push(i);
	            this.activeCount++;
	            theLoop.start(this);
	        }
	    },
	    
	    /*
	        Deactivate a process
	        
	        @param [int]: Index of process to add to deactivate queue
	    */
	    deactivate: function (i) {
	        this.deactivateQueue.push(i);
	    },
	    
	    /*
	        Purge the deactivate queue
	    */
	    purge: function () {
	        var activeIndex,
	            queueLength = this.getQueueLength();
	        
	        while (queueLength--) {
	            activeIndex = this.active.indexOf(this.deactivateQueue[queueLength]);
	            
	            // If process in active list deactivate
	            if (activeIndex > -1) {
	                this.active.splice(activeIndex, 1);
	                this.activeCount--;
	            }
	        }
	        
	        this.deactivateQueue = [];
	    },
	    
	    /*
	        Remove the provided id and reindex remaining processes
	    */
	    kill: function (id) {
	        delete this.all[id];
	    }
	    
	};

	module.exports = new ProcessManager();

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var presetManager = __webpack_require__(25),
	    utils = __webpack_require__(35),

	    parsePlaylist = function (args) {
	        var playlist = args[0].split(' '),
	            playlistLength = playlist.length,
	            props = presetManager.getDefined(playlist[0]),
	            i = 1;

	        // If we've got multiple playlists, loop through and add each to the queue
	        if (playlistLength > 1) {
	            for (; i < playlistLength; i++) {
	                args.shift();
	                args.unshift(playlist[i]);
	                this.queue.add.apply(this.queue, args);
	            }
	        }

	        return props;
	    };

	module.exports = function () {
	    var args = [].slice.call(arguments),
	        numArgs = args.length,
	        // If first argument is a string, get base object from presets
	        props = utils.isString(args[0]) ? parsePlaylist.apply(this, args) : args[0],
	        i = 1;

	    // Loop through arguments
	    for (; i < numArgs; i++) {
	        switch (typeof args[i]) {
	            // Override properties
	            case 'object':
	                props = utils.merge(props, args[i]);
	                break;
	            // Duration
	            case 'number':
	                props.duration = args[i];
	                break;
	            // Easing
	            case 'string':
	                props.ease = props[i];
	                break;
	        }
	    }

	    // Default .play properties
	    props.loopCount = props.yoyoCount = props.flipCount = 0;
	    props.playDirection = 1;

	    return props;
	};


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (value) {
	    return (typeof value === 'string') ? value.split(/,\s*/) : [value];
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (value) {
	    return value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var positionTerms = __webpack_require__(49).positions,
	    numPositionTerms = positionTerms.length,

	    TRANSFORM_PERSPECTIVE = 'transformPerspective',
	    SCALE = 'scale',
	    ROTATE = 'rotate',
	    terms = {
	        funcs: ['translate', SCALE, ROTATE, 'skew', TRANSFORM_PERSPECTIVE],
	        props: {} // objects are faster at direct lookups
	    };

	// Create transform terms
	(function () {
	    var funcs = terms.funcs,
	        props = terms.props,
	        numFuncs = funcs.length,
	        i = 0,

	        createProps = function (funcName) {
	            var j = 0;

	            for (; j < numPositionTerms; j++) {
	                props[funcName + positionTerms[j]] = true;
	            }
	        };
	    
	    // Manually add skew and transform perspective  
	    props[ROTATE] = props[SCALE] = props[TRANSFORM_PERSPECTIVE] = true;
	    
	    // Loop over each function name and create function/property terms
	    for (; i < numFuncs; i++) {
	        createProps(funcs[i]);
	    }
	})();

	module.exports = terms;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var STROKE = 'stroke',
	    DASH = STROKE + '-dash', // stoke-width
	    DASH_ARRAY = DASH + 'array';

	module.exports = {
	    opacity: STROKE + '-opacity',
	    width: STROKE + '-width',
	    offset: DASH + 'offset',
	    length: DASH_ARRAY,
	    spacing: DASH_ARRAY,
	    miterlimit: STROKE + '-miterlimit'
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    The loop
	*/
	"use strict";

	var Timer = __webpack_require__(72),
	    tick = __webpack_require__(73),
	    Loop = function () {
	        this.timer = new Timer();
	    };
	    
	Loop.prototype = {
	    
	    /*
	        [boolean]: Current status of animation loop
	    */
	    isRunning: false,
	    
	    /*
	        Fire all active processes once per frame
	    */
	    frame: function () {
	        var self = this;
	        
	        tick(function () {
	            var framestamp = self.timer.update(), // Currently just measuring in ms - will look into hi-res timestamps
	                isActive = self.callback.call(self.scope, framestamp, self.timer.getElapsed());

	            if (isActive) {
	                self.frame(true);
	            } else {
	                self.stop();
	            }
	        });
	    },
	    
	    /*
	        Start loop
	    */
	    start: function () {
	        // Make sure we're not already running a loop
	        if (!this.isRunning) {
	            this.timer.clock();
	            this.isRunning = true;
	            this.frame();
	        }
	    },
	    
	    /*
	        Stop the loop
	    */
	    stop: function () {
	        this.isRunning = false;
	    },
	    
	    /*
	        Set the callback to run every frame
	        
	        @param [Object]: Execution context
	        @param [function]: Callback to fire
	    */
	    setCallback: function (scope, callback) {
	        this.scope = scope;
	        this.callback = callback;
	    }
	 
	};

	module.exports = new Loop();

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(35),

	    maxElapsed = 33,
	    Timer = function () {
	        this.elapsed = 16.7;
	        this.current = utils.currentTime();
	        this.update();
	    };

	Timer.prototype = {
	    update: function () {
	        this.prev = this.current;
	        this.current = utils.currentTime();
	        this.elapsed = Math.min(this.current - this.prev, maxElapsed);

	        return this.current;
	    },

	    getElapsed: function () {
	        return this.elapsed;
	    },
	    
	    clock: function () {
	        this.current = utils.currentTime();
	    }
	};

	module.exports = Timer;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	    requestAnimationFrame polyfill
	    
	    For IE8/9 Flinstones

	    Taken from Paul Irish. We've stripped out cancelAnimationFrame checks because we don't fox with that
	    
	    http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	    http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	     
	    requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	     
	    MIT license
	*/
	var tick,
	    lastTime = 0,
	    hasWindow = (typeof window !== 'undefined');

	if (!hasWindow) {
	    // Load rAF shim
	    tick = function (callback) {
	        var currTime = new Date().getTime(),
	            timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	            id = setTimeout(function () {
	                callback(currTime + timeToCall);
	            }, timeToCall);

	        lastTime = currTime + timeToCall;
	        
	        return id;
	    };  
	    
	} else {
	    tick = window.requestAnimationFrame;
	}

	module.exports = tick;

/***/ }
/******/ ]);