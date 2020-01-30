import { Mutator } from "./Mutator";

class ModelComponent extends Mutator {
	constructor() {
		super();

		this.Tag = new this.PTO.Tag.TagCompound("ModelComponent");

		this.Tag.AddTag(new this.PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new this.PTO.Tag.TagString("Name"));
		this.Tag.AddTag(new this.PTO.Tag.TagInt("Type", this.PTO.Enum.TagType.STRING));
		this.Tag.AddTag(new this.PTO.Tag.TagCompound("RegEx"));

		let RegEx = this.Tag.GetTag("RegEx");
		RegEx.AddTag(new this.PTO.Tag.TagString("Match"));
		RegEx.AddTag(new this.PTO.Tag.TagString("Replace"));
	}

	//@ This creates the Tag that the user input dictates, NOT the Tag that this Mutator uses as a variable
	GenerateRecordTag() {
		let clazz = this.PTO.Enum.TagType.GetClass(+this.GetType().GetValue(0)),
			name = this.GetName().GetValues(),
			tag = new clazz(name);
		
		return tag;
	}

	GetUUID() {
		return this.Tag.GetTag("UUID");
	}
	SetUUID(uuid) {
		this.Tag.GetTag("UUID").SetValues(uuid);

		return this;
	}

	GetName() {
		return this.Tag.GetTag("Name");
	}
	SetName(name) {
		this.Tag.GetTag("Name").SetValues(name);

		return this;
	}

	GetType() {
		return this.Tag.GetTag("Type");
	}
	SetType(type) {
		this.Tag.GetTag("Type").SetValues(type);

		return this;
	}


	GetRegEx() {
		return this.Tag.GetTag("RegEx");
	}
	ViewRegEx() {
		return {
			RegEx: this.Tag.GetTag("RegEx"),
			Match: this.Tag.GetTag("RegEx").GetTag("Match"),
			Pattern: this.Tag.GetTag("RegEx").GetTag("Pattern")
		};
	}

	GetRegExMatch() {
		return this.Tag.GetTag("RegEx").GetTag("Match");
	}
	SetRegExMatch(value) {
		this.Tag.GetTag("RegEx").GetTag("Match").SetValues(value);

		return this;
	}

	GetRegExPattern() {
		return this.Tag.GetTag("RegEx").GetTag("Pattern");
	}
	SetRegExPattern(value) {
		this.Tag.GetTag("RegEx").GetTag("Pattern").SetValues(value);

		return this;
	}
}

export { ModelComponent };