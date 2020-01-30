import AException from "./AException";

export default class UndefinedValue extends AException {
	constructor(passedValue) {
		super(`Value is not defined.`, passedValue);
	}
};