import { ATag } from "./ATag";
import Enum from "./../enum/package";
import { IncorrectParameterCount } from "./../error/IncorrectParameterCount";

class TagCharacter extends ATag {
	constructor(key, value) {
		super(Enum.TagType.CHARACTER, key, null);

		this.SetValues(value);
	}

	SetValues(value) {
		this.prop("Value", new Uint8Array());

		this.AddValue(value);

		return this;
	}
	SetValue(index, value) {
		let values = this.GetValues();

		if (typeof value === "number") {
			values[index] = String.fromCharCode(+value);
		} else if (typeof value === "string" || value instanceof String) {
			value = [...value];
		}
		if (value instanceof Array) {
			if (typeof value[0] === "number") {
				value = [...value].map((e) => String.fromCharCode(+e));
			}

			Array.prototype.splice.apply(values, [index, 1].concat(value));
		}

		this.prop("Value", []);
		this.AddValue(values);
	}
	AddValue(value) {
		if (value !== null && value !== void 0) {
			if (typeof value === "number") {
				value = [value];
			} else if (typeof value === "string" || value instanceof String) {
				value = [...value];
			}

			if (value instanceof Array) {
				let arr = value;
				if (typeof value[0] === "number") {
					value = [...value].map((e) => String.fromCharCode(+e));
				}

				if (this.Value.length > 0) {
					arr = [...this.Value].map((e) => String.fromCharCode(+e));
					arr = arr.concat(value);
				} else {
					arr = value;
				}

				arr = [...arr].map((c) => (c ? c.charCodeAt(0) : null));
				this.prop("Value", Uint8Array.of(...arr));
			}
		}

		return this;
	}
	RemoveValue(index) {
		let arr = [...this.Value];
		arr.splice(index, 1);
		this.prop("Value", Uint8Array.of(...arr));

		return this;
	}

	GetValues() {
		return [...this.Value].map((e) => String.fromCharCode(+e));
	}
	GetValue(index) {
		if (index === null || index === void 0) {
			throw new IncorrectParameterCount(1, 0, index);
		}

		return this.GetValues()[index];
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

export { TagCharacter };