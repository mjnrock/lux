import PTO from "../package";
// import Mutator from "./package";

class MutatorFactory {
	constructor() {
		this.PTO = PTO;
	}

	// static InstantiateMutator(name, ...args) {
	// 	try {
	// 		return new Mutator[name](...args);
	// 	} catch (e) {
	// 		console.warn(e);
	// 	}
	// }

	/**
	 * This is designed to build a basic Mutator class with a Getter and a Setter for each tag in the Mutator.
	 * @param TagCompound | tag 
	 */
	static GenerateMutator(tag, downloadFile = false) {
		let schema = PTO.Utility.Transformer.ToSchema(tag);

		if(schema.length <= 1) {
			// throw new Error("You must have at least two (2) tags to generate a Mutator");
			console.warn("You must have at least two (2) tags to generate a Mutator");

			return false;
		}
		
		let GetDuplicateKeysArray = (arr) => arr.filter((v,i) => arr.indexOf(v) !== i),
			paths = schema.map(r => r.Path);

		if(GetDuplicateKeysArray(paths).length > 0) {
			console.warn("You must have a unique path to each Tag.");

			return false;
		}

		let keys = schema.map(r => r.Key),
			duplicates = GetDuplicateKeysArray(keys),
			lookup = {};
			
		// schema = schema.sort((a, b) => a.ParentID - b.ParentID);
		schema.forEach((r, i) => {
			lookup[r.ID] = {
				...r,
				TierKey: r.Key
			};
			schema[i].TierKey = r.Key;
		});

		while(duplicates.length > 0) {
			// eslint-disable-next-line
			schema.forEach((r, i) => {
				if(duplicates.includes(r.TierKey)) {
					r.TierKey = lookup[r.ID].TierKey = `${ lookup[r.ParentID].Key }_${ r.TierKey }`;
				}
			});
			duplicates = GetDuplicateKeysArray(schema.map(r => r.TierKey).filter(r => r !== null && r !== void 0));
		}

		let SanitizeName = (input, firstCharCheck = true) => {
			input = input.replace(/\W+/g, "");

			if(firstCharCheck) {
				return input[0].match(/\d/g) ? `_${ input }` : input;
			}
			return input;
		},
		MakeGetter = (row) => {
			let path = "this.Tag";

			if(row.ParentID === null || row.ParentID === 0 || row.ParentID === void 0) {
				//NOOP
			} else if(row.ParentID === 1) {
				path = `this.Tag.GetTag("${ row.Key }")`;
			} else {
				path = `this.Get${ SanitizeName(lookup[row.ParentID].TierKey, false) }().GetTag("${ row.Key }")`;
			}

			return [
				`\tGet${ SanitizeName(row.TierKey, false) }() {\n`,
				`\t\treturn ${ path };\n`,
				`\t}\n`
			];
		},
		MakeSetter = (row) => {
			return [
				`\tSet${ SanitizeName(row.TierKey, false) }(input) {\n`,
				`\t\tthis.Get${ SanitizeName(row.TierKey, false) }().SetValues(input);\n\n`,
				`\t\treturn this;\n`,
				`\t}\n`
			];
		},
		MakeAdderRemover = (row) => {
			let path = `this.Get${ SanitizeName(row.TierKey, false) }()`;

			if(row.ParentID === null || row.ParentID === 0 || row.ParentID === void 0) {
				path = "this.Tag";
			}

			return [
				`\tAddTag${ SanitizeName(row.TierKey, false) }(tag) {\n`,
				`\t\t${ path }.Add${ row.Tag instanceof PTO.Tag.TagCompound === false ? "Value" : "Tag"}(tag);\n\n`,
				`\t\treturn this;\n`,
				`\t}\n`,

				`\tRemoveTag${ SanitizeName(row.TierKey, false) }(tag) {\n`,
				`\t\t${ path }.RemoveTag(tag);\n\n`,
				`\t\treturn this;\n`,
				`\t}\n`,
				
				`\n`
			];
		},
		MakeGetterSetter = (row) => {
			return [
				...MakeGetter(row),
				...MakeSetter(row),
				`\n`
			];
		},
		MakeMapper = (row) => {
			let saniKey = SanitizeName(row.TierKey, false),
				lines = [];

			lines.push(
			`\t\t\t{`,
				`\t\t\t\tID: ${ row.ID },`,
				`\t\t\t\tParentID: ${ row.ParentID },`,
				`\t\t\t\tKey: "${ row.TierKey }",`,
				`\t\t\t\tSafeKey: "${ saniKey }",`,
				`\t\t\t\tPath: "${ row.Path }",`,
				`\t\t\t\tOrdinality: ${ row.Ordinality },`,
			`\t\t\t},`
			);
			return lines;
		};

		let root = schema[0],
			saniRootKey = SanitizeName(root.Tag.GetKey()),
			lines = [
				`class ${ saniRootKey } extends Mutator {\n`,
				`\tconstructor() {\n`,
				`\t\tsuper();\n\n`,

				`\t\tthis.Tag = new this.PTO.Tag.TagCompound("${ root.Tag.GetKey() }");\n`
			],
			metaMapper = [],
			metaFunc = [
				`\tSearchSchema(key, value) {`,
					`\t\tlet ret = this.Schema.filter(t => t[key] === value);\n`,

					`\t\tif(ret.length === 1) {`,
						`\t\t\treturn ret[0];`,
					`\t\t}\n`,

					`\t\treturn ret;`,
				`\t}\n\n`
			],
			funcs = [
				...MakeGetterSetter(root)
			];

		schema.forEach((row, i) => {
			if(i > 0) {
				let type = schema[i].Tag.GetType(),
					className = PTO.Enum.TagType.GetClass(+type).name,
					parent = lookup[row.ParentID],
					parentVar = row.ParentID === 1 ? "this.Tag" : SanitizeName(parent.TierKey);

				if(row.Tag instanceof PTO.Tag.TagCompound || row.Tag instanceof PTO.Tag.TagList) {
					lines.push(`\t\t${ parentVar }.AddTag(new this.PTO.Tag.${ className }("${ row.Key }"));\n`);
					lines.push(`\t\tlet ${ SanitizeName(row.TierKey) } = ${ parentVar }.GetTag("${ row.Key }");\n`);
				} else {
					lines.push(`\t\t${ parentVar }.AddTag(new this.PTO.Tag.${ className }("${ row.Key }"));\n`);
				}
				
				funcs.push(
					...MakeGetterSetter(row)
				);
				metaMapper = [
					...metaMapper,
					...MakeMapper(row)
				];
				if(row.Tag instanceof PTO.Tag.TagCompound || row.Tag instanceof PTO.Tag.TagList) {
					funcs.push(
						...MakeAdderRemover(row)
					);
				}
			}
		});

		lines.push(`\n\t\tthis.PTO.Utility.Transformer.ToHierarchy(this.Tag).forEach((t, i) => t.Tag.SetOrdinality(i + 1));\n`);	// Ensure Tag ordinality mimes creation order
		lines.push(`\n\t\tthis.Schema = [\n${ metaMapper.join("\n") }\n\t\t];`);	// End Constructor
		lines.push(`\n\t}\n\n`);	// End Constructor
		lines.push(metaFunc.join("\n"));
		lines.push(...funcs);
		lines.pop();	// Cleanup an aesthetically unpleasing extra line
		lines.push(`}`);	// End Class

		// Download the created file
		if(downloadFile === true) {
			lines = [
				`import { Mutator } from "./Mutator";\n\n`,
				...lines,
				`\n\nexport { ${ saniRootKey } };`
			];

			const download = (filename, text) => {
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				element.setAttribute('download', filename);
			
				element.style.display = 'none';
				document.body.appendChild(element);
			
				element.click();
			
				document.body.removeChild(element);
			};
			download(`${ saniRootKey }.mutator`, lines.join(""));
		}

		return lines.join("");
	}

