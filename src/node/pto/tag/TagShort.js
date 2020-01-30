import ATag from "./ATag";
import Enum from "./../enum/package";

export default class TagShort extends ATag {
	constructor(key, value) {
		super(Enum.TagType.SHORT, key, null);

		this.SetValues(value);
	}

	SetValues(value) {
		return super.SetValues(Int16Array, value);
	}
	SetValue(index, value) {
		return super.SetValue(
			Int16Array,
			Enum.DataTypeRange.SHORT_MIN,
			Enum.DataTypeRange.SHORT_MAX,
			index,
			value
		);
	}
	AddValue(value) {
		return super.AddValue(
			Int16Array,
			Enum.DataTypeRange.SHORT_MIN,
			Enum.DataTypeRange.SHORT_MAX,
			value
		);
	}
	RemoveValue(index) {
		return super.RemoveValue(Int16Array, index);
	}
	GetValue(index) {
		return super.GetValue(index);
	}

	GetBytePerValue() {
		return super.GetBytePerValue(2) * this.Value.length;
	}
};