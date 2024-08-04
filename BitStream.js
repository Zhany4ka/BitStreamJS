function BitStream() {
    this.data = new Uint8Array(1024);
    this.position = 0;
    this.capacity = 1024;

    this.ensureCapacity = function(additionalBytes) {
        if (this.position + additionalBytes > this.capacity) {
            const newCapacity = Math.max(this.capacity * 2, this.position + additionalBytes);
            const newData = new Uint8Array(newCapacity);
            newData.set(this.data);
            this.data = newData;
            this.capacity = newCapacity;
        }
    };

    this.writeVInt = function(value) {
        this.ensureCapacity(5);
        let remaining = Math.abs(value);
        let isNegative = value < 0;

        if (isNegative) {
            remaining = ~remaining;
        }

        let hasMore = true;
        while (hasMore) {
            let byteValue = remaining & 0x3F;
            remaining >>>= 6;
            hasMore = remaining !== 0;

            if (isNegative) {
                byteValue |= 0x40;
            }
            if (hasMore) {
                byteValue |= 0x80;
            }

            this.data[this.position++] = byteValue;
        }
    };

    this.writeInt = function(value) {
        this.ensureCapacity(4);
        this.data[this.position++] = (value >> 24) & 0xFF;
        this.data[this.position++] = (value >> 16) & 0xFF;
        this.data[this.position++] = (value >> 8) & 0xFF;
        this.data[this.position++] = value & 0xFF;
    };

    this.writeString = function(value) {
        const utf8 = unescape(encodeURIComponent(value));
        this.ensureCapacity(utf8.length + 1);
        for (let i = 0; i < utf8.length; i++) {
            this.data[this.position++] = utf8.charCodeAt(i);
        }
        this.data[this.position++] = 0;
    };

    this.writeBoolean = function(value) {
        this.ensureCapacity(1);
        this.data[this.position++] = value ? 1 : 0;
    };

    this.writeInt8 = function(value) {
        this.ensureCapacity(1);
        this.data[this.position++] = value & 0xFF;
    };

    this.writeShort = function(value) {
        this.ensureCapacity(2);
        this.data[this.position++] = (value >> 8) & 0xFF;
        this.data[this.position++] = value & 0xFF;
    };

    this.writeLong = function(value) {
        this.ensureCapacity(8);
        const high = Math.floor(value / 0x100000000);
        const low = value % 0x100000000;
        this.writeInt(high);
        this.writeInt(low);
    };

    this.writeCString = function(value) {
        this.writeString(value);
    };

    this.writeByte = function(value) {
        this.writeInt8(value);
    };

    this.writeUnsignedInt = function(value) {
        this.writeInt(value >>> 0);
    };

    this.writeHexa = function(value) {
        this.ensureCapacity(value.length / 2);
        for (let i = 0; i < value.length; i += 2) {
            const byteValue = parseInt(value.substr(i, 2), 16);
            this.data[this.position++] = byteValue;
        }
    };

    this.writeFloat = function(value) {
        this.ensureCapacity(4);
        const floatArray = new Float32Array([value]);
        const uintArray = new Uint8Array(floatArray.buffer);
        for (let i = 0; i < 4; i++) {
            this.data[this.position++] = uintArray[i];
        }
    };

    this.writeDouble = function(value) {
        this.ensureCapacity(8);
        const doubleArray = new Float64Array([value]);
        const uintArray = new Uint8Array(doubleArray.buffer);
        for (let i = 0; i < 8; i++) {
            this.data[this.position++] = uintArray[i];
        }
    };

    this.getData = function() {
        return this.data.slice(0, this.position);
    };
}
