import { ATag } from "./ATag";
import Enum from "./../enum/package";

class TagTiny extends ATag {
	constructor(key, value) {
		super(Enum.TagType.TINY, key, null);

		this.SetValues(value);
	}

	SetValues(value) {
		return super.SetValues(Int8Array, value);
	}
	SetValue(index, value) {
		return super.SetValue(
			Int8Array,
			Enum.DataTypeRange.TINY_MIN,
			Enum.DataTypeRange.TINY_MAX,
			index,
			value
		);
	}
	AddValue(value) {
		return super.AddValue(
			Int8Array,
			Enum.DataTypeRange.TINY_MIN,
			Enum.DataTypeRange.TINY_MAX,
			value
		);
	}
	RemoveValue(index) {
		return super.RemoveValue(Int8Array, index);
	}
	GetValue(index) {
		return super.GetValue(index);
	}
}

export { TagTiny };