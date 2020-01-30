import { ATag } from "./ATag";
import Enum from "../Enum/package";

class TagInt extends ATag {
	constructor(key, value) {
		super(Enum.TagType.INT, key, null);

		this.SetValues(value);
	}

	SetValues(value) {
		return super.SetValues(Int32Array, value);
	};
	SetValue(index, value) {
		return super.SetValue(Int32Array, Enum.DataTypeRange.INT_MIN, Enum.DataTypeRange.INT_MAX, index, value);
	};
	AddValue(value) {
		return super.AddValue(Int32Array, Enum.DataTypeRange.INT_MIN, Enum.DataTypeRange.INT_MAX, value);
	};
	RemoveValue(index) {
		return super.RemoveValue(Int32Array, index);
	};
	GetValue(index) {
		return super.GetValue(index);
	};

	GetBytePerValue() {
		return super.GetBytePerValue(4) * this.Value.length;
	};
}

export { TagInt };