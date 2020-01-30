export default class ByteBuffer {
	constructor() {
		let size = 0;
		if (arguments.length > 1) {
			size = [].slice.call(arguments).reduce((acc, v) => acc + v);
		} else if (arguments.length === 1) {
			size = arguments[0];
		}

		this.Buffer = new ArrayBuffer(size);
		this.DV = new DataView(this.Buffer);
		this.Position = 0;

		this.IsLittleEndian = false;
	}

	GetEndianness() {
		return this.IsLittleEndian;
	}
	ToggleBigEndian() {
		this.IsLittleEndian = false;

		return this;
	}
	ToggleLittleEndian() {
		this.IsLittleEndian = true;

		return this;
	}

	GetPosition() {
		return this.Position;
	}
	SetPosition(position) {
		this.Position = position;

		return this;
	}
	AddPosition(value) {
		this.Position += value || 1;

		return this;
	}
	ResetPosition() {
		this.Position = 0;

		return this;
	}

	GetBuffer() {
		return this.Buffer;
	}
	SetBuffer(buffer) {
		this.Buffer = buffer;
		this.ResetPosition();
		this.DV = new DataView(this.Buffer);

		return this;
	}
	NewBuffer(size) {
		this.Buffer = new ArrayBuffer(size);
		this.ResetPosition();
		this.DV = new DataView(this.Buffer);
	}

	Write(dt, value) {
		let bytes = ByteBuffer.ResolveBytes(dt);
		if (value instanceof Array) {
			for (let i in value) {
				this.DV["set" + dt](
					this.Position,
					value[i],
					this.IsLittleEndian
				);
				this.AddPosition(bytes);
			}
		} else {
			this.DV["set" + dt](this.Position, value, this.IsLittleEndian);
			this.AddPosition(bytes);
		}

		return this;
	}
	Read(dt, al) {
		let bytes = ByteBuffer.ResolveBytes(dt);
		if (al > 0) {
			let array = [];
			for (let i = 0; i < al; i++) {
				array.push(
					this.DV["get" + dt](this.Position, this.IsLittleEndian)
				);
				this.AddPosition(bytes);
			}

			return array;
		} else {
			let value = this.DV["get" + dt](this.Position, this.IsLittleEndian);
			this.AddPosition(bytes);

			return value;
		}
	}

	WriteString(value) {
		for (let i in value) {
			//  Simple ASCII encoding, translating to UTF8 (UInt8 Array)
			this.DV.setUint8(this.Position, value.charCodeAt(i));
			this.AddPosition(1);
		}

		return this;
	}
	ReadString(characters) {
		let array = [];
		for (let i = 0; i < characters; i++) {
			//  Simple ASCII decoding, translating to UTF8 (UInt8 Array)
			array.push(String.fromCharCode(this.DV.getUint8(this.Position)));
			this.AddPosition(1);
		}

		return array.join("");
	}

	WriteUUID(uuid) {
		return this.WriteString(uuid);
	}
	ReadUUID() {
		return this.ReadString(36);
	}

	WriteBoolean(value) {
		if (value instanceof Array) {
			for (let i in value) {
				value[i] = !!value[i] ? 1 : 0;
			}
		}

		return this.Write("Uint8", value);
	}
	ReadBoolean(arrayLength) {
		return this.Read("Uint8", arrayLength);
	}

	WriteTiny(value, isSigned) {
		isSigned = isSigned === null || isSigned === void 0 ? true : isSigned;
		return this.Write(isSigned ? "Int8" : "Uint8", value);
	}
	ReadTiny(arrayLength, isSigned) {
		isSigned = isSigned === null || isSigned === void 0 ? true : isSigned;
		return this.Read(isSigned ? "Int8" : "Uint8", arrayLength);
	}
	WriteShort(value, isSigned) {
		isSigned = isSigned === null || isSigned === void 0 ? true : isSigned;
		return this.Write(isSigned ? "Int16" : "Uint16", value);
	}
	ReadShort(arrayLength, isSigned) {
		isSigned = isSigned === null || isSigned === void 0 ? true : isSigned;
		return this.Read(isSigned ? "Int16" : "Uint16", arrayLength);
	}
	WriteInt(value, isSigned) {
		isSigned = isSigned === null || isSigned === void 0 ? true : isSigned;
		return this.Write(isSigned ? "Int32" : "Uint32", value);
	}
	ReadInt(arrayLength, isSigned) {
		isSigned = isSigned === null || isSigned === void 0 ? true : isSigned;
		return this.Read(isSigned ? "Int32" : "Uint32", arrayLength);
	}

	//  @TODO:  Int64 is not a function.  Either encode into Int32 or use Float64
	WriteLong(value, isSigned) {
		isSigned = isSigned === null || isSigned === void 0 ? true : isSigned;
		return this.Write(isSigned ? "Int64" : "Uint64", value);
	}
	ReadLong(arrayLength, isSigned) {
		isSigned = isSigned === null || isSigned === void 0 ? true : isSigned;
		return this.Read(isSigned ? "Int64" : "Uint64", arrayLength);
	}

	WriteFloat(value) {
		return this.Write("Float32", value);
	}
	ReadFloat(arrayLength) {
		return this.Read("Float32", arrayLength);
	}
	WriteDouble(value) {
		return this.Write("Float64", value);
	}
	ReadDouble(arrayLength) {
		return this.Read("Float64", arrayLength);
	}

	static ResolveBits(dt) {
		return dt.toString().replace(/\D/g, "") * 8;
	}
	static ResolveBytes(dt) {
		return dt.toString().replace(/\D/g, "") / 8;
	}
	static STRING(text) {
		return text.length;
	}
	static UUID(quantity, includeHyphens = true) {
		return (includeHyphens ? 36 : 32) * (quantity || 1);
	}
	static TINY(quantity) {
		return 1 * (quantity || 1);
	}
	static SMALL(quantity) {
		return 2 * (quantity || 1);
	}
	static INT(quantity) {
		return 4 * (quantity || 1);
	}
	static LONG(quantity) {
		return 8 * (quantity || 1);
	}

	static FLOAT(quantity) {
		return 4 * (quantity || 1);
	}
	static DOUBLE(quantity) {
		return 8 * (quantity || 1);
	}

	static UTF8Encode(string) {
		let arr = [];
		string.split("").forEach((c) => arr.push(c.charCodeAt(0)));

		return arr;
	}
	static UTF8Decode(array) {
		let str = "";
		array.forEach((n) => (str += String.fromCharCode(+n)));

		return str;
	}
};