/*
 Widget
 By: Andrew Hassan

 Widgets must implement the event handler method. This method
 will be used as a callback for any events triggered for the widget.

 In addition to this, widgets may also have websocket handler methods. More
 specifically, they can have onOpen, onMessage, and onClose methods.
 */

function Widget(id, socket) {
    this.widgetId = null;
    if (!isNullOrUndefined(id)) {
        this.widgetId = id;
    }

    // Try to find widget reference, if not then throw error
    // throw new ReferenceError('Widget ID not found');
}

Widget.prototype.onOpen = function() {

}

Widget.prototype.onClose = function() {

}

Widget.prototype.onMessage = function(m) {

}

Widget.prototype.onEvent = function(e) {
    throw new Error('Widget ' + this.widgetId + ' event handler not defined');
}