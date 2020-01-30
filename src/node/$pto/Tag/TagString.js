import { ATag } from "./ATag";
import Enum from "./../enum/package";
import { IncorrectParameterCount } from "./../error/IncorrectParameterCount";

class TagString extends ATag {
	constructor(key, value) {
		super(Enum.TagType.STRING, key, null);

		this.SetValues(value);
	}

	SetValues(value) {
		this.prop("Value", new Uint8Array());
		
		if (value !== null && value !== void 0) {
			if (value instanceof Array) {
				value = value.filter((v) => v !== "" && v !== 0);
				this.prop("Value", Uint8Array.of(...value));
			} else if (typeof value === "string" || value instanceof String) {
				let string = [];
				[...value].forEach((c) => string.push(c.charCodeAt(0)));
				this.prop("Value", Uint8Array.of(...string));
			}
		}

		return this;
	}
	SetValue(index, value) {
		let s = String.fromCharCode(255),
			values = this.GetValues().split(s);

		if (typeof value === "number") {
			values[index] = String.fromCharCode(value);
		} else if (typeof value === "string" || value instanceof String) {
			values[index] = value;
		} else if (value instanceof Array) {
			if (typeof value[0] === "number") {
				value = [...value]
					.map((e) => String.fromCharCode(+e))
					.join("")
					.split(s);
			}

			Array.prototype.splice.apply(values, [index, 1].concat(value));
		}

		this.prop("Value", []);
		this.AddValue(values);
	}
	AddValue(value) {
		if (value !== null && value !== void 0) {
			if (typeof value === "number") {
				value = [String.fromCharCode(value)];
			} else if (typeof value === "string" || value instanceof String) {
				value = [value];
			}

			if (value instanceof Array) {
				let s = String.fromCharCode(255),
					arr = value;

				if (typeof value[0] === "number") {
					value = [...value]
						.map((e) => String.fromCharCode(+e))
						.join("")
						.split(s);
				}

				if (this.Value.length > 0) {
					arr = [...this.Value]
						.map((e) => String.fromCharCode(+e))
						.join("")
						.split(s);
					arr = arr.concat(value);
				}

				arr = [...arr.join(s)].map((c) => c.charCodeAt(0));
				this.prop("Value", Uint8Array.of(...arr));
			}
		}

		return this;
	}
	RemoveValue(index) {
		let s = String.fromCharCode(255),
			values = this.GetValues().split(s);

		values.splice(index, 1);

		this.prop("Value", []);
		this.AddValue(values);
	}

	GetValues() {
		return [...this.Value].map((e) => String.fromCharCode(+e)).join("");
	}
	GetValue(index) {
		if (index === null || index === void 0) {
			throw new IncorrectParameterCount(1, 0, index);
		}

		let s = String.fromCharCode(255);

		return this.GetValues().split(s)[index];
	}

	Serialize(level) {
		return super.Serialize(
			level,
			this.GetType(),
			this.GetKey(),
			this.GetValues(),
			this.GetOrdinality()
		);
	}
}

export { TagString };