import ATag from "./ATag";
import Enum from "./../enum/package";
import Error from "./../error/package";

export default class TagLong extends ATag {
	constructor(key, value) {
		super(Enum.TagType.LONG, key, null);

		this.SetValues(value);
	}

	SetValues(value) {
		if (value instanceof Array) {
			return super.SetValues(Int32Array, value);
		}

		if (typeof value === "object" || this.prop("Value") === null || this.prop("Value") === void 0) {
			this.prop("Value", new Int32Array());

			return this;
		}

		if (value !== null && value !== void 0) {
			return this.SetValue(0, value);
		}

		return this;
	}

	SetValue(index, value) {
		if (value !== null && value !== void 0) {
			if (value.toString().length > 16) {
				throw new Error.UnsafeIntegerRange(value);
			}

			value = value.toString().padStart(16, 0);
			let l = +value.substr(0, 8),
				r = +value.substr(8, 8);

			[l, r].forEach(function(v) {
				if (
					!Number.isSafeInteger(v) ||
					v < Enum.DataTypeRange.INT_MIN ||
					v > Enum.DataTypeRange.INT_MAX
				) {
					throw new Error.UnsafeIntegerRange(v);
				}
			});

			let arr = [...this.prop("Value")];
			arr[2 * index] = l;
			arr[2 * index + 1] = r;
			this.prop("Value", Int32Array.of(...arr));
		} else {
			throw new Error.UndefinedValue(value);
		}

		return this;
	}
	AddValue(value) {
		if (value !== null && value !== void 0) {
			if (value.toString().length > 16) {
				throw new Error.UnsafeIntegerRange(value);
			}

			value = value.toString().padStart(16, 0);
			let l = +value.substr(0, 8),
				r = +value.substr(8, 8);

			[l, r].forEach(function(v) {
				if (
					!Number.isSafeInteger(v) ||
					v < Enum.DataTypeRange.INT_MIN ||
					v > Enum.DataTypeRange.INT_MAX
				) {
					throw new Error.UnsafeIntegerRange(v);
				}
			});

			let arr = [...this.prop("Value")];
			arr.push(l);
			arr.push(r);
			this.prop("Value", Int32Array.of(...arr));
		} else {
			throw new Error.UndefinedValue(value);
		}

		return this;
	}
	GetValue(index) {
		if (this.prop("Value") !== null && this.prop("Value") !== void 0) {
			return +"".concat(
				this.prop("Value")[2 * index].toString(),
				this.prop("Value")[2 * index + 1].toString()
			);
		}

		return null;
	}
	RemoveValue(index) {
		if (this.prop("Value") !== null && this.prop("Value") !== void 0) {
			let arr = [...this.prop("Value")];
			arr.splice(2 * index, 2);
			this.prop("Value", Int32Array.of(...arr));
		}

		return this;
	}

	AddBufferValue(value) {
		if (value !== null && value !== void 0) {
			value = +value;
			if (
				!Number.isSafeInteger(value) ||
				value < Enum.DataTypeRange.INT_MIN ||
				value > Enum.DataTypeRange.INT_MAX
			) {
				throw new Error.UnsafeIntegerRange(value);
			}

			let arr = [...this.prop("Value")];
			arr.push(value);
			this.prop("Value", Int32Array.of(...arr));
		} else {
			throw new Error.UndefinedValue(value);
		}

		return this;
	}

	GetBytePerValue() {
		return super.GetBytePerValue(4) * this.prop("Value").length;
	}
};