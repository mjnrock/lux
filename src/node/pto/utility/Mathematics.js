import PTO from "./../package";

class Mathematics {
	static get COMPATIBILITY() {
		return [
			PTO.Enum.TagType.TINY,
			PTO.Enum.TagType.SHORT,
			PTO.Enum.TagType.INT,
			PTO.Enum.TagType.LONG,
			PTO.Enum.TagType.FLOAT,
			PTO.Enum.TagType.DOUBLE
		];
	}
    static IsCompatible(...tags) {
        for(let i in tags) {
            if(!Mathematics.COMPATIBILITY.includes(tags[i].Type)) {
                return false;
            }
        }

        return true;
	}
	
    static ToSingleValue(tag, returnAsTagAndOverwrite = false) {
        if(!Mathematics.IsCompatible(tag)) {
            throw new PTO.Error.IncompatibleType(Mathematics.COMPATIBILITY);
        }

        let sum = 0;

        for(let v in tag.Value) {
            sum += tag.Value[v];
        }

        if(returnAsTagAndOverwrite === true) {
            tag.SetValues(sum);
            return tag;
        }
        
        return sum;
    }
    /**
     * Collapse the Value array into a single entry for each tag in tags
     * @param  {...any} tags | Pass TRUE or FALSE as an element as the $returnAsTag value
     */
    static ToSingleValueSpread(...tags) {      
        if(!Mathematics.IsCompatible(...tags)) {
            throw new PTO.Error.IncompatibleType(Mathematics.COMPATIBILITY);
        }

        let sum = [],
            returnAsTag = true;

        for(let t in tags) {
            sum[t] = 0;

            let tag = tags[t];
            if(tag instanceof PTO.Tag.ATag) {
                for(let v in tag.Value) {
                    sum[t] += tag.Value[v];
                }
            } else if(tag === true || tag === false) {
                returnAsTag = !!tag;
            }
        }

        return {
            Sum: sum,
            ReturnAsTag: returnAsTag
        };
    }
    static ToPercent(tag, returnAsTag = true) {
        if(!Mathematics.IsCompatible(tag)) {
            throw new PTO.Error.IncompatibleType(Mathematics.COMPATIBILITY);
        }

        if(returnAsTag === true) {
            return new PTO.Tag.TagInt("Percent", Mathematics.ToSingleValue(tag, false) * 100);
        }

        return tag.SetValues(Mathematics.ToSingleValue(tag, false) * 100);
    }
    
    static Power(t1, t2, returnAsTag = true) {
        if(!Mathematics.IsCompatible(t1) || !Mathematics.IsCompatible(t2)) {
            throw new PTO.Error.IncompatibleType(Mathematics.COMPATIBILITY);
        }

        let result = Math.pow(Mathematics.ToSingleValue(t1, false), Mathematics.ToSingleValue(t2, false));
        
        if(returnAsTag === true) {
            return new PTO.Tag.TagInt("Power", result);
        }

        return result;
    }

    static Add(...tags) {
        let multi = Mathematics.ToSingleValueSpread(...tags),
            sum = multi.Sum.reduce((p, v) => p + v),
            returnAsTag = multi.ReturnAsTag;
            
        if(returnAsTag === true) {
            return new PTO.Tag.TagInt("Add", sum);
        }

        return sum;
    }    
    static Subtract(...tags) {
        let multi = Mathematics.ToSingleValueSpread(...tags),
            sum = multi.Sum.reduce((p, v) => p - v),
            returnAsTag = multi.ReturnAsTag;
            
        if(returnAsTag === true) {
            return new PTO.Tag.TagInt("Difference", sum);
        }

        return sum;
    }    
    static Multiply(...tags) {
        let multi = Mathematics.ToSingleValueSpread(...tags),
            sum = multi.Sum.reduce((p, v) => p * v),
            returnAsTag = multi.ReturnAsTag;
            
        if(returnAsTag === true) {
            return new PTO.Tag.TagInt("Product", sum);
        }

        return sum;
    }    
    static Divide(...tags) {
        let multi = Mathematics.ToSingleValueSpread(...tags),
            sum = multi.Sum.reduce((p, v) => p / v),
            returnAsTag = multi.ReturnAsTag;
            
        if(returnAsTag === true) {
            return new PTO.Tag.TagInt("Quotient", sum);
        }

        return sum;
    }

    static Count(...tags) {
        let sum = 0;

        tags.forEach(v => sum += v.Value.length);

        return sum;
    }

    static Calculate(string, ...tags) {
        let regex = /\{[0-9]\}{1,}/g,
            match = regex.exec(string),
            i = 0;

        while (match != null) {
            string = string.replace(match, Mathematics.ToSingleValue(tags[i], false));
            match = regex.exec(string);            

            ++i;
        }
        
        return eval(string);
    }
}

export { Mathematics };