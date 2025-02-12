import { randomIntFromRange } from "../utils/misc";

function getRandomIPvXaddress(
  bits: number,
  parts: number,
  base: number,
  separator: string
): string {
  const addr: string[] = [];
  const b = Math.round(bits / parts);
  for (let i = 0; i < parts; i++) {
    const n = randomIntFromRange(0, 2 ** b - 1);
    addr.push(n.toString(base));
  }
  return addr.join(separator);
}

function getIPCidr(
  bits: number,
  parts: number,
  base: number,
  separator: string,
  address: string,
  maskSize: number
): string {
  const addr = address.split(separator).map((a) => parseInt(a, base));
  const b = Math.round(bits / parts);
  let bitsLeft = maskSize;
  for (let i = 0; i < parts; i++) {
    bitsLeft -= b;
    if (bitsLeft < 0) {
      if (-bitsLeft <= b) {
        addr[i] &= (2 ** b - 1) ^ (2 ** -bitsLeft - 1);
      } else {
        addr[i] = 0;
      }
    }
  }
  return (
    addr.map((a) => a.toString(base)).join(separator) +
    "/" +
    maskSize.toString()
  );
}

export function getRandomIPv4address(): string {
  return getRandomIPvXaddress(32, 4, 10, ".");
}

export function getRandomIPv6address(): string {
  return getRandomIPvXaddress(128, 8, 16, ":");
}

export function addressToCIDR(addr: string): string {
  if (addr.includes(":")) {
    return getIPCidr(128, 8, 16, ":", addr, randomIntFromRange(16, 32) * 4);
  } else {
    return getIPCidr(32, 4, 10, ".", addr, randomIntFromRange(8, 32));
  }
}
