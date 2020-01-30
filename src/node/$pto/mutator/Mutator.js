import PTO from "./../package.js"

export default class Mutator {
	constructor() {
		this.PTO = PTO;
		this.Tag = null;
		this.Schema = null;
	}

	SearchSchema(key, value) {
		let ret = this.Schema.filter(t => t[key] === value);

		if(ret.length === 1) {
			return ret[0];
		}

		return ret;
	}

	Compare(tag, a, bv, af) {
		if(tag instanceof PTO.Tag.ATag) {
			return this.Tag.GetSchema() === tag.GetSchema();
		} else if(typeof tag === "string" || tag instanceof String) {
			while(typeof tag === "string" || tag instanceof String) {
				tag = JSON.parse(tag);
			}
			let keys = Object.keys(tag);
			if(keys.length > 0) {
				if(keys.includes("Type") && keys.includes("Key") && keys.includes("Value")) {
					return this.Tag.GetSchema() === PTO.Utility.Transformer.FromJSON(tag).GetSchema();
				}
			}
			
			return this.Tag.GetSchema() === PTO.Utility.Transformer.InferTagStructure("HTML", tag, false).GetSchema();
		}
	
		return false;
	}

	GetTag() {
		return this.Tag;
	}
	SetTag(tag) {
		this.Tag = tag;

		return this;
	}
};