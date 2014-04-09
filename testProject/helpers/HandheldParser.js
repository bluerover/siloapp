// Require modules
var fs = require('fs');
var xml2js = require('xml2js');
var atob = require('atob');

/**
 * Utility function that takes a hex string and returns it
 * in little endian format.
 * @param  {string} hex
 * @return {string}
 */
function toLittleEndian(hex) {
    if (hex.length % 4 !== 0 || hex.length < 4) {
        return hex;
    }

    var half_length = hex.length / 2;

    result = toLittleEndian(hex.substring(half_length)) + toLittleEndian(hex.substring(0, half_length));

    return result;
}

/**
 * Takes a parsed packet and other data from the XML file and
 * combines it all together into one object.
 * @param  {Object} packet
 * @param  {Array[Object]} users
 * @param  {Array[Object]} items
 * @param  {string} device_id
 * @param  {string} probe_id
 * @return {Object}
 */
function combineData(packet, users, items, device_id, probe_id) {
    var user = (users.filter(function (u) {
        return u.num[0] === packet.user_id.toString();
    }))[0] || null;

    var item = (items.filter(function (i) {
        return i.num[0] === packet.item_id.toString();
    }))[0] || null;

    packet.user_name = user.name[0];
    packet.item_name = item.name[0];
    packet.device_id = device_id;
    packet.probe_id = probe_id;

    return packet;
}

/**
 * Take hex data and extract important information from it.
 * @param  {string} hex_data
 * @return {Object}
 */
function parsePacket(hex_data) {
    return {
        id: parseInt(toLittleEndian(hex_data.substring(0, 4)), 16),
        item_id: parseInt(toLittleEndian(hex_data.substring(12, 14)), 16),
        user_id: parseInt(toLittleEndian(hex_data.substring(14, 16)), 16),
        timestamp: parseInt(toLittleEndian(hex_data.substring(4, 12)), 16),
        temperature: (parseInt(toLittleEndian(hex_data.substring(16, 20)), 16) - 1000) / 10.0,
        alarm: parseInt(hex_data.substring(30, 33))
    }
}

/**
 * Reads an XML file for the handheld system
 * @param  {string} filename: Full path to file
 * @param  {Function} callback: Function to call after parsing data
 */
function readHandheldData(filename, callback, delete_file) {
    delete_file = delete_file || false;
    try {
        // Read file contents
        var file_contents = fs.readFileSync(filename).toString();
        var parsed_object = xml2js.parseString(file_contents, function (error, result) {
            // Extract data from file
            var device_id = result.file.base[0].name[0];
            var probe_id = result.file.record[0].name[0];
            var items = result.file.record[0].item_list[0].item;
            var users = result.file.record[0].user_list[0].user;

            // Convert base 64 string to hex
            var data = result.file.record[0].data[0].replace("\n", "").replace("\r", "");
            var decoded_data = atob(data);
            var hex_data = "";
            for (var i = 0; i < decoded_data.length; i++) {
                hex_data += ("00" + decoded_data.charCodeAt(i).toString(16)).substr(-2);
            }

            var packets = [];

            // For each packet (16 bytes), extract data from it
            for (var i = 0; i < hex_data.length; i += 32) {
                packets.push(combineData(parsePacket(hex_data.substring(i, i + 32)), users, items, device_id, probe_id));
            }

            if (delete_file) {
                fs.unlink(filename, function(e) { if (e) throw e; });
            }

            callback(packets);
        });
    }
    catch (e) {
        console.log("There was a problem parsing handheld data: " + e);
    }
}

function readPrzFilesInDirectory(directory, delete_files, callback) {
    delete_files = delete_files || false;

    try {
        var files = fs.readdirSync(directory).filter(function(file) {
            return file.indexOf('.prz', file.length - 4) !== -1;
        });

        var packetData = [];

        for (var file in files) {
            readHandheldData(directory + "/" + files[file], callback, delete_files);
        }
    }
    catch (e) {
        console.log("There was a problem reading the directory " + e);
    }
}

module.exports = readPrzFilesInDirectory;