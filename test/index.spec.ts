import validator from "validator";
import { Ruid } from "../lib";

describe(`Ruid`, () => {
  it(`Should get new ruid when using empty constructor params`, () => {
    const ruid = new Ruid();

    console.log(`Ruid: ${ruid.toSqlString()}.`);

    expect(ruid.toSqlString()).toMatch(/X'/);
  });

  it(`Should get specific ruid when using ref RUID string`, () => {
    const refRuid = new Ruid().toString();
    const ruid = new Ruid(refRuid);

    console.log(`Ruid: ${ruid.toString()}.`);

    expect(ruid.toString()).toEqual(refRuid);
  });

  it(`Should get specific ruid when using ref RUID buffer`, () => {
    const refRuid = new Ruid();
    const ruid = new Ruid(refRuid.toBuffered());

    console.log(`Ruid: ${ruid.toString()}.`);

    expect(ruid.toString()).toEqual(refRuid.toString());
  });

  it(`Should get specific ruid when using ref UUID string`, () => {
    const uuid = Ruid.getUuidV1();
    const ruid = new Ruid().fromUuid(uuid);

    console.log(`Ruid: ${ruid.toString()}.`);

    expect(ruid.toString()).toBeDefined();
  });

  it(`Could get uuid v1 from static method`, () => {
    const uuid = Ruid.getUuidV1();

    expect(validator.isUUID(uuid)).toBeTruthy();
  });

  it(`Could get uuid v4 from static method`, () => {
    const uuid = Ruid.getUuidV4();

    expect(validator.isUUID(uuid, 4)).toBeTruthy();
  });

  it(`Could use static transform method`, () => {
    const ruid = new Ruid();

    const ruidBuffer = Ruid.transformToBuffer(ruid.toString());
    const ruidString = Ruid.transformToString(ruid.toBuffered());

    expect(ruidString).toEqual(ruid.toString());
    expect(ruidBuffer).toEqual(ruid.toBuffered());
  });

  it(`Could check ruid string validation.`, () => {
    const ruid = new Ruid();

    expect(Ruid.checkRuidString(ruid.toString())).toBe(true);
    expect(Ruid.checkRuidString(ruid.toSqlString())).toBe(false);
  });

  it(`Could get friendly RUID string`, () => {
    const ruid = new Ruid(`11d8eebc58e0a7d796690800200c9a66`);

    expect(ruid.toFriendlyString()).toEqual(`11d8-eebc-58e0a7d7-9669-0800200c9a66`.toUpperCase());
  });

  it("Could get sort relation", async () => {
    const ruid1 = new Ruid();

    await sleep(1000);

    const ruid2 = new Ruid();
    const ruid3 = new Ruid(ruid2.toString());

    expect(ruid1.isBefore(ruid2)).toEqual(true);
    expect(ruid1.isAfter(ruid2)).toEqual(false);

    expect(ruid2.isAfter(ruid1)).toEqual(true);
    expect(ruid2.isBefore(ruid1)).toEqual(false);

    expect(ruid2.isEqual(ruid3)).toEqual(true);
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
