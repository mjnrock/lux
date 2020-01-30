import { Mutator } from "./Mutator";
import { ModelComponent } from "./ModelComponent";

class ModelContainer extends Mutator {
	constructor() {
		super();

		this.Tag = new this.PTO.Tag.TagCompound("ModelContainer");

		this.Tag.AddTag(new this.PTO.Tag.TagUUID("UUID"));
		this.Tag.AddTag(new this.PTO.Tag.TagString("Name"));
		
		this.Tag.AddTag(new this.PTO.Tag.TagList("Elements", this.PTO.Enum.TagType.COMPOUND));
	}

	//@ This creates the Tag that the user input dictates, NOT the Tag that this Mutator uses as a variable
	GenerateRecordTag() {
		let name = this.GetName().GetValues(),
			comp = new this.PTO.Tag.TagCompound(name),
			list = this.GetElements().GetValues();

		for(let i  in list) {
			let obj = list[i],
				keys = Object.keys(obj.GetValues());
			if(keys.includes("Elements")) {
				let mutator = new ModelContainer();
				mutator.SetTag(obj);

				comp.AddTag(mutator.GenerateRecordTag());
			} else {
				let mutator = new ModelComponent();
				mutator.SetTag(obj);

				comp.AddTag(mutator.GenerateRecordTag());
			}
		}

		return comp;
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

	GetElements() {
		return this.Tag.GetTag("Elements");
	}
	AddContainerElement(tag) {
		if(tag) {
			this.Tag.GetTag("Elements").AddValue(tag);
		}

		return this;
	}
	RemoveContainerElement(tag) {
		if(tag) {
			this.Tag.GetTag("Elements").RemoveTag(tag);
		}

		return this;
	}
}

export { ModelContainer };