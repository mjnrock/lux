import { Transformer } from "./Transformer";

class Navigator {
	//	This is really designed for treating a tag like an object with Dot Notation
	static FindTag(tag, key) {
		let schema = Transformer.ToSchema(tag),
			ret = schema.filter(r => r.Path === key)[0];

		if(ret !== null && ret !== void 0) {
			return ret.Tag;
		}

		return false;
	}
	
	//	TODO Add a "Selector" function that allows for CSS-style Tag selection
}

export { Navigator };