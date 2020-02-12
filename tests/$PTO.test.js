import PTO from "./../wip/$pto/package";

export function RunTest() {
    let tc1 = new PTO.Tag.TagCompound("Cats");

    let ti1 = new PTO.Tag.TagInt("Kiszkas", 115);
    let ts1 = new PTO.Tag.TagInt("Buddhas", "boo boo");

    tc1.AddTag(ti1);
    tc1.AddTag(ts1);

    // console.log(tc1);

    // tc1.GetTag("Kiszkas").watch("Value", e => console.log(e.getPayload()));
    // ti1.watch("Value", e => console.log(e.getPayload()));

    ti1.SetValues(9);
    ti1.SetValues([14, 5]);
    ti1.SetValue(4, 65);

    // console.log(tc1.Serialize(PTO.Enum.Serialization.OBJECT));

    console.log(PTO.Utility.Transformer.ToHierarchy(tc1));
}

export default {
    RunTest
};