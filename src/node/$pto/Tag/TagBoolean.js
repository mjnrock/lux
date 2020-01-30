import { ATag } from "./ATag";
import Enum from "../enum/package";

class TagBoolean extends ATag {
	constructor(key, value) {
		super(Enum.TagType.BOOL, key, null);

		this.SetValues(value);
	}

	SetValues(value) {
		this.Value = new Uint8Array();
		this.SetValue(0, value);

		return this;
	}
	SetValue(index, value) {
		if (value === "false") {
			value = false;
		}

		return super.SetValue(Uint8Array, 0, 255, index, !!value ? 1 : 0);
	}
	AddValue(value) {
		return super.AddValue(Uint8Array, 0, 255, !!value ? 1 : 0);
	}
	RemoveValue(index) {
		return super.RemoveValue(Uint8Array, index);
	}
	GetValue(index) {
		return super.GetValue(index) === 1;
	}
}

export { TagBoolean };