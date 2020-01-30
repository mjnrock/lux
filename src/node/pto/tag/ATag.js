import Node from "./../../Node";

import Enum from "./../enum/package";
import Error from "./../error/package";
import Tag from "./package";

class ATag extends Node {
	constructor(type, key, value) {
        super();

		this.meta("Type", type);
        this.meta("Key", key);
        
		this.prop("Value", value);
		this.prop("Ordinality", Date.now());
	}

	GetSchema(id = 1, pid = 0, depth = "") {
		return `${depth}${id}.${pid}.${this.meta("Type")}`;
	}

	GetType() {
		return this.meta("Type");
	}
	SetType(type) {
		this.meta("Type", type);

		return this;
	}

	GetOrdinality() {
		return +this.prop("Ordinality");
	}
	SetOrdinality(order) {
		this.prop("Ordinality", +order);

		return this;
	}

	GetKey() {
		return this.meta("Key");
	}
	SetKey(key) {
		this.meta("Key", key);

		return this;
	}

	GetValues() {
		return this.prop("Value");
	}
	SetValues(array, value) {
		if(typeof value === "number") {
			this.prop("Value", array.of(value));
		} else if(typeof value === "string" || value instanceof String) {
			this.prop("Value", array.of(value));
		} else if(value && value.length > 0) {
			this.prop("Value", array.of(...value));
		} else {
			this.prop("Value", []);
		}

		return this;
	};

	IsEmpty() {
		return this.prop("Value") !== null && this.prop("Value") !== void 0;
	};
	SetValue(array, min, max, index, value) {
		if(value >= min && value <= max) {
			let arr = [...this.prop("Value")];
			arr[index] = +value;
			this.prop("Value", array.of(...arr));
		} else if(value < min || value > max) {
			throw new Error.OutOfRange(this.meta("Type"), min, max, value);
		}

		return this;
	};
	AddValue(array, min, max, value) {
		if(value >= min && value <= max) {
			let arr = [...this.prop("Value")];
			arr.push(+value);
			this.prop("Value", array.of(...arr));
		} else if(value < min || value > max) {
			throw new Error.OutOfRange(this.meta("Type"), min, max, value);
		}

		return this;
	};
	RemoveValue(array, index) {
		let arr = [...this.prop("Value")];
		arr.splice(index, 1);
		this.prop("Value", array.of(...arr));

		return this;
	};
	GetValue(index) {
		if(!this.propIsEmpty("Value")) {
			return this.aprop("Value", +index);
		}

		return null;
	};

	GetBuffer() {
		if(!this.IsEmpty()) {
			if(this.prop("Value")["buffer"] !== null && this.prop("Value")["buffer"] !== void 0) {
				return this.prop("Value").buffer;
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
		bytes += this.meta("Key").length;    //  Key 
		++bytes;    //  Ordinality Length
		bytes += this.prop("Ordinality").toString().length;    //  Ordinality
		++bytes;    //  Value Length

		if(this instanceof Tag.TagCompound || this instanceof Tag.TagList) {
			++bytes; //  Amount of child Tags
		} else {
			bytes += this.prop("Value").BYTES_PER_ELEMENT * this.prop("Value").length;  //  Size of Value payload in bytes
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