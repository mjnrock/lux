import ATag from "./ATag";
import Enum from "./../enum/package";
import Error from "./../error/package";

export default class TagFloat extends ATag {
	constructor(key, value) {
		super(Enum.TagType.FLOAT, key, null);

		this.SetValues(value);
	}

	SetValues(value) {
		if (value instanceof Array) {
			return super.SetValues(Int32Array, value);
		}

		if (this.Value === null || this.Value === void 0) {
			this.prop("Value", new Int32Array());
		}

		if (value !== null && value !== void 0) {
			return this.SetValue(0, value);
		}

		return this;
	}

	SetValue(index, value) {
		if (value !== null && value !== void 0) {
			if (value.toString().length > 17) {
				throw new Error.UnsafeIntegerRange(value);
			}

			value = value.toString().split(".");
			let l = +value[0],
				r = value[1] === null || value[1] === void 0 ? 0 : +value[1];

			[l, r].forEach(function(v) {
				if (
					!Number.isSafeInteger(v) ||
					v < Enum.DataTypeRange.INT_MIN ||
					v > Enum.DataTypeRange.INT_MAX
				) {
					throw new Error.UnsafeIntegerRange(v);
				}
			});

			let arr = [...this.Value];
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
			if (value.toString().length > 17) {
				throw new Error.UnsafeIntegerRange(value);
			}

			value = value.toString().split(".");
			let l = +value[0],
				r = value[1] === null || value[1] === void 0 ? 0 : +value[1];

			[l, r].forEach(function(v) {
				if (
					!Number.isSafeInteger(v) ||
					v < Enum.DataTypeRange.INT_MIN ||
					v > Enum.DataTypeRange.INT_MAX
				) {
					throw new Error.UnsafeIntegerRange(v);
				}
			});

			let arr = [...this.Value];
			arr.push(l);
			arr.push(r);
			this.prop("Value", Int32Array.of(...arr));
		} else {
			throw new Error.UndefinedValue(value);
		}

		return this;
	}
	GetValue(index) {
		if (this.Value !== null && this.Value !== void 0) {
			console.log([this.Value, index]);
			return +"".concat(
				this.Value[2 * index].toString(),
				".",
				this.Value[2 * index + 1].toString()
			);
		}

		return null;
	}
	RemoveValue(index) {
		if (this.Value !== null && this.Value !== void 0) {
			let arr = [...this.Value];
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

			let arr = [...this.Value];
			arr.push(value);
			this.prop("Value", Int32Array.of(...arr));
		} else {
			throw new Error.UndefinedValue(value);
		}

		return this;
	}

	GetBytePerValue() {
		return super.GetBytePerValue(4) * this.Value.length;
	}
};