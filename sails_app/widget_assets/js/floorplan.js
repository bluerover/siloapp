function FloorPlan (selector, options) {
    var self = this;

    this.selector = selector;
    this.rfids = this.selector.attr("data-filter").split(" ");
    this.rfid_data = options.rfids;
    this.data_id = this.selector.attr("data-id")
    this.floorplan_svg = options.floorplan;

    this.svg_loaded = false;
    this.data_backlog = [];

    this.onClose = function() {
        self.svg_loaded = false;
        self.data_backlog = [];
    }

    this.onMessage = function(data) {
        console.log(data);
        var rfid = data.data.rfidTagNum;

        // Otherwise update text
        if (!self.svg_loaded) {
            self.data_backlog.push(data);
            return;
        }

        // Set colour on alert
        if (data.type === "alert") {
            var status = data.data.status;
            self.selector.find("svg #floorplan-" + rfid)
                .removeAttr("class")
                .attr("class", status);
            return;
        }

        var temperature = data.data.rfidTemperature;
        //var name = self.rfid_data[rfid].name;

        // Update the label text
        self.selector.find("#floorplan-" + rfid + "-text")[0].
            textContent = Math.round(temperature*100)/100 + "ºC";
    };

    this.onOpen = function() {
        self.selector.find(".loading-div").hide();

        self.svg = Snap("#floorplan-svg");
        Snap.load(self.floorplan_svg, function(f) {
            self.svg.append(f);
            var g = self.svg.select("g");
            //g.drag(); // Make it draggable
            for (var i in self.rfid_data) {
                var clickHandler = function () {
                    var rfid = this.node.id.replace("floorplan-", "").replace("-text", "");
                    var $selector = $("[data-filter='rfid-" + rfid + "']");
                    $selector.addClass("highlight");
                    setTimeout(function() {
                        $selector.removeClass("highlight")
                    }, 2000);

                    $('html, body').animate({
                        scrollTop: $selector.offset().top - 10
                    }, 500);
                };

                var text = g.text(self.rfid_data[i].label_x, self.rfid_data[i].label_y, "")
                    .attr({
                        'id': "floorplan-" + i + "-text",
                        'class': "floorplan_label",
                        "stroke": "white",
                        "stroke-width": "0.75pt"
                    })
                    .click(clickHandler);
                g.circle(self.rfid_data[i].anchor_x, self.rfid_data[i].anchor_y, 4).attr({
                    stroke: "#888888",
                    fill: "#EEEEEE",
                    opacity: 0.5
                });
                for (var j in self.rfid_data[i].lines) {
                    g.line(self.rfid_data[i].lines[j].x1,
                        self.rfid_data[i].lines[j].y1,
                        self.rfid_data[i].lines[j].x2,
                        self.rfid_data[i].lines[j].y2)
                        .attr({
                            stroke: "#AAAAAA",
                            "stroke-width": "1.5pt"
                        });
                }
            }
            self.svg_loaded = true;
            for (var i in self.data_backlog) {
                self.onMessage(self.data_backlog[i]);
            }

            $("polyline[id]").on('click', function() {
                var rfid = this.id.replace("floorplan-", "").replace("-text", "");
                var $selector = $("[data-filter='rfid-" + rfid + "']");
                $selector.addClass("highlight");
                setTimeout(function() {
                    $selector.removeClass("highlight")
                }, 2000);

                $('html, body').animate({
                    scrollTop: $selector.offset().top - 10
                }, 500);
            });
        });
    };
}