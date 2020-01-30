import { AException } from "./AException";

class UnsafeIntegerRange extends AException {
	constructor(passedValue) {
		if(passedValue !== null && passedValue !== void 0) {
			passedValue = Number.isSafeInteger(passedValue) ? passedValue : (+passedValue).toExponential();
		} else {
			passedValue = "";
		}

		super(`Value is outside of Number's safe range.  Do not exceed [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] per array slot.`, passedValue);
	}
}

export { UnsafeIntegerRange };