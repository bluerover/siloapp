function CircularBuffer (size) {
    this.arr = new Array(size);
    this.pointer = 0;
}

CircularBuffer.prototype.push = function (data) {
    this.arr[this.pointer] = data;
    this.pointer = (this.pointer + 1) % (this.arr.length);
}

CircularBuffer.prototype.get = function () {
    var result = [];

    for (var i = 0; i < this.arr.length; i++) {
        var tempPointer = (this.pointer + i) % (this.arr.length);
        if (this.arr[tempPointer] !== undefined) {
            result.push(this.arr[tempPointer]);
        }
    }

    return result;
}

module.exports = CircularBuffer;