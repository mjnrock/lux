import { TagString } from "./TagString";
import Enum from "../Enum/package";

class TagUUID extends TagString {
	constructor(key, value) {
		super(key, value);

		this.SetType(Enum.TagType.UUID);
		this.SetValues(value);
	}

	static Generate() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			// eslint-disable-next-line
		    let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
		    return v.toString(16);
		});
	}

	SetValues(value) {
		if(value === null || value === void 0 || this.GetValues().length === 0) {
			value = TagUUID.Generate();
		}
		if(typeof value === "object") {
			value = Object.values(value).reduce((a, v) => `${a}${String.fromCharCode(v)}`, "");
		}
		super.SetValues(value);

		return this;
	}
}

export { TagUUID };