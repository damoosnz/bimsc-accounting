//Copy paste this code into your Knack javascript area
//Once that is done, you shouldn't need to edit code in the Knack JS area again.
//Instead, manage all your javascript in public/reusable-js/knack-index.mjs and knack-dev-index.mjs

if (localStorage.getItem("knackDevMode") === "true") {
  console.log ("*************** LOADING DEV CODE FROM LOCALHOST:8888 ***************")
  loadExternalFiles([
    {
      type: "script",
      module: true,
      url: "http://localhost:8888/reusable-js/knack-index.mjs",
    },
  ]);
} else {
  loadExternalFiles([
    {
      type: "script",
      module: true,
      url: "https://YOUR-PROJECT.netlify.app/reusable-js/knack-index.mjs",
    },
  ]);
}

function loadExternalFiles(externalFiles) {
  KnackInitAsync = function ($, callback) {

    Knack.showSpinner();

    window.$ = $;

    loadFiles(externalFiles);

    function loadFiles() {
      const num = externalFiles.length;
      let finished = 0;

      externalFiles.forEach((file, i) => {
        if (file.type === "script") createScriptTag(file);
        if (file.type === "link") createLinkTag(file);
      });

      function createScriptTag(file) {
        var script = document.createElement("script");
        script.src = file.url;
        script.async = false; //So they load in order added to the page. Without this load order is unpredictable (async)
        script.onload = function () {
          fileLoaded(file);
        };
        if (file.module) {
          script.setAttribute("type", "module");
        }
        script.onerror = function () {
          loadError(file);
        };
        document.head.appendChild(script);
      }

      function createLinkTag(file) {
        var link = document.createElement("link");
        link.href = file.url;
        link.rel = "stylesheet";
        link.onload = function () {
          fileLoaded(file);
        };
        link.onerror = function () {
          loadError(file);
        };
        document.head.appendChild(link);
      }

      function fileLoaded(file) {
        finished += 1;
        console.log(`loaded file ${file.url}`);
        if (num === finished) {
          console.log("all external files loaded");
          callback();
        }
      }

      function loadError(file) {
        if (file.skipErrorIfFail !== true) {
          alert(
            `error loading the app, refresh your page and try again. Error details: unable to load external file ${file.url}`
          );
          Knack.hideSpinner();
        } else {
          console.log(
            `error loading file ${file.url}, continuing anyway due to skipErrorIfFail === true`
          );
          //Continue as if the file loaded successfully when skipping error
          fileLoaded(file);
        }
      }
    }
  };
}
