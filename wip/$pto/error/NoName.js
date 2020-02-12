import AException from "./AException";

export default class NoName extends AException {
	constructor(passedValue) {
		super(`The 'name' attribute is required on this function.`, passedValue);
	}
};