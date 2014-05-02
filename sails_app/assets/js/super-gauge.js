/**
 * KNOB CLASS
 *
 * This class is used to emulate some of the jQuery knob control functionality.
 *
 * Params:
 *		selector: The id of the html element you want the svg to be in.
 *		value: The value (out of 100) you want the knob to represent.
 *       delta: The amount of time in seconds to display
 *		width: The width of the control.
 *		height: The height of the control.
 *		colors: The colors to use for the control. [Good color as hex, neutral color as hex, bad color as hex]
 *	    maxTime: When it reaches 100%, it is the time in seconds
 *
 * Requires:
 *       d3.js
 */
function SuperGauge(selector, value, delta, width, height, label, colors, maxTime, popover_data) {
    if (value < 0) {
        this.value = 0;
    }
    else if (value > 100) {
        this.value = 100;
    } else {
        this.value = value;
    }
    this.selector = selector;
    this.width = width;
    this.height = height;
    this.label = label;
    this.delta = delta;
    this.maxTime = maxTime || 2*60*60; // 2 hours

    if (typeof (colors) === "undefined") {
        this.colors = ["#e74c3c", "#f1c40f", "#2ecc71"];
    }
    else {
        this.colors = colors;
    }

    this.radius = Math.min(this.width, this.height) / 2;

    this.svg = d3.select(this.selector)
        .append("svg")
        .attr("class", "knob")
        .attr("width", this.width)
        .attr("height", this.height);

    if (popover_data !== undefined && popover_data !== null) {
        $(this.svg.node()).popover(popover_data);
    }

    this.pieSlice = function(d) {
        return [{ data: d, startAngle: 0, endAngle: (d / 100) * 2 * Math.PI }];
    };

    this.dataArc = d3.svg.arc()
        .innerRadius(0.9 * this.radius)
        .outerRadius(0.99 * this.radius);

    d3.select(this.selector).select(".knob")
        .data(this.pieSlice(100))
        .append("g")
        .attr("class", "backdrop")
        .append("path")
        .attr("d", this.dataArc)
        .attr("transform", "translate(" + this.width / 2 + ", " + this.height / 2 + ")")
        .attr("style", "fill:#e0e0e0;");

    this.dataSvg = d3.select(this.selector).select(".knob")
        .append("g")
        .attr("class", "data-knob")
        .attr("transform", "translate(" + (this.width / 2) + ", " + (this.height / 2) + ")");

    d3.select(this.selector).select(".knob")
        .append("g")
        .attr("class", "text");

    var tempC = this.colors;

    this.dataPath = this.dataSvg
        .selectAll("path")
        .data(this.pieSlice(this.value))
        .enter()
        .append("path")
        .attr("fill", function(d) {
            if (d.data < 50) {
                var i = d3.interpolateRgb(tempC[2], tempC[1]);
                return i(2 * d.data / 100);
            }
            else {
                var i = d3.interpolateRgb(tempC[1], tempC[0]);
                return i(2 * (d.data - 50) / 100);
            }
        })
        .attr("d", this.dataArc);

    this.labelSvg = d3.select(this.selector).select(".text")
        .append("text")
        .attr("class", "backdrop-label")
        .attr("x", this.width / 2)
        .attr("y", this.height / 2 - this.radius / 3)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("style", "font-size:" + this.radius / 7 + "pt; font-weight: 100; fill: #666666")
        .text(this.label);

    var centerText = humanizeTime(this.maxTime - (this.delta / 100 * this.maxTime));
    if (Math.floor(this.delta) === 0) {
        this.labelSvg.attr("class", "collapse");
        centerText = "OK";
    }
    else if (Math.floor(this.delta) >= 100) {
        this.labelSvg.attr("class", "collapse");
        centerText = "!";
    }

    this.textSvg = d3.select(this.selector).select(".text")
        .append("text")
        .attr("class", "backdrop-text")
        .attr("x", this.width / 2)
        .attr("y", 11 * this.height / 16)
        .attr("text-anchor", "middle")
        .attr("dy", "-0.55em")
        .attr("dx", "0")
        .attr("fill", "#555")
        .attr("style", "font-size:" + this.radius * 2 / 7 + "pt;")
        .text(centerText);

}

SuperGauge.prototype.updateValue = function(newValue, delta) {
    var self = this;
    if (newValue < 0) {
        return;
    }
    var old = this.pieSlice(this.value);
    var oldDelta = this.pieSlice(this.delta);
    this.value = (newValue > 100 ? 100 : newValue);
    this.delta = delta;

    if (Math.floor(newValue) > 0 && Math.floor(newValue) < 100) {
        this.labelSvg.attr("class", "");
    }
    else {
        this.labelSvg.attr("class", "collapse");
    }

    var tempC = this.colors;
    var dataArc = this.dataArc;

    this.dataPath.data(this.pieSlice(this.value));
    this.dataPath
        .transition()
        .duration(1000)
        .attr("fill", function(d) {
            if (d.data < 50) {
                var i = d3.interpolateRgb(tempC[2], tempC[1]);
                return i(2 * d.data / 100);
            } else {
                var i = d3.interpolateRgb(tempC[1], tempC[0]);
                return i(2 * (d.data - 50) / 100);
            }
        })
        .attrTween("d", function(d, i, a) {
            var i = function(t) {
                return { data: d.data, startAngle: 0, endAngle: t * (d.endAngle - old[0].endAngle) + old[0].endAngle };
            };
            return function(t) { return dataArc(i(t)); };
        });

    var temp = this.delta;
    d3.select(this.selector).selectAll(".backdrop-text")
        .data([this.delta])
        .text(oldDelta.data)
        .transition()
        .duration(1000)
        .tween("text", function(d) {
            var i = function(t) {
                return oldDelta[0].data + t * (temp - oldDelta[0].data);
            };

            return function(t) {
                if (Math.floor(i(t)) === 0) {
                    this.textContent = "OK";
                }
                else if (Math.floor(i(t)) >= 100) {
                    this.textContent = "!";
                }
                else {
                    this.textContent = humanizeTime(self.maxTime - (i(t) / 100 * self.maxTime));
                }

            };
        });
};

function humanizeTime(time) {
    var hours = 0;
    var minutes = 0;

    hours = Math.floor(time / 3600);
    minutes = Math.floor((time % 3600) / 60);

    return zeroPad(hours, 2) + ":" + zeroPad(minutes, 2);

}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}