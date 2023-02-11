function BitStream() {
    this.data = [];
    this.position = 0;

    this.writeVInt = function (value) {
        while (value >= 0x80) {
            this.data.push((value & 0x7F) | 0x80);
            value >>>= 7;
        }
        this.data.push(value);
    };

    this.writeInt = function (value) {
        this.data.push((value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
    };

    this.writeString = function (value) {
        for (var i = 0; i < value.length; i++) {
            this.data.push(value.charCodeAt(i));
        }
        this.data.push(0);
    };

    this.writeBoolean = function (value) {
        this.data.push(value ? 1 : 0);
    };

    this.writeInt8 = function (value) {
        this.data.push(value & 0xff);
    };

    this.writeShort = function (value) {
        this.data.push((value >> 8) & 0xff, value & 0xff);
    };

    this.writeLong = function (value) {
        this.data.push((value >> 56) & 0xff, (value >> 48) & 0xff, (value >> 40) & 0xff, (value >> 32) & 0xff,
                       (value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
    };

    this.writeCString = function (value) {
        for (var i = 0; i < value.length; i++) {
            this.data.push(value.charCodeAt(i));
        }
        this.data.push(0);
    };

    this.writeByte = function (value) {
        this.data.push(value);
    };

    this.writeUnsignedInt = function (value) {
        this.data.push((value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
    };

    this.writeHexa = function (value) {
        for (var i = 0; i < value.length; i += 2) {
            var byteValue = parseInt(value.substr(i, 2), 16);
            this.data.push(byteValue);
        }
    };

    this.getData = function () {
        return this.data;
    };
}
