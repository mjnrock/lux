import PTO from "./../node/pto/package";

export function RunTest() {
    let tc1 = new PTO.Tag.TagCompound("Cats");

    let ti1 = new PTO.Tag.TagInt("Kiszkas", 115);
    let ts1 = new PTO.Tag.TagInt("Buddhas", "boo boo");

    tc1.AddTag(ti1);
    tc1.AddTag(ts1);

    console.log(tc1);
}

RunTest();

export default {
    RunTest
};