(function (c, e, f, b) {
  var i = "parallax";
  var g = 30;
  var d = {relativeInput: false, clipRelativeInput: false, calibrationThreshold: 100, calibrationDelay: 500, supportDelay: 500, calibrateX: false, calibrateY: true, invertX: true, invertY: true, limitX: false, limitY: false, scalarX: 10, scalarY: 10, frictionX: 0.1, frictionY: 0.1};

  function h(l, j) {
    this.element = l;
    this.$context = c(l).data("api", this);
    this.$layers = this.$context.find(".layer");
    var m = {calibrateX: this.$context.data("calibrate-x") || null, calibrateY: this.$context.data("calibrate-y") || null, invertX: this.$context.data("invert-x") || null, invertY: this.$context.data("invert-y") || null, limitX: parseFloat(this.$context.data("limit-x")) || null, limitY: parseFloat(this.$context.data("limit-y")) || null, scalarX: parseFloat(this.$context.data("scalar-x")) || null, scalarY: parseFloat(this.$context.data("scalar-y")) || null, frictionX: parseFloat(this.$context.data("friction-x")) || null, frictionY: parseFloat(this.$context.data("friction-y")) || null};
    for (var k in m) {
      if (m[k] === null) {
        delete m[k]
      }
    }
    c.extend(this, d, j, m);
    this.calibrationTimer = null;
    this.calibrationFlag = true;
    this.enabled = false;
    this.depths = [];
    this.raf = null;
    this.bounds = null;
    this.ex = 0;
    this.ey = 0;
    this.ew = 0;
    this.eh = 0;
    this.ecx = 0;
    this.ecy = 0;
    this.cx = 0;
    this.cy = 0;
    this.ix = 0;
    this.iy = 0;
    this.mx = 0;
    this.my = 0;
    this.vx = 0;
    this.vy = 0;
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
    this.onOrientationTimer = this.onOrientationTimer.bind(this);
    this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.initialise()
  }

  h.prototype.transformSupport = function (s) {
    var n = f.createElement("div");
    var q = false;
    var m = null;
    var p = false;
    var r = null;
    var j = null;
    for (var o = 0, k = this.vendors.length;
         o < k;
         o++) {
      if (this.vendors[o] !== null) {
        r = this.vendors[o][0] + "transform";
        j = this.vendors[o][1] + "Transform"
      } else {
        r = "transform";
        j = "transform"
      }
      if (n.style[j] !== b) {
        q = true;
        break
      }
    }
    switch (s) {
      case"2D":
        p = q;
        break;
      case"3D":
        if (q) {
          f.body.appendChild(n);
          n.style[j] = "translate3d(1px,1px,1px)";
          m = e.getComputedStyle(n).getPropertyValue(r);
          p = m !== b && m.length > 0 && m !== "none";
          f.body.removeChild(n)
        }
        break
    }
    return p
  };
  h.prototype.ww = null;
  h.prototype.wh = null;
  h.prototype.wcx = null;
  h.prototype.wcy = null;
  h.prototype.portrait = null;
  h.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
  h.prototype.vendors = [null, ["-webkit-", "webkit"], ["-moz-", "Moz"], ["-o-", "O"], ["-ms-", "ms"]];
  h.prototype.motionSupport = !!e.DeviceMotionEvent;
  h.prototype.orientationSupport = !!e.DeviceOrientationEvent;
  h.prototype.orientationStatus = 0;
  h.prototype.transform2DSupport = h.prototype.transformSupport("2D");
  h.prototype.transform3DSupport = h.prototype.transformSupport("3D");
  h.prototype.initialise = function () {
    if (this.$context.css("position") === "static") {
      this.$context.css({position: "relative"})
    }
    this.$layers.css({position: "absolute", display: "block", height: "100%", width: "100%", left: 0, top: 0});
    this.$layers.first().css({position: "relative"});
    this.$layers.each(c.proxy(function (j, k) {
      this.depths.push(c(k).data("depth") || 0)
    }, this));
    this.accelerate(this.$context);
    this.accelerate(this.$layers);
    this.updateDimensions();
    this.enable();
    this.queueCalibration(this.calibrationDelay)
  };
  h.prototype.updateDimensions = function () {
    this.ww = e.innerWidth;
    this.wh = e.innerHeight;
    this.wcx = this.ww / 2;
    this.wcy = this.wh / 2
  };
  h.prototype.queueCalibration = function (j) {
    clearTimeout(this.calibrationTimer);
    this.calibrationTimer = setTimeout(this.onCalibrationTimer, j)
  };
  h.prototype.enable = function () {
    if (!this.enabled) {
      this.enabled = true;
      if (this.orientationSupport) {
        this.portrait = null;
        e.addEventListener("deviceorientation", this.onDeviceOrientation);
        setTimeout(this.onOrientationTimer, this.supportDelay)
      } else {
        this.cx = 0;
        this.cy = 0;
        this.portrait = false;
        e.addEventListener("mousemove", this.onMouseMove)
      }
      e.addEventListener("resize", this.onWindowResize);
      this.raf = requestAnimationFrame(this.onAnimationFrame)
    }
  };
  h.prototype.disable = function () {
    if (this.enabled) {
      this.enabled = false;
      if (this.orientationSupport) {
        e.removeEventListener("deviceorientation", this.onDeviceOrientation)
      } else {
        e.removeEventListener("mousemove", this.onMouseMove)
      }
      e.removeEventListener("resize", this.onWindowResize);
      cancelAnimationFrame(this.raf)
    }
  };
  h.prototype.calibrate = function (j, k) {
    this.calibrateX = j === b ? this.calibrateX : j;
    this.calibrateY = k === b ? this.calibrateY : k
  };
  h.prototype.invert = function (j, k) {
    this.invertX = j === b ? this.invertX : j;
    this.invertY = k === b ? this.invertY : k
  };
  h.prototype.friction = function (j, k) {
    this.frictionX = j === b ? this.frictionX : j;
    this.frictionY = k === b ? this.frictionY : k
  };
  h.prototype.scalar = function (j, k) {
    this.scalarX = j === b ? this.scalarX : j;
    this.scalarY = k === b ? this.scalarY : k
  };
  h.prototype.limit = function (j, k) {
    this.limitX = j === b ? this.limitX : j;
    this.limitY = k === b ? this.limitY : k
  };
  h.prototype.clamp = function (l, k, j) {
    l = Math.max(l, k);
    l = Math.min(l, j);
    return l
  };
  h.prototype.css = function (m, p, o) {
    var n = null;
    for (var k = 0, j = this.vendors.length;
         k < j;
         k++) {
      if (this.vendors[k] !== null) {
        n = c.camelCase(this.vendors[k][1] + "-" + p)
      } else {
        n = p
      }
      if (m.style[n] !== b) {
        m.style[n] = o;
        break
      }
    }
  };
  h.prototype.accelerate = function (k) {
    for (var n = 0, j = k.length;
         n < j;
         n++) {
      var m = k[n];
      this.css(m, "transform", "translate3d(0,0,0)");
      this.css(m, "transform-style", "preserve-3d");
      this.css(m, "backface-visibility", "hidden")
    }
  };
  h.prototype.setPosition = function (k, j, l) {
    j += "%";
    l += "%";
    if (this.transform3DSupport) {
      this.css(k, "transform", "translate3d(" + j + "," + l + ",0)")
    } else {
      if (this.transform2DSupport) {
        this.css(k, "transform", "translate(" + j + "," + l + ")")
      } else {
        k.style.left = j;
        k.style.top = l
      }
    }
  };
  h.prototype.onOrientationTimer = function (j) {
    if (this.orientationSupport && this.orientationStatus === 0) {
      this.disable();
      this.orientationSupport = false;
      this.enable()
    }
  };
  h.prototype.onCalibrationTimer = function (j) {
    this.calibrationFlag = true
  };
  h.prototype.onWindowResize = function (j) {
    this.updateDimensions()
  };
  h.prototype.onAnimationFrame = function () {
    var m = this.ix - this.cx;
    var k = this.iy - this.cy;
    if ((Math.abs(m) > this.calibrationThreshold) || (Math.abs(k) > this.calibrationThreshold)) {
      this.queueCalibration(0)
    }
    if (this.portrait) {
      this.mx = (this.calibrateX ? k : this.iy) * this.scalarX;
      this.my = (this.calibrateY ? m : this.ix) * this.scalarY
    } else {
      this.mx = (this.calibrateX ? m : this.ix) * this.scalarX;
      this.my = (this.calibrateY ? k : this.iy) * this.scalarY
    }
    if (!isNaN(parseFloat(this.limitX))) {
      this.mx = this.clamp(this.mx, -this.limitX, this.limitX)
    }
    if (!isNaN(parseFloat(this.limitY))) {
      this.my = this.clamp(this.my, -this.limitY, this.limitY)
    }
    this.vx += (this.mx - this.vx) * this.frictionX;
    this.vy += (this.my - this.vy) * this.frictionY;
    for (var o = 0, j = this.$layers.length;
         o < j;
         o++) {
      var r = this.depths[o];
      var n = this.$layers[o];
      var p = this.vx * r * (this.invertX ? -1 : 1);
      var q = this.vy * r * (this.invertY ? -1 : 1);
      this.setPosition(n, p, q)
    }
    this.raf = requestAnimationFrame(this.onAnimationFrame)
  };
  h.prototype.onDeviceOrientation = function (k) {
    if (!this.desktop && k.beta !== null && k.gamma !== null) {
      this.orientationStatus = 1;
      var j = (k.beta || 0) / g;
      var m = (k.gamma || 0) / g;
      var l = e.innerHeight > e.innerWidth;
      if (this.portrait !== l) {
        this.portrait = l;
        this.calibrationFlag = true
      }
      if (this.calibrationFlag) {
        this.calibrationFlag = false;
        this.cx = j;
        this.cy = m
      }
      this.ix = j;
      this.iy = m
    }
  };
  h.prototype.onMouseMove = function (j) {
    if (!this.orientationSupport && this.relativeInput) {
      this.bounds = this.element.getBoundingClientRect();
      this.ex = this.bounds.left;
      this.ey = this.bounds.top;
      this.ew = this.bounds.width;
      this.eh = this.bounds.height;
      this.ecx = this.ew / 2;
      this.ecy = this.eh / 2;
      this.ix = (j.clientX - this.ex - this.ecx) / this.ecx;
      this.iy = (j.clientY - this.ey - this.ecy) / this.ecy;
      if (this.clipRelativeInput) {
        this.ix = Math.max(this.ix, -1);
        this.ix = Math.min(this.ix, 1);
        this.iy = Math.max(this.iy, -1);
        this.iy = Math.min(this.iy, 1)
      }
    } else {
      this.ix = (j.clientX - this.wcx) / this.wcx;
      this.iy = (j.clientY - this.wcy) / this.wcy
    }
  };
  var a = {enable: h.prototype.enable, disable: h.prototype.disable, calibrate: h.prototype.calibrate, friction: h.prototype.friction, invert: h.prototype.invert, scalar: h.prototype.scalar, limit: h.prototype.limit};
  c.fn[i] = function (k) {
    var j = arguments;
    return this.each(function () {
      var m = c(this);
      var l = m.data(i);
      if (!l) {
        l = new h(this, k);
        m.data(i, l)
      }
      if (a[k]) {
        l[k].apply(l, Array.prototype.slice.call(j, 1))
      }
    })
  }
})(window.jQuery || window.Zepto, window, document);



var leefplezierApp = angular.module('leefplezier', ['ngRoute', 'leefplezierControllers']);
var leefplezierControllers = angular.module('leefplezierControllers', []);

leefplezierApp.config(['$routeProvider', 
  function($routeProvider) {
  $routeProvider
    .when('/news', {
      controller:'NewsCtrl',
      templateUrl:'views/news-list.html'
    })
    .when('/publications', {
      controller:'PublicationCtrl',
      templateUrl:'views/publication-list.html'
    })
    .when('/contact', {
      templateUrl:'views/contact.html'
    })
    .when('/researchers', {
      controller:'ResearcherCtrl',
      templateUrl:'views/researcher-list.html'
    })
    .otherwise({
      redirectTo:'/',
      templateUrl:'views/information.html'
    });
    
    // enable html5Mode for pushstate ('#'-less URLs)
    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');
}]);
