function Summary (selector, options) {
    var self = this;

    self.selector = selector;
    self.rfids = self.selector.attr("data-filter").split(" ");
    self.rfid_data = options.rfids;
    self.rfid_nums = Object.keys(self.rfid_data);
    self.total_rfids = self.rfid_nums.length;
    self.data_id = self.selector.attr("data-id");
    self.status_data = {};

    self.selector.find('.summary-content').append('<ol></ol>');
    var list = self.selector.find('.summary-content ol');

    // Set initial data to be alarm for everything
    for (var i in self.rfid_nums) {
        var rfid_num = self.rfid_nums[i];
        self.status_data[rfid_num] = 'alarm';
        list.append('<li id="summary-' + rfid_num + '" class="alarm">' + self.rfid_data[rfid_num] + '</li>');
    }

    console.log(self.rfid_nums);

    this.onClose = function() {
    }

    this.onMessage = function(data) {
        if (data.type === "alert") {
            var rfid = data.data.rfidTagNum;
            self.status_data[rfid] = data.data.status;

            var status_class;
            if (data.data.status === 'ok') {
                status_class = 'ok';
            }
            else if (data.data.status === 'in-progress') {
                status_class = 'risk';
            }
            else {
                status_class = 'alarm';
            }
            
            self.selector.find('#summary-' + rfid).removeClass('ok risk alarm').addClass(status_class);

            var alarm = 0;
            var risk = 0;
            var ok = 0;

            for (var i in self.status_data) {
                var status = self.status_data[i];
                switch (status) {
                    case 'alarm':
                    alarm++;
                    break;
                    case 'in-progress':
                    risk++;
                    break;
                    case 'ok':
                    ok++;
                    break;
                }
            }

            var percent_alarm = Math.floor(100 * alarm / self.total_rfids);
            var percent_risk = Math.floor(100 * risk / self.total_rfids);
            var percent_ok = Math.floor(100 * ok / self.total_rfids);

            self.selector.find('.summary-chart > .alarm').css({width: percent_alarm + "%"});
            self.selector.find('.summary-chart > .risk').css({width: percent_risk + "%"});
            self.selector.find('.summary-chart > .ok').css({width: percent_ok + "%"});
        }
    };

    this.onOpen = function() {
    };
}