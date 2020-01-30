import ATag from "./ATag";
import Enum from "./../enum/package";

export default class TagCompound extends ATag {
	constructor(key) {
		super(Enum.TagType.COMPOUND, key, null);

		this.prop("Value", {});
	}

	GetSchema(id = 1, pid = 0, depth = "") {
		let schema = `${id}.${pid}.${this.Type}`;
		let nid = id;
		for (let i in this.prop("Value")) {
			let r = `${this.prop("Value")[i].GetSchema(nid + 1, id, ":")}`;
			schema += r;
			r = r.split(":").filter((e) => e.length > 0);
			nid = Math.max.apply(Math, r.map((t) => +t.split(".")[0]));
		}

		return `${depth}${schema}`;
	}

	ToArray() {
		return Object.values(this.prop("Value"));
	}

	GetTag(input) {
		if (typeof input === "string" || input instanceof String) {
			return this.prop("Value")[input];
		}

		return this.prop("Value")[Object.keys(this.prop("Value"))[input]];
	}
	AddTag(tag) {
		if (tag instanceof ATag) {
			this.prop("Value")[tag.GetKey()] = tag;
		}

		return this;
	}
	RemoveTag(input) {
		if (typeof input === "string" || input instanceof String) {
			delete this.prop("Value")[input];
		} else if (input instanceof ATag) {
			input = input.GetKey();
			delete this.prop("Value")[input];
		}

		delete this.prop("Value")[Object.keys(this.prop("Value"))[input]];

		return this;
	}
	HasTag(input) {
		if (input instanceof ATag) {
			input = input.GetKey();
		}
			
		return this.prop("Value")[input] !== null && this.prop("Value")[input] !== void 0;
	}

	Size() {
		return Object.keys(this.prop("Value")).length;
	}

	Serialize(level) {
		let obj = {};
		for (let i in this.prop("Value")) {
			obj[i] = this.prop("Value")[i].Serialize(Enum.Serialization.OBJECT);
		}

		return super.Serialize(level, this.GetType(), this.GetKey(), obj, this.GetOrdinality());
	}
	Deserialize(json) {
		while (typeof json === "string" || json instanceof String) {
			json = JSON.parse(json);
		}

		this.SetType(+json.Type);
		this.SetKey(json.Key);
		this.SetOrdinality(json.Ordinality);

		for (let i in json.Value) {
			let tag = new (Enum.TagType.GetClass(
				+json.Value[i].Type
			))().Deserialize(json.Value[i]);
			this.AddTag(tag);
		}

		return this;
	}
};