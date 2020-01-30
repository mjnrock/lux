import Tag from "./../tag/package";

let EnumTagType = {
	INT: 1,
	STRING: 2,
	SHORT: 3,
	TINY: 4,
	LONG: 5,
	BOOL: 6,
	FLOAT: 7,
	DOUBLE: 8,
	LIST: 9,
	COMPOUND: 10,
	CHARACTER: 11,
	UUID: 12
};

EnumTagType = {
	...EnumTagType,

	ForEach: (filter = [], fn = null) => {
		filter = [
			...filter,
			EnumTagType.DOUBLE
		];

		let valid = Object.values(EnumTagType).filter((v) => typeof v !== "function" && !filter.includes(v));

		if(typeof fn === "function") {
			return valid.map(v => fn(v));
		}
		
		return valid;
	},

	GetString: value => {
		let keys = Object.keys(EnumTagType);

		for(let i in keys) {
			if(EnumTagType[keys[i]] === value) {
				return keys[i];
			}
		}
	},

	GetClass: value => {
		switch(value) {
			case EnumTagType.ANY:
				return Tag.ATag;
			case EnumTagType.INT:
				return Tag.TagInt;
			case EnumTagType.STRING:
				return Tag.TagString;
			case EnumTagType.SHORT:
				return Tag.TagShort;
			case EnumTagType.TINY:
				return Tag.TagTiny;
			case EnumTagType.LONG:
				return Tag.TagLong;
			case EnumTagType.BOOL:
				return Tag.TagBoolean;
			case EnumTagType.FLOAT:
				return Tag.TagFloat;
			case EnumTagType.DOUBLE:
				return Tag.TagDouble;
			case EnumTagType.LIST:
				return Tag.TagList;
			case EnumTagType.COMPOUND:
				return Tag.TagCompound;
			case EnumTagType.CHARACTER:
				return Tag.TagCharacter;
			case EnumTagType.UUID:
				return Tag.TagUUID;
			default:
				return null;
		}
	},

	GetAvroType: value => {
		switch(value) {
			case EnumTagType.INT:
				return "int";
			case EnumTagType.STRING:
				return "string";
			case EnumTagType.SHORT:
				return "int";
			case EnumTagType.TINY:
				return "int";
			case EnumTagType.LONG:
				return "long";
			case EnumTagType.BOOL:
				return "boolean";
			case EnumTagType.FLOAT:
				return "float";
			case EnumTagType.DOUBLE:
				return "double";
			case EnumTagType.LIST:
				return "array";
			case EnumTagType.COMPOUND:
				return "record";
			case EnumTagType.CHARACTER:
				return "string";
			case EnumTagType.UUID:
				return "string";
			default:
				return null;
		}
	},

	GetEnum: value => {
		value = value.toUpperCase();
		switch(value) {
			case "ANY" || "ATAG":
				return EnumTagType.ANY;
			case "INT" || "TAGINT":
				return EnumTagType.INT;
			case "STRING" || "TAGSTRING":
				return EnumTagType.STRING;
			case "SHORT" || "TAGSHORT":
				return EnumTagType.SHORT;
			case "TINY" || "TAGTINY":
				return EnumTagType.TINY;
			case "LONG" || "TAGLONG":
				return EnumTagType.LONG;
			case "BOOLEAN" || "TAGBOOLEAN":
				return EnumTagType.BOOL;
			case "FLOAT" || "TAGFLOAT":
				return EnumTagType.FLOAT;
			case "DOUBLE" || "TAGDOUBLE":
				return EnumTagType.DOUBLE;
			case "LIST" || "TAGLIST":
				return EnumTagType.LIST;
			case "COMPOUND" || "TAGCOMPOUND":
				return EnumTagType.COMPOUND;
			case "CHARACTER" || "TAGCHARACTER":
				return EnumTagType.CHARACTER;
			case "UUID" || "TAGUUID":
				return EnumTagType.UUID;
			default:
				return null;
		}
	},

	GetColor: (value, options = {}) => {
		let HexToRGB = (hex) => {
			let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}, HexToRGBA = (hex, a = 1.0) => ({
			...HexToRGB(hex),
			a: a
		});
		// , RGBComponentToHex = (c) => {
		// 	let hex = c.toString(16);

		// 	return hex.length === 1 ? "0" + hex : hex;
		// }, RGBToHex = (r, g, b) => `#${ RGBComponentToHex(r) }${ RGBComponentToHex(g) }${ RGBComponentToHex(b) }`;

		let hex = "#000";
		switch(value) {
			case EnumTagType.INT:
				hex = "#1976d2";
				break;
			case EnumTagType.STRING:
				hex = "#c62828";
				break;
			case EnumTagType.SHORT:
				hex = "#42a5f5";
				break;
			case EnumTagType.TINY:
				hex = "#69e0d6";
				break;
			case EnumTagType.LONG:
				hex = "#0d47a1";
				break;
			case EnumTagType.BOOL:
				hex = "#5e35b1";
				break;
			case EnumTagType.FLOAT:
				hex = "#66bb6a";
				break;
			case EnumTagType.DOUBLE:
				hex = "#2e7d32";
				break;
			case EnumTagType.LIST:
				hex = "#a1887f";
				break;
			case EnumTagType.COMPOUND:
				hex = "#616161";
				break;
			case EnumTagType.CHARACTER:
				hex = "#f06292";
				break;
			case EnumTagType.UUID:
				hex = "#ff9e16";
				break;
			default:
				hex = "#000";
				break;
		}

		if(options.ToRGB) {
			if(options.CSS) {
				let rgb = HexToRGB(hex);

				return `rgb(${ rgb.r }, ${ rgb.g }, ${ rgb.b })`;
			}

			return HexToRGB(hex);
		} else if(options.ToRGBA) {
			if(options.CSS) {
				let rgba = HexToRGBA(hex, options.a);

				return `rgba(${ rgba.r }, ${ rgba.g }, ${ rgba.b }, ${ rgba.a })`;
			}

			return HexToRGBA(hex, options.a);
		}

		return hex;
	}
};

export default Object.freeze(EnumTagType);