import { AException } from "./AException";
import EnumTagType from "./../enum/TagType";

class OutOfRange extends AException {
	constructor(tagType, rangeMin, rangeMax, passedValue) {
		if(passedValue !== null && passedValue !== void 0) {
			passedValue = Number.isSafeInteger(passedValue) ? passedValue : passedValue.toExponential();
		} else {
			passedValue = "";
		}

		super(`Value is out of range for Tag ${EnumTagType.GetString(tagType)} [${tagType}]. Range is [${rangeMin}, ${rangeMax}].`, passedValue);
	}
}

export { OutOfRange };