	// /**
	//  * This is designed to build a basic Mutator class with a Getter and a Setter for each tag in the Mutator.
	//  * @param TagCompound | tag 
	//  */
	// //REFACTOR This was strongly piecemealed
	// static GenerateMutator(tag, downloadFile = false) {
	// 	let hierarchy = PTO.Utility.Transformer.ToHierarchy(tag);

	// 	if(hierarchy.length <= 1) {
	// 		// throw new Error("You must have at least two (2) tags to generate a Mutator");
	// 		console.warn("You must have at least two (2) tags to generate a Mutator");

	// 		return false;
	// 	}

	// 	let SanitizeName = (input, firstCharCheck = true) => {
	// 			input = input.replace(/\W+/g, "");

	// 			if(firstCharCheck) {
	// 				return input[0].match(/\d/g) ? `_${ input }` : input;
	// 			}
	// 			return input;
	// 		},
	// 		MakeGetter = (key, path) => {
	// 			path = path === null || path === void 0 ? `this.Tag.GetTag("${ key }")` : path;
	// 			return [
	// 				`\tGet${ SanitizeName(key, false) }() {\n`,
	// 				`\t\treturn ${ path };\n`,
	// 				`\t}\n`
	// 			];
	// 		},
	// 		MakeSetter = (key) => {
	// 			return [
	// 				`\tSet${ SanitizeName(key, false) }(input) {\n`,
	// 				`\t\tthis.Get${ SanitizeName(key, false) }().SetValues(input);\n\n`,
	// 				`\t\treturn this;\n`,
	// 				`\t}\n`
	// 			];
	// 		},
	// 		MakeAdderRemover = (key, path, isCompound = true) => {
	// 			path = path === null || path === void 0 ? `this.Tag.GetTag("${ key }")` : path;
	// 			return [
	// 				`\tAddTag${ SanitizeName(key, false) }(tag) {\n`,
	// 				// `\t\tlet tag = this.Get${ SanitizeName(key, false) }();\n`,
	// 				`\t\t${ path }.Add${ isCompound === false ? "Value" : "Tag"}(tag);\n\n`,
	// 				`\t\treturn this;\n`,
	// 				`\t}\n`,

