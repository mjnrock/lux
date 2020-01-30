export default class AException {
	constructor(message, passedValue) {
		this.Message = `ERROR: ${message}`;
		this.Input = {
			Type: typeof passedValue,
			Value: passedValue
		};
	}
};