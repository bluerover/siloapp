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
        var rfid = data.data.rfidTagNum;

        // Otherwise update text
        if (!self.svg_loaded) {
            self.data_backlog.push(data);
            return;
        }

        // Set colour on alert
        if (data.type === "alert") {
            var status = data.data.status;
            var id = self.rfid_data[rfid].id;
            if (id !== null && id !== undefined) {
                self.selector.find("svg #" + id + "-indicator")
                   .removeAttr("class")
                   .attr("class", status);
            }
        }
    };

    this.onOpen = function() {
        self.selector.find(".loading-div").hide();

        self.svg = Snap("#floorplan-svg");
        Snap.load(self.floorplan_svg, function(f) {
            self.svg.append(f);
            var g = self.svg.select("g");

            $('[id*="-indicator"]').each(function () {
                var indicator = $(this);
                indicator.on('click', function () {
                    var asset_id = indicator.attr('id').slice(0, -"-indicator".length);
                    var rfid = null;
                    for (var i in self.rfid_data) {
                        if (self.rfid_data[i].id === asset_id) {
                            rfid = i;
                            break;
                        }
                    }

                    var $selector = $("[data-filter='rfid-" + rfid + "']");
                    $selector.addClass("highlight");
                    setTimeout(function() {
                        $selector.removeClass("highlight")
                    }, 2000);

                    $('html, body').animate({
                        scrollTop: $selector.offset().top - 10
                    }, 500);
                })
            });

            self.svg_loaded = true;
            for (var i in self.data_backlog) {
                self.onMessage(self.data_backlog[i]);
            }
        });
    };
}