import Enum from "../Enum/package";
import Error from "../Error/package";
import Tag from "./package";

class ATag {
	constructor(type, key, value) {		
		this.Type = type;
		this.Key = key;
		this.Value = value;
		this.Ordinality = Date.now();
	}

	GetSchema(id = 1, pid = 0, depth = "") {
		return `${depth}${id}.${pid}.${this.Type}`;
	}

	GetType() {
		return this.Type;
	}
	SetType(type) {
		this.Type = type;

		return this;
	}

	GetOrdinality() {
		return +this.Ordinality;
	}
	SetOrdinality(order) {
		this.Ordinality = +order;

		return this;
	}

	GetKey() {
		return this.Key;
	}
	SetKey(key) {
		this.Key = key;

		return this;
	}

	GetValues() {
		return this.Value;
	}
	SetValues(array, value) {
		if(typeof value === "number") {
			this.Value = array.of(value);
		} else if(typeof value === "string" || value instanceof String) {
			this.Value = array.of(value);
		} else if(value && value.length > 0) {
			this.Value = array.of(...value);
		} else {
			this.Value = [];
		}

		return this;
	};

	IsEmpty() {
		return this.Value !== null && this.Value !== void 0;
	};
	SetValue(array, min, max, index, value) {
		if(value >= min && value <= max) {
			let arr = [...this.Value];
			arr[index] = +value;
			this.Value = array.of(...arr);
		} else if(value < min || value > max) {
			throw new Error.OutOfRange(this.Type, min, max, value);
		}

		return this;
	};
	AddValue(array, min, max, value) {
		if(value >= min && value <= max) {
			let arr = [...this.Value];
			arr.push(+value);
			this.Value = array.of(...arr);
		} else if(value < min || value > max) {
			throw new Error.OutOfRange(this.Type, min, max, value);
		}

		return this;
	};
	RemoveValue(array, index) {
		let arr = [...this.Value];
		arr.splice(index, 1);
		this.Value = array.of(...arr);

		return this;
	};
	GetValue(index) {
		if(this.Value !== null && this.Value !== void 0) {
			return this.Value[index];
		}

		return null;
	};

	GetBuffer() {
		if(!this.IsEmpty()) {
			if(this.Value["buffer"] !== null && this.Value["buffer"] !== void 0) {
				return this.Value.buffer;
			}
		}

		return null;
	};

	GetBytePerValue(size = 1) {
		return 1 * size;
	};
	GetByteLength() {
		let bytes = 0;
		++bytes;    //  Tag Type
		++bytes;    //  Key Length
		bytes += this.Key.length;    //  Key 
		++bytes;    //  Ordinality Length
		bytes += this.Ordinality.toString().length;    //  Ordinality
		++bytes;    //  Value Length

		if(this instanceof Tag.TagCompound || this instanceof Tag.TagList) {
			++bytes; //  Amount of child Tags
		} else {
			bytes += this.Value.BYTES_PER_ELEMENT * this.Value.length;  //  Size of Value payload in bytes
		}

		return bytes;
	};

	Serialize(level, type, key, value, order, append) {
		level = (level === null || level === void 0) ? Enum.Serialization.STRING : level;
		let obj = {
			Type: (type === null || type === void 0) ? this.GetType() : type,
			Key: (key === null || key === void 0) ? this.GetKey() : key,
			Value: (value === null || value === void 0) ? [...this.GetValues()] : value,
			Ordinality: (order === null || order === void 0) ? this.GetOrdinality() : order,
		};

		if(append !== null && append !== void 0) {
			for(let i in append) {
				obj[i] = append[i];
			}
		}

		switch(level) {
			case Enum.Serialization.OBJECT:
				return obj;
			case Enum.Serialization.STRING:
				return JSON.stringify(obj);
			case Enum.Serialization.JSON:
				return JSON.stringify(JSON.stringify(obj));
			default:
				return JSON.stringify(obj);
		}
	};
	Deserialize(json) {
		while(typeof json === "string" || json instanceof String) {
			json = JSON.parse(json);
		}

		this.SetType(+json.Type);
		this.SetKey(json.Key);
		this.SetValues(json.Value);
		this.SetOrdinality(json.Ordinality);

		return this;
	};
}

export { ATag };