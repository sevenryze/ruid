import { StringDecoder } from "string_decoder";
// tslint:disable-next-line:no-submodule-imports
import uuidv1 from "uuid/v1";
import { isUUID } from "validator";

/**
 * 优化版的全局唯一标识符
 *
 * ```
 * 优化前：
 *
 * 58e0a7d7 - eebc    -  11d8     -  9669     -  0800200c9a66
 *
 * time_low   time_mid   time_high   clockseq    node
 *
 * 0 -> 7     9 -> 12    14 -> 17    19 -> 22    24 -> 35
 *
 * 注意：index包含dash，一共32个十六进制数字
 *
 * 优化后：
 *
 * time_high  time_mid  time_low    clockseq   node
 *
 * 11d8   -   eebc    - 58e0a7d7  - 9669     - 0800200c9a66
 * ```
 */
export class Ruid {
  /**
   * 得到一个V1版本的UUID
   */
  public static getUuidV1() {
    return uuidv1();
  }

  public fromUuid(uuid: string) {
    const ruidString = this.convertUuidToRuid(uuid);

    return new Ruid(ruidString);
  }

  public toString() {
    return this.ruidString;
  }

  public toJSON() {
    return this.ruidString;
  }

  public toSqlString() {
    return `X'${this.ruidString}'`;
  }

  public toBuffered() {
    return this.ruidBuffer;
  }

  /**
   * @param ruidStringOrRuidBuffer The reference Ruid or buffered Ruid
   */
  constructor(ruidStringOrRuidBuffer?: string | Buffer) {
    if (Buffer.isBuffer(ruidStringOrRuidBuffer)) {
      const decoder = new StringDecoder("hex");

      const ruidString = decoder.end(ruidStringOrRuidBuffer);

      // TODO: 验证ruidString是否合法
      if (false) {
        throw new Error(`Invalid buffer type reference RUID`);
      }

      this.ruidBuffer = ruidStringOrRuidBuffer;
      this.ruidString = ruidString.toLowerCase();
    } else {
      // TODO: 验证ruidString是否合法
      if (
        ruidStringOrRuidBuffer &&
        typeof ruidStringOrRuidBuffer !== "string"
      ) {
        throw new Error(`Invliad string type reference RUID`);
      }

      const ruidString = ruidStringOrRuidBuffer
        ? ruidStringOrRuidBuffer
        : this.convertUuidToRuid(uuidv1());

      this.ruidString = ruidString.toLowerCase();
      this.ruidBuffer = Buffer.from(ruidString, "hex");
    }
  }

  private readonly ruidString: string;
  private readonly ruidBuffer: Buffer;

  private convertUuidToRuid(uuid: string): string {
    if (!isUUID(uuid)) {
      throw new Error(`Invliad reference UUID.`);
    }

    return (
      uuid.slice(14, 18) +
      uuid.slice(9, 13) +
      uuid.slice(0, 8) +
      uuid.slice(19, 23) +
      uuid.slice(24)
    );
  }
}