	// 				`\tRemoveTag${ SanitizeName(key, false) }(tag) {\n`,
	// 				`\t\t${ path }.RemoveTag(tag);\n\n`,
	// 				`\t\treturn this;\n`,
	// 				`\t}\n`,
					
	// 				`\n`
	// 			];
	// 		},
	// 		MakeGetterSetter = (key, path) => {
	// 			return [
	// 				...MakeGetter(key, path),
	// 				...MakeSetter(key, path),
	// 				`\n`
	// 			];
	// 		},
	// 		IDKeyMapping = {};

	// 	hierarchy.sort((a, b) => +a.ParentID - +b.ParentID);
	// 	hierarchy.forEach(v => {
	// 		IDKeyMapping[+v.ID] = {
	// 			ParentID: +v.ParentID,
	// 			Key: v.Tag.GetKey(),
	// 			SaniKey: SanitizeName(v.Tag.GetKey()),
	// 			Tag: v.Tag
	// 		};
	// 	});

	// 	let root = hierarchy.shift().Tag,
	// 		saniRootKey = SanitizeName(root.GetKey());

	// 	let currentVariable = "this.Tag",
	// 		currentParentID = 1,
	// 		lines = [
	// 			// `import { Mutator } from "./Mutator";\n\n`,
	// 			// `import { Mutator } from "./Mutator";\n`,
	// 			// `// import { Mutator } from "./path/to/mutator/";\n\n`,

	// 			`class ${ saniRootKey } extends Mutator {\n`,
	// 			`\tconstructor() {\n`,
	// 			`\t\tsuper();\n\n`,

	// 			`\t\t${ currentVariable } = new this.PTO.Tag.TagCompound("${ root.GetKey() }");\n\n`
	// 		],
	// 		funcs = [
	// 			...MakeGetterSetter(root.GetKey())
	// 		];

	// 	// Because of the hierarchy.shift() above, anything in this loop will necessarily be a child
	// 	for(let i in hierarchy) {
	// 		let hier = hierarchy[i],
	// 			key = hier.Tag.GetKey(),
	// 			type = hierarchy[i].Tag.GetType(),
	// 			className = PTO.Enum.TagType.GetClass(+type).name;

	// 		if(+hier.ParentID !== +currentParentID) {
	// 			let parent = IDKeyMapping[hier.ParentID];

	// 			lines.push(`\n`);
	// 			lines.push(`\t\tlet ${ parent.SaniKey } = ${ currentVariable }.GetTag("${ parent.Key }");\n`);
	// 			currentVariable = parent.SaniKey;
	// 			currentParentID = +hier.ParentID;
	// 		}
	// 		lines.push(`\t\t${ currentVariable }.AddTag(new this.PTO.Tag.${ className }("${ key }"));\n`);

	// 		//TODO Same-tier, Key collisions will still produce unexpected results.  Don't accept Key name if it would result in a collision.
	// 		funcs.push(
	// 			...MakeGetterSetter(key, `this.Get${ SanitizeName(IDKeyMapping[hier.ParentID].Key, false) }().GetTag("${ IDKeyMapping[hier.ID].Key }")`)
	// 		);
	// 		if(hier.Tag instanceof PTO.Tag.TagCompound || hier.Tag instanceof PTO.Tag.TagList) {
	// 			funcs.push(
	// 				...MakeAdderRemover(key, `this.Get${ SanitizeName(IDKeyMapping[hier.ID].Key, false) }()`, hier.Tag instanceof PTO.Tag.TagCompound)
	// 			);
	// 		}
	// 	}
	// 	lines.push(`\t}\n\n`);	// End Constructor
	// 	lines.push(...funcs);
	// 	lines.pop();	// Cleanup an aesthetically unpleasing extra line
	// 	lines.push(`}`);
	// 	// lines.push(`}`);
	// 	// lines.push(`\n\nexport { ${ saniRootKey } };`);

	// 	// Download the created file
	// 	if(downloadFile === true) {
	// 		const download = (filename, text) => {
	// 			var element = document.createElement('a');
	// 			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	// 			element.setAttribute('download', filename);
			
	// 			element.style.display = 'none';
	// 			document.body.appendChild(element);
			
	// 			element.click();
			
	// 			document.body.removeChild(element);
	// 		};
	// 		download(`${ saniRootKey }.js`, lines.join(""));
	// 	}

	// 	return lines.join("");
	// }
}

export { MutatorFactory };