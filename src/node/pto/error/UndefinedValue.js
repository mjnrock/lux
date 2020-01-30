import { AException } from "./AException";

class UndefinedValue extends AException {
	constructor(passedValue) {
		super(`Value is not defined.`, passedValue);
	}
}

export { UndefinedValue };