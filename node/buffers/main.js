const { heading, print } = require("../utils/formatOutput");
const padding = 30;

heading("Buffers", "=-*-=");

heading("Basic Operations", "---");
// Allocate buffer
const allocatedBuf = Buffer.alloc(16);
print(allocatedBuf.toString());
print("", "Buffer.alloc(16)");
print("Allocated buffer:", allocatedBuf);

// Write to allocated buffer
const writtenBuf = allocatedBuf.write("Hi there");
print("", 'allocatedBuf.write("Hi there") - returns length', true);
print("Write to buffer:", writtenBuf);

// Allocate and write to a new buffer using an array of bytes in the range 0-255
const bufInit1 = Buffer.from("Ivar");
const bufInit2 = Buffer.from("Ivar");
print("", 'Buffer.from("Ivar")', true);
print("Allocated and written:", bufInit1);

// Get buffer byte length
const bufLen = Buffer.byteLength(bufInit1);
print("", "Buffer.byteLength(buffer)", true);
print("Buffer length:", bufLen);

// Compare buffers, for instance for sorting
const smallBuf = Buffer.from([10, 100]);
const largeBuf = Buffer.from([100, 10]);
const equalBuffers1 = Buffer.compare(smallBuf, largeBuf);
const equalBuffers2 = Buffer.compare(smallBuf, smallBuf);
const equalBuffers3 = Buffer.compare(largeBuf, smallBuf);

heading("Compare", "-");
print("", "Bugger.compare(buf1, buf2)", true);
print("<", equalBuffers1);
print("===", equalBuffers2.toString());
print(">", equalBuffers3);
print("", "useful for sorting");

heading("Arrays", "-");
const bufFromArr = Buffer.from([73, 118, 97, 114]);
print("", "Buffer.from([73, 118, 97, 114])", true);
print("Buffer from array:", bufFromArr);

const buffer1 = Buffer.from("Ivar");
const buffer2 = Buffer.from("Alexander");
const buffer3 = Buffer.from("Abusdal");

const arrBuf = new ArrayBuffer(10);
print("", "new ArrayBuffer(10)", true);
print("Array Buffer:", arrBuf);

print("", "Concat array of buffers", true);
const arr = [buffer1, buffer2, buffer3];
print("arr:", arr);

print("", "Buffer.concat(arr)");
const conBuf = Buffer.concat(arr);
print("Concatenated array:", conBuf);

print(
  "Loop over buffer array:",
  "for (a of conBuf.entries()) { console.log(a) }",
  true,
);

for (a of conBuf.entries()) {
  print("", a);
}

heading("Edit buffers", "-");
print("", 'Buffer.alloc(23).fill("x")', true);
const filledBuf = Buffer.alloc(23).fill("x");
print("Fill buffer:", filledBuf.toString());

const myBuf = Buffer.from("Copied buffer");
print("", "const bufCopy = Buffer.from(buffer)", true);
const bufCopy = Buffer.from(myBuf);
print("Copy buffer:", bufCopy);

const arrayBuffer = new ArrayBuffer(8);
const bufOff = Buffer.from(arrayBuffer, 0, 2);
print("", "Buffer.from(arrBuf, 0, 2)", true);
print("Buffer offset and length:", bufOff);

heading("Buffer search", "-");
const bufInc = Buffer.from("dancing red penguins in dresses");
print(
  "",
  'Buffer.from("dancing red benguins in dresses").incudes("this")',
  true,
);
print("result:", bufInc.includes("this").toString());

heading("Encoding", "-");
print('Buffer.isEncoding("hex"):', Buffer.isEncoding("hex"), true); // true
print('Buffer.isEncoding("utf8"):', Buffer.isEncoding("utf8")); // true
print('Buffer.isEncoding("utf-8"):', Buffer.isEncoding("utf-8")); //true
print('Buffer.isEncoding("uft_8"):', Buffer.isEncoding("utf_8").toString()); // false
print('Buffer.isEncoding("hey"):', Buffer.isEncoding("hey").toString()); // false

heading("Slice", "-");
print("", "Is depricated", true);
const sliceBuf = Buffer.from("abcdef");
print('Buffer.from("abcdef")', sliceBuf);
const slicedBuf = sliceBuf.slice(2, 5); //depricated
print("sliceBuf.slice(2,5)", slicedBuf);

heading("Decimal and Hex", "-");
const bufDec = Buffer.from([89, 101, 97, 97, 97, 104, 33, 33]); // decimal values
print("Decimals:", "Buffer.from([89, 101, 97, 97, 97, 104, 33, 33])", true);
print("To string:", bufDec.toString());
const bufHex = Buffer.from([0x59, 0x65, 0x61, 0x61, 0x61, 0x68, 0x21, 0x21]); // hexadecimal values
print(
  "Hexadecimal:",
  "Buffer.from([0x59, 0x65, 0x61, 0x61, 0x61, 0x68, 0x21, 0x21])",
  true,
);
print("To string:", bufHex.toString());

heading("JSON", "-");
print("bufDec.toJSON():", bufDec.toJSON(), true); // { type: 'Buffer', data: [ 89, 101, 97, 97, 97, 104, 33, 33]}
print("bufHex.toJSON():", bufHex.toJSON()); // binaries as decimal values in JSON

heading("Swapping", "-");
print("", "Can be used for fast endianess conversion", true, true);
const bufSwap = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
print("Original buffer:", bufSwap);

bufSwap.swap16(); // must be multiple of 16-bit
print("buffer.swap16():", bufSwap);
bufSwap.swap16(); // must be multiple of 16-bit

bufSwap.swap32();
print("buffer.swap32():", bufSwap);
bufSwap.swap32();

bufSwap.swap64();
print("buffer.swap64():", bufSwap);
bufSwap.swap64();
