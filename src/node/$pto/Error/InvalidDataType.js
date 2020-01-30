import { AException } from "./AException";
import EnumTagType from "../enum/TagType";

class InvalidDataType extends AException {
	constructor(tagType, passedValue) {
		super(`Value is not of type ${EnumTagType.GetString(tagType)} [${tagType}].`, passedValue);
	}
}

export { InvalidDataType };