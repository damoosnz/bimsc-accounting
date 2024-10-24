# Basic setup
1. Clone this repo to a new github repo in your own account (eg download zipped files & upload to github)
2. Create a new Netlify project via the Web interface of Netlify.com
3. Configure the Netlify project to auto-deploy from the new github repo
4. Wait for first deploy to finish
5. In Netlify web interface:
    1. Change site URL as desired
    2. Add environment variable of your Knack application ID named `KNACK_APPLICATION_ID` (leaving all values default)
6. `./knack-builder-code/knack-js-area-code-EXAMPLE.js` 
    1. Rename to `knack-js-area-code.js`
    2. Change line 19 (url of 2nd script import) to the URL of your Netlify project (`url: "https://YOUR-PROJECT.netlify.app/reusable-js/knack-index.mjs",` -> `url: "https://YOUR-ACTUAL-PROJECT-URL.netlify.app/reusable-js/knack-index.mjs",`)
    3. Save & commit (no need to push to github for now)
    4. Copy to your Knack app javascript area and save
7. in `./public/reusable-js/knack-index.mjs` 
    1. Change line 3 `const netlifyBaseUrl =....` to your Netlify base url eg `'https://knack-netlify-demo.netlify.app'`
    2. Save the file & commit (no need to push to github yet)
8. In `./functions/example.js` 
    1. change line 7 `const sceneToFetchFrom...` and line 8 `const viewToFetchFrom...` to a scene and view of a GRID view on a LOGIN-PROTECTED page in your Knack app (for view-based get request when you test that function)
       * Important: this scene and view must be on a login protected page!
    3. Save & commit
9. Push all changes to github
10. Wait for new Netlify deploy to finish
11. Login to your Knack app, then reload your Knack app with the browser console open. You should see the following outputs if everything worked correctly. These outputs correspond to all the console.logs in `knack-index.mjs`

```
loaded file https://YOUR-PROJECT.netlify.app/reusable-js/knack-index.mjs
all external files loaded

In-production scene render event in knack-index.mjs scene_3

Hello: Peter Rabbit. From: knack-index.mjs

knackAPi from knack-index.mjs  
KnackAPI {headers: {…}, urlBase: 'https://api.knack.com/v1', remoteLogin: ƒ, login: ƒ, validateSession: ƒ, …}

knack-index.mjs:30 axios response from knack-index.mjs 
{data: {…}, status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}

knack-index.mjs:34 fetch response from knack-index.mjs 
Response {type: 'cors', url: 'https://jsonplaceholder.typicode.com/posts/1', redirected: false, status: 200, ok: true, …}

Knack app ID from knack-index.mjs 65fa19b148e211002848ce08
typeof process from knack-index.mjs undefined

Netlify function response from knack-index.mjs [{…}]
```

# Setting up a development environment & start local dev server
1. Make sure you have a code editor like VS Code installed and linked to your Github account
2. Clone the repo that you setup above to your local machine
3. Install the netlify CLI `npm instal netlify-cli --g`
4. Login to netlify CLI `netlify login` and follow the authorization instructions in your browser
5. Link the local repo to the Netlify project `netlify link` and select "Use current git remote origin"
6. Run `npm install` to install all dependencies locally
7. Run `netlify dev` to start the local dev server. This should have pulled in the environment variables from the Netlify project and started a local server at localhost:8888
8. You can now make changes to the code in the repo and see the changes live at localhost:8888 without impacting your live project. Eg:
    * Index.html at localhost:8888
    * The Netlify function at localhost:8888/.netlify/functions/example
    * The Knack app javascript area code at localhost:8888/reusable-js/knack-index.mjs (more info on how to make use of this below)

## Using development code in your Knack app while keeping the live code in production
Our Knack app normally imports code into the Knack JS area from `your-project.netlify.app/reusable-js/knack-index.mjs`. 

However, we can configure the Knack app to import our local development code from `localhost:8888/reusable-js/knack-index.mjs` JUST for our local machine. This allows you to make changes and see them JUST ON YOUR MACHINE, without impacting the live code in production.

Note that any changes you make in the Knack builder ARE reflected instantly in production. This development workflow just allows you to have dev & production versions of `knack-index.mjs` code.

[Video demo of the instructions below](https://drive.google.com/open?id=1ZuDWrurMXS_3zAaYro-aMEkciMgFTuPX&usp=drive_fs) 

1. Follow the instructions above to start the local dev server
2. Open your Knack app
3. Open browser console
4. Type `localStorage.setItem('knackDevMode', 'true')` and press enter. This stores a local variable (for your machine only, but works for ANY tab) that tells the Knack app to import code from `localhost:8888/reusable-js/knack-index.mjs` instead of `your-project.netlify.app/reusable-js/knack-index.mjs`.
5. Reload the Knack app. You should now see a message in console, meaning you've successfully loaded the localhost code instead of live code:
```
*************** LOADING DEV CODE FROM LOCALHOST:8888 ***************
```
6. Make any changes in the `reusable-js` folder, using `./public/reusable-js/knack-index.mjs` as your entry point like normal. Save, then reload your Knack app see changes.
7. To stop using development code on your machine, open the browser console and type `localStorage.removeItem('knackDevMode')`. Next time your reload you'll now load the live production code again instead of your localhost code.
8. Once you've tested locally, push your changes to github and wait for the Netlify deploy to finish. The code is now live!

# How to import reusable-js functions into nodejs (Netlify functions, Pipedream, other)
See `./public/reusable-js/README.md` for instructions

# Videos corresponding to an older version of this repo which are still somewhat relevant (but out of date)
see videos https://drive.google.com/open?id=1SzeWv7dXTjJQobbgIc6TVbE82p-uFHLc&usp=drive_fs
