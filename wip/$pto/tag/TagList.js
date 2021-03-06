import ATag from "./ATag";
import Enum from "./../enum/package";
import InvalidDataType from "./../error/InvalidDataType";

export default class TagList extends ATag {
	constructor(key, type) {
		super(Enum.TagType.LIST, key, null);

		this.ContentType = type;
		this.prop("Value", []);
	}

	GetSchema(id = 1, pid = 0, depth = "") {
		let schema = `${id}.${pid}.${this.Type}.${this.ContentType}`;
		let nid = id;
		for (let i in this.prop("Value")) {
			let r = `${this.prop("Value")[i].GetSchema(nid + 1, id, ":")}`;
			schema += r;
			r = r.split(":").filter((e) => e.length > 0);
			nid = Math.max.apply(Math, r.map((t) => +t.split(".")[0]));
		}

		return `${depth}${schema}`;
	}

	GetContentType() {
		return this.ContentType;
	}
	SetContentType(type) {
		this.ContentType = type;

		return this;
	}

	Has(key) {
		return this.prop("Value").map((v) => v.Key).includes(key);
	}
	Find(key) {
		return this.prop("Value").map((v) => v.Key).indexOf(key);
	}

	GetValue(input) {
		if (typeof input === "string" || input instanceof String) {
			return this.prop("Value").filter((v) => v.Key === input)[0];
		}

		return this.prop("Value")[input];
	}
	
	AddTag(tag) {
		return this.AddValue(tag);
	}
	AddValue(tag) {
		if (tag instanceof ATag) {
			if (tag.GetType() === this.GetContentType()) {
				if (!(this.prop("Value") instanceof Array)) {
					this.prop("Value", []);
				}
				if (!this.Has(tag.Key)) {
					this.prop("Value").push(tag);
				} else {
					this.prop("Value")[this.Find(tag.Key)] = tag;
				}
			} else {
				throw new InvalidDataType(
					this.GetContentType(),
					tag
				);
			}
		}

		return this;
	}
	RemoveValue(index) {
		this.prop("Value").splice(index, 1);

		return this;
	}
	RemoveTag(tag) {
		let index = this.Find(tag.Key);
		if(index >= 0) {
			this.RemoveValue(index);
		}

		return this;
	}
	HasTag(input) {
		if (input instanceof ATag) {
			input = input.GetKey();
		}
			
		return this.Find(input) >= 0;
	}

	GetByteLength() {
		let bytes = super.GetByteLength(this);

		return bytes + 1; //  +1 for this.ContentType
	}

	Size() {
		return this.prop("Value").length;
	}

	Serialize(level) {
		let arr = [];
		for (let i in this.prop("Value")) {
			arr.push(
				this.prop("Value")[i].Serialize(Enum.Serialization.OBJECT)
			);
		}

		return super.Serialize(
			this,
			level,
			this.GetType(),
			this.GetKey(),
			this.GetOrdinality(),
			arr,
			{ ContentType: this.GetContentType() }
		);
	}
	Deserialize(json) {
		while (typeof json === "string" || json instanceof String) {
			json = JSON.parse(json);
		}

		this.SetType(+json.Type);
		this.SetKey(json.Key);
		this.SetOrdinality(json.Ordinality);
		this.SetContentType(+json.ContentType);

		for (let i in json.Value) {
			let tag = new (Enum.TagType.GetClass(
				+json.Value[i].Type
			))().Deserialize(json.Value[i]);
			this.AddValue(tag);
		}

		return this;
	}
};