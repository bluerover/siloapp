var naiveSocketSingleton = false;

function SocketMultiplexer(domain, port) {
    if (naiveSocketSingleton) {
        throw new TypeError('There should only be one SocketMultiplexer object per page');
    }
    else {
        naiveSocketSingleton = true;
    }

    this.socketDict = {};
    this.socketData = {};
    this.socketList = [];
    this.numReconnects = 0;

    var onData = function(self, data) {
        for (var filter in self.socketDict) {
            if (filter in data) {
                for (var subscriber in self.socketDict[filter]) {
                    try {
                        self.socketDict[filter][subscriber].onmessage(data[filter]);
                    }
                    catch(e) { }
                }
            }
        }
    }

    var openConnection = function(self) {
        self.numReconnects = 0;
        self.socketConnected = true;

        console.log("SocketMux: Opened connection");

        for (var f in self.socketData) {
            self.socket.emit('message', JSON.stringify(self.socketData[f]));
        }

        for (var socket in self.socketList) {
            try {
                self.socketList[socket].onopen();
            }
            catch(e) { }
        }
    };

    var closeConnection = function(self) {
        console.log("SocketMux: Socket closed")

        for (var socket in self.socketData) {
            try {
                self.socketData[socket].onclose();
            }
            catch(e) { }
        }

        setTimeout(function() { connectSocket(self); }, 10000);
    }

    function connectSocket(self) {
        self.socketConnected = false;
        try {
            console.log("SocketMux: Attempting to connect via SockJS")
            self.socket = io.connect();
            self.socket.on('connect', function() { 
                openConnection(self); 
                self.socket.on('message', function(d) {
                    onData(self, d);
                });
                self.socket.on('disconnect', function() {
                    closeConnection(self);
                });
            });
        }
        catch(e) {
            console.log("SocketMux: SockJS connection failed");
            if (self.numReconnects < 10) {
                self.numReconnects += 1;
                console.log("SocketMux: Retrying connection (" + self.numReconnects + ")");
                setTimeout(function() { connectSocket(self); }, 10000);
            }
            else {
                console.log("SocketMux: Maximum retry limit reached");
            }
        }
    }

    var self = this;
    connectSocket(self);
}

SocketMultiplexer.prototype.newConnection = function(data) {
    var filter = data['filter'];
    if (!(filter in this.socketDict)) {
        this.socketDict[filter] = [];
    }

    if (!this.socketConnected) {
        console.log("SocketMux: The socket has not been established yet, but your filter data will be sent when the connection is live.");
    }
    else {
        this.socket.send(JSON.stringify(data));
    }

    var newSocket = new VirtualSocket();
    this.socketDict[filter].push(newSocket);
    this.socketData[filter] = data;
    this.socketList.push(newSocket);

    return newSocket;
}