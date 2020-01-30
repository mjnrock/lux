import PTO from "./../package";

export default class Text {
	static get COMPATIBILITY() {
		return [
			PTO.Enum.TagType.CHARACTER,
			PTO.Enum.TagType.STRING,	
			PTO.Enum.TagType.UUID
		];
	}
    static IsCompatible(...tags) {
        for(let i in tags) {
            if(!Text.COMPATIBILITY.includes(tags[i].Type)) {
                return false;
            }
        }

        return true;
	}
	
	/**
	 * Functionally equivalent to a TSQL CONCAT.  If a boolean is found, it will treat is as the "returnAsTag" flag.
	 * @param  {...any} input | Any combination of a String or a Tag
	 */
	static Concat(...inputs) {
		let string = "",
			returnAsTag = false;

		for(let i in inputs) {
			let input = inputs[i];

			if(typeof input === "string" || input instanceof String) {
				string += input;
			} else if(input instanceof PTO.Tag.ATag) {		
				if(!Text.IsCompatible(input)) {
					throw new PTO.Error.IncompatibleType(Text.COMPATIBILITY);
				} else {
					string += input.GetValues();
				}
			} else if(input === true || input === false) {
				returnAsTag = input;
			}
		}

		if(returnAsTag === true) {
			return new PTO.Tag.TagString("Concat", string);
		}

		return string;
	}
	
	static Match(pattern, tag, returnAsTag = false) {
		if(!Text.IsCompatible(tag)) {
			throw new PTO.Error.IncompatibleType(Text.COMPATIBILITY);
		}

		let res = tag.GetValues().match(pattern)!== null ? true : false;

		if(returnAsTag === true) {
			return new PTO.Tag.TagBoolean("Match", res);
		}

		return res;
	}

	static Equals(t1, t2, identityCompare = false, returnAsTag = false) {
		if(!Text.IsCompatible(t1) || !Text.IsCompatible(t2)) {
			throw new PTO.Error.IncompatibleType(Text.COMPATIBILITY);
		}

		let res = identityCompare ? t1.GetValues() === t2.GetValues() : t1.GetValues() == t2.GetValues();

		if(returnAsTag === true) {
			return new PTO.Tag.TagBoolean("Equals", res);
		}

		return res;
	}

	/**
	 * 
	 * @param {String} string | Construct with "{#}" syntax (e.g. "This is the {0}st test and the {1}nd")
	 * @param  {...any} tags 
	 */
	static Interpolate(string, ...tags) {
        let regex = /{\d+}/g,
            match = regex.exec(string),
			i = 0;

        while (match != null) {
            string = string.replace(match, Array.from(tags[i].GetValues()).join(""));
            match = regex.exec(string);            

            ++i;
		}

		//	returnAsTag
		if(tags.includes(true)) {
			return new PTO.Tag.TagString("Interpolate", string);
		}
		
		return string;
	}

	static Replace(tag, find, replace, overwrite = false) {
		if(!Text.IsCompatible(tag)) {
			throw new PTO.Error.IncompatibleType(Text.COMPATIBILITY);
		}

		let value = tag.GetValues().replace(find, replace);

		if(overwrite === true) {
			tag.SetValues(value);
		}
		
		return tag;
	}

	static Find(tag, find, returnAsTag = false) {
		if(!Text.IsCompatible(tag)) {
			throw new PTO.Error.IncompatibleType(Text.COMPATIBILITY);
		}

		let value = tag.GetValues().search(find);

		if(returnAsTag === true) {
			return new PTO.Tag.TagString("Find", value);
		}
		
		return value;
	}
};