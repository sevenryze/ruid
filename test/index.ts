import { isUUID } from "validator";
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

    expect(isUUID(uuid)).toBeTruthy();
  });

  it(`Could get uuid v4 from static method`, () => {
    const uuid = Ruid.getUuidV4();

    expect(isUUID(uuid, 4)).toBeTruthy();
  });
});
