Any *.js file you put into this directory will be bundled when you run `npm run build` or when you deploy to netlify (which automatically runs `npm run build`)

Each file will bundle into ./public/reusable-js/bundled-for-nodedjs with same file name

## Why?

So you can use reusable-js in both browser and nodejs environments.

The `reusable-js` folder works well with browser `<script type="module">` imports, because the browser will resolve imports for you. Eg if `index.js` imports `utils.js`, and you import `index.js` via a script tag, the browser will automatically fetch `utils.js` and run it before running `index.js`.

However, nodejs does not have any clean or easy way to import an external file FROM URL. (Import and Require statements only work for local files).

A workaround in nodejs is to download a js file at runtime from URL to the filesystem (eg /tmp) and use then import it. However, this only works for a single file, and does not resolve dependencies of the imported file.

Therefore, for usage in nodejs, we bundle dependencies at build time into a single file. Therefore, you can use your `reusable-js` in both browser and nodejs environments.

Here's an example file to put within `to-bundle-for-nodejs`. Let's say its called `P-M01-helpers.js` (indicating that this particular file is designed for import into pipedream workflow that we have named P-M01)

```js
import { buildHelloString } from '../helpers.js';

const helpers = {
  buildHelloString
}

export default helpers;
```

Notice how it does not add any NEW logic, it simply acts as an entry point for webpack to bundle the appropriate functions defined elsehwere in your public folder.

Recommendation: one `to-bundle-for-nodejs` file per usage for easy maintenance (eg `P-M02-helpers.js` indicating pipedream workflow P-M02 uses it, and `P-M03-helpers.js` for P-M03). This way, you can easily see which files are used in which workflows.

Here is an example of downloading and importing the file. This code is for importing and running from a single Pipedream component (using dynamic imports) but similar code should also work in other nodejs environments like a Netlify function.

```js
import axios from "axios";
import fs from "fs";
import { fileURLToPath } from 'url';

export default defineComponent({
  async run({ steps, $ }) {
    const url = 'https://ncm360.netlify.app/reusable-js/bundled-for-nodejs/P-M01-helpers.js';
    const filename = 'p-m01-helpers.js';
    const downloadedFilepath = `/tmp/${filename}`;

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(downloadedFilepath, response.data);

      const filePathForImport = fileURLToPath(`file://${downloadedFilepath}`);
      const helpers = await import(filePathForImport);
      const { buildHelloString } = helpers.default.default;
      console.log(buildHelloString());
      
    } catch (error) {
      console.error('An error occurred:', error);
      throw error; // Rethrow or handle as needed
    }
  },
});
```