import PTO from "./../package";

export default class Query {
	static Analyze(path, tier, schema) {
		if(tier === "*") {
			return true;
		} else if(tier === "$" && (schema.Path.split(/\./g)[0] === path)) {
			return true;
		} else if(tier.match(/\/(.*)\/([a-z]{0,})/) !== null) {	// Test if string is RegEx
			//	Actually filter off of the RegEx
			let matches = tier.match(/\/(.*)\/([a-z]{0,})/),
				regex = RegExp(matches[1], typeof matches[2] === "string" || matches[2] instanceof String ? matches[2] : "gi");

			return regex.test(path);
		} else if(tier.match(/<(Boolean|Character|Compound|Double|Float|Int|List|Long|Short|String|Tiny|UUID)+(\|(Boolean|Character|Compound|Double|Float|Int|List|Long|Short|String|Tiny|UUID))*>/gi)) {
			let regex = /<(Boolean|Character|Compound|Double|Float|Int|List|Long|Short|String|Tiny|UUID)+(\|(Boolean|Character|Compound|Double|Float|Int|List|Long|Short|String|Tiny|UUID))*>/gi,
				match = regex.exec(tier),
				r = RegExp(`^${ PTO.Enum.TagType.GetString(schema.Tag.Type) }$`, "gi");

			for(let i = 0; i < match.length - 2; i++) {
				if((match[i].match(/^[a-zA-Z]+$/gi) !== null) && (r.test(match[i]))) {
					return true;
				}
			}

			return false;
		} else if (tier.match(/([TVO])\(([*~=!])?(.*)\)/gi)) {
			let match = /([TVO])\(([*~=!])?(.*)\)/gi.exec(tier),
				values = match[1],
				flag = match[2],
				check = match[3];

			if(values === "V") {
				values = schema.Tag.GetValues();
			} else if(values === "O") {
				values = schema.Tag.GetOrdinality();
			} else if(values === "T") {
				values = schema.Tag.GetType();
			}

			if(flag === "*") {
				return values.toString().includes(check);
			} else if(flag === "!" || flag === "~") {
				return values != check;
			} else if(flag === "=") {
				return values === check;
			}
			
			return values == check;
		} else {
			path = path.toLowerCase();
			tier = tier.toLowerCase();
			
			if(tier.indexOf("[") > -1) {
				let i = tier.indexOf("["),
					startWith = path.startsWith(tier.substring(0, i)),
					contains = path.includes(tier.substring(i + 1));

				return startWith && contains;
			}

			return path.startsWith(tier);
		}
	}

	/**
	 * Depth queries must include "$." as a placeholder for the root tag.  Be aware that by .Foster()ing this result, you may incur circular or broken Tag connections if the query exludes them.
	 * @param {ATag} tag | The tag to query
	 * @param {String} query | The TAL (Tag Atomizer Language) query
	 * 
	 * @returns {Array} | All of the tags that meet the query criteria
	 */
	static Atomize(tag, query) {
		let schema = PTO.Utility.Transformer.ToSchema(tag),
			depth = +(query.match(/\./g) || []).length,			//	Counts the "."
			tiers = query.split(/\./g),							//	i.e. Array.from(@query.split("."))
			ret = [];
		schema.sort((a, b) => (a.Route.match(/\./g) || []).length - (b.Route.match(/\./g) || []).length);

		schemaLoop:
		for(let i in schema) {
			let s = schema[i],
				sDepth = (s.Route.match(/\./g) || []).length;

			if(tiers[0] === "$") {
				if(depth === sDepth) {
					let retain = true,
					paths = s.Path.split(/\./g);

					tierLoop:
					for(let j in tiers) {
						retain = Query.Analyze(paths[j], tiers[j], s);
						if(retain === false) {
							break tierLoop;
						}
					}

					if(retain === true) {
						ret.push(s.Tag);
					}
				}
			} else {
				if(Query.Analyze(s.Key, query, s) === true) {
					ret.push(s.Tag);
				}
			}
		};

		return ret;
	}
};