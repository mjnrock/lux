import PTO from "./../package";

class General {
	/**
	 * Return the copy of the Tag(s), in an array if $tags > 1.  This will Serialize $tag and seed-Deserialize to create the copies.
	 * @param {ATag} tag | The Tag to copy
	 * @param {int} copies | The number of copies
	 * @param {bool} includeOriginal | Should $tag be .unshift()ed into the return array (i.e. shift-inserted into index = 0)
	 */
	static Copy(tag, copies = 1, includeOriginal = false) {
		let serialize = tag.Serialize(),
			clazz = PTO.Enum.TagType.GetClass(tag.Type),
			ret = [];
			
		for(let i = 0; i < copies; i++) {
			let t = new clazz(tag.Key);
			t.Deserialize(serialize);

			ret.push(t);
		}

		if(includeOriginal === true) {
			ret.unshift(tag);
		}

		if(ret.length === 1) {
			return ret[0];
		}

		return ret;
	}

    static OverwriteValue(t1, t2) {
        t1.Value = t2.Value;

        return t1;
	}

	static Foster(key, ...tags) {
		let parent = new PTO.Tag.TagCompound(key);

		for(let i in tags) {
			parent.AddTag(tags[i]);
		}

		return parent;
	}

	/**
	 * 
	 * @param {*} key | The key of the newly-created parent
	 * @param  {...any} tags 
	 */
	//TODO Rewrite this to perform the Union on the Schemas
	static Union(key, ...tags) {
		let parent = new PTO.Tag.TagCompound(key);

		for(let i in tags) {
			let tag = tags[i];

			if(tag instanceof PTO.Tag.TagCompound || tag instanceof PTO.Tag.TagList) {
				let children = tag.GetValues();
				for(let j in children) {
					if(!parent.HasTag(children[j])) {
						parent.AddTag(children[j]);
					}
				}
			} else {
				if(!parent.HasTag(tag)) {
					parent.AddTag(tag);
				}
			}
		}

		return parent;
	}
	//TODO Write this to perform the Intersection on the Schemas
	static Intersection(key, ...tags) {}

	/**
	 * Transforms $tag into a Hierarchy, and invokes foreach(t in hier) { callback(t, [$tag, hier], ...$args); }
	 * @param {ATag} tag 
	 * @param {fn()} callback 
	 * @param  {...any} args 
	 * 
	 * @returns tag
	 */
	static ForEach(tag, callback, ...args) {
		let hier = PTO.Utility.Transformer.ToHierarchy(tag);

		hier.forEach(t => {
			callback(t, [tag, hier], ...args);
		});

		return tag;
	}
}

export { General };