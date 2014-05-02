/*
Widget Manager
By: Andrew Hassan

The Widget Manager keeps track of widgets and allows them to handle
events as well as communicate or trigger events in other widgets.

Each widget that would like to use a socket, receive/trigger events, etc.
must register with this Widget Manager.

Widgets can be removed by calling the widget remove method. This may be
useful for if a widget needs to be disabled, as it can be registered again
later.
 */

var naiveSingleton = false;

function WidgetManager() {
    if (naiveSingleton) {
        throw new TypeError('There should only be one instance of the WidgetManager running.');
    }
    else {
        naiveSingleton = true;
    }

    this.widgetList = {};
}

WidgetManager.prototype.registerWidget = function(widget) {
    if (widget.widgetId === null) {
        throw new Exception("Widget ID cannot be null");
    }

    this.widgetList[widget.widgetId] = widget;
}

// Note: As of writing, this may have unforeseen consequences with the socket callbacks
WidgetManager.prototype.unregisterWidget = function(widgetId) {
    var widget = this.widgetList[widgetId];

    if (isNullOrUndefined(widget)) {
        return false;
    }

    delete this.widgetList[widgetId];
    return true;
}

WidgetManager.prototype.getWidgets = function() {
    return this.widgetList;
}

// TODO: Implement callback functionality so that the receiving widget
// can return more information when done
WidgetManager.prototype.triggerEvent = function(widgetId, event) {
    var widget = this.widgetList[widgetId];

    if (isNullOrUndefined(widget)) {
        throw new ReferenceError('The specified Widget is not registered currently');
    }

    return widget.onEvent(event);
}