//Example helpers to export for use in nodejs, by bundling with webpack
//The file name refers to a theoretical Pipedream workflow called P-M01, what we'll be using this file for.

import { buildHelloString } from "../example/build-hello-string.mjs";

const helpers = {
  buildHelloString,
};

export default helpers;