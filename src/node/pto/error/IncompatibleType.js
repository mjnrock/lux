import EnumTagType from "./../enum/TagType";
import AException from "./AException";

export default class IncompatibleType extends AException {
	constructor(types) {
		super(`You have passed an incompatible type; supported types are: `);
		types = types.map(v => EnumTagType.GetString(v));
		this.Message += `[${ types.join(", ") }]`;
	}
};