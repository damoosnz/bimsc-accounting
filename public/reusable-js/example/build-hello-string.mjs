import name from './some-dependency.mjs';

export function buildHelloString(from) {
  return `Hello: ${name}. From: ${from}`;
}
