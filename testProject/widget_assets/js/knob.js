/**
 * Knob widget
 * Created by: Andrew Hassan
 *
 * This widget is a simple knob representing the current data value
 */

function Knob(widgetSelector, options) {
    this.selector = widgetSelector;
    this.threshold = options['threshold'];
    this.minTemp = options['min_temp'];
    this.maxTemp = options['max_temp'];
    this.inverted = options['inverted_threshold'] || false;

    this.dataId = widgetSelector.attr('data-id');
    this.rfid = parseInt(widgetSelector.attr('data-filter').substring(5));
    this.lastTimestamp = null;
    this.timeout = null;

    var content = $("#knob-content", widgetSelector);
    var temperatureContainer = $(".knob-temperature", widgetSelector);
    var timestampContainer = $("#knob-timestamp", widgetSelector);
    var self = this;

    this.time = function () {
        clearTimeout(self.timeout);
        if (self.lastTimestamp !== null) {
            timestampContainer.html(moment.unix(self.lastTimestamp).fromNow());
        }

        self.timeout = setTimeout(self.time, parseInt(9000 + 3000*Math.random()));
    }

    this.onMessage = function(event) {
        var data = event['data'];
        var type = event['type'];
        switch(type) {
            case "data":
                var temp = data['rfidTemperature'];
                if (temp === null) {
                    return;
                }

                temperatureContainer.html("<div class='knob-temperature-text'>" + temp + "</div>" +
                    "<div class='knob-temperature-unit'>ºC</div>");
                //console.log(self.rfid + " data");
                self.lastTimestamp = data['timestamp'];
                self.time();
                self.lineGraphUpdate({temperature: temp});
                break;
            case "alert":
                if (data['status'] === "ok") {
                    self.gauge.updateValue(0, 0);
                }
                else {
                    var value = Math.floor(parseInt(event['data']['message']));
                    if (value < 1) {
                        value = 1;
                    }
                    else if (value > 100) {
                        value = 100;
                    }

                    self.gauge.updateValue(value, value);
                }
                break;
        }
    };
    this.onOpen = function() {
        self.lastTimestamp = null;
        timestampContainer.html("Waiting for new data...");
        temperatureContainer.removeClass("collapse");
        $("#loader-" + self.dataId).remove();
        self.selector.find(".knob-help").popover({
            placement: "auto",
            trigger: "hover",
            content: "If a sensor is over or under it's temperature limit, " +
                "the application will start counting towards an alarm. Once the " +
                "sensor has been over or under the limit for 2 hours, an alarm is raised, " +
                "which signifies that something needs to be done. If the temperature goes within " +
                "the acceptable threshold, the alarm timer is cleared and an 'OK' appears."
        });

        var knobGraph = $("#knob-graph-" + self.dataId);
        self.gauge = null;
        knobGraph.empty();
        var width = Math.min(knobGraph.width()/2, 175);
        self.gauge = new SuperGauge(
            "#knob-graph-" + self.dataId,
            0,
            0,
            width,
            width,
            "alarm in",
            ["#e74c3c", "#f1c40f", "#aaaaaa"],
            2*60*60);

        // Make GET request for data
        $.ajax({
            url: '/data?rfid=' + self.rfid,
            success: function(data) {
                var temps = [];
                for (var event in data) {
                    if (data[event]['rfidTemperature'] !== null) {
                        temps.push({temperature: data[event]['rfidTemperature']});
                    }
                }

                self.lineGraphUpdate = new LineGraph("#knob-line-graph-" + self.dataId,
                    temps,
                    knobGraph.width(),
                    width,
                    self.threshold,
                    self.minTemp,
                    self.maxTemp,
                    self.inverted
                );
            }
        });
    }
}
