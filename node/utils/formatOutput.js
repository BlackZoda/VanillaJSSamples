const padding = 30;

function print(label, value, lineBefore, lineAfter) {
  lineBefore = lineBefore ? true : false;
  lineBefore ? console.log() : null;

  label = label.toString().padStart(padding, " ");
  value = value ? value : "";
  console.log(label, value);

  lineAfter = lineAfter ? true : false;
  lineAfter ? console.log() : null;
}

function heading(heading, decorator) {
  console.log();
  const decoratorLine = Buffer.alloc(padding).fill(decorator).toString();
  console.log(`${decoratorLine} ${heading}`);
}

module.exports = { print, heading };
