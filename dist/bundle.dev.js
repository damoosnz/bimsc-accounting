var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/node-fetch/browser.js
var require_browser = __commonJS({
  "node_modules/node-fetch/browser.js"(exports, module) {
    "use strict";
    var getGlobal = function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    };
    var globalObject = getGlobal();
    module.exports = exports = globalObject.fetch;
    if (globalObject.fetch) {
      exports.default = globalObject.fetch.bind(globalObject);
    }
    exports.Headers = globalObject.Headers;
    exports.Request = globalObject.Request;
    exports.Response = globalObject.Response;
  }
});

// node_modules/@callum.boase/fetch/_fetch.js
var require_fetch = __commonJS({
  "node_modules/@callum.boase/fetch/_fetch.js"(exports, module) {
    if (inBrowser()) {
      fetch2 = window.fetch;
    } else {
      fetch2 = require_browser();
    }
    var fetch2;
    function inBrowser() {
      try {
        window.fetch;
        return true;
      } catch (err) {
        return false;
      }
    }
    var _fetch = {
      delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },
      tools: {
        exponentialBackoff(attempt) {
          return Math.pow(2, attempt - 1) * 1e3;
        }
      },
      defaults: {
        retryDelay(attempt, mostRecentErr) {
          if (mostRecentErr.details.response.status === 429) {
            return Math.pow(2, attempt - 1) * 1e3;
          } else {
            return 1e3;
          }
        },
        retryOn(attempt, err) {
          if (err.details && err.details.response && (err.details.response.status >= 500 || err.details.response.status === 429)) {
            return true;
          } else {
            return false;
          }
        }
      },
      async wrapper(url2, options2 = {}, helperData2 = {}) {
        try {
          const response = await fetch2(url2, options2);
          const text = await response.text();
          let json = null;
          if (isJson(text)) {
            json = JSON.parse(text);
          }
          if (response && response.ok) {
            return { url: url2, options: options2, response, helperData: helperData2, json, text };
          }
          let err = new Error(`Successful http request but response.ok === false. Code: ${response.status}, Text: ${text}`);
          err.details = { url: url2, options: options2, response, helperData: helperData2, json, text };
          throw err;
        } catch (err) {
          !err.details ? err.details = { url: url2, options: options2, helperData: helperData2 } : err.datails;
          throw err;
        }
        function isJson(text) {
          try {
            JSON.parse(text);
            return true;
          } catch (err) {
            return false;
          }
        }
      },
      async one(settings = { url, options, helperData, retries, retryDelay, retryOn }) {
        if (typeof settings !== "object" || !settings.url) throw new Error("Invalid argument when calling _fetch.one. You must call _fetch.one with an object (settings), containing at-minimum: settings = {url: string}");
        if (!settings.options) settings.options = { method: "GET" };
        if (settings.options && !settings.options.method) settings.options.method = "GET";
        if (!settings.retries && settings.retries !== 0) settings.retries = 5;
        if (typeof settings.retryDelay !== "function" && typeof settings.retryDelay !== "number") {
          settings.retryDelay = this.defaults.retryDelay;
        }
        if (typeof settings.retryOn !== "function") {
          settings.retryOn = this.defaults.retryOn;
        }
        let mostRecentErr;
        for (let i = 0; i <= settings.retries; i++) {
          try {
            if (i > 0) {
              let retryDelay2;
              if (typeof settings.retryDelay === "function") {
                retryDelay2 = settings.retryDelay(i, mostRecentErr);
              } else {
                retryDelay2 = settings.retryDelay;
              }
              await this.delay(retryDelay2);
            }
            return await this.wrapper(settings.url, settings.options, settings.helperData);
          } catch (err) {
            const isLastRetry = i === settings.retries;
            if (isLastRetry) throw err;
            const shouldRetry = await settings.retryOn(i, err);
            if (!shouldRetry) throw err;
            mostRecentErr = err;
            console.log(`failed fetch ${settings.options.method} to ${settings.url}. Code: ${err.details && err.details.response ? err.details.response.status : ""}. Attempt ${i}. Retrying...`);
          }
        }
      },
      async many(settings = { requests, delayMs, progressCbs }) {
        if (!settings.delayMs) settings.delayMs = 125;
        let promises = [];
        settings.requests.forEach((request, i) => {
          const promise = (async () => {
            await this.delay(i * settings.delayMs);
            const fetchResult = await this.one({
              url: request.url,
              options: request.options,
              retries: request.retries,
              retryDelay: request.retryDelay,
              retryOn: request.retryOn,
              helperData: { request, delayMs: i * settings.delayMs, i }
            });
            progress++;
            if (settings.progressCbs && settings.progressCbs.length) {
              settings.progressCbs.forEach((progressCb) => {
                progressCb(progress, len, fetchResult);
              });
            }
            return fetchResult;
          })();
          promises.push(promise);
        });
        const len = promises.length;
        let progress = 0;
        return Promise.allSettled(promises);
      }
    };
    if (typeof __require != "undefined") module.exports = _fetch;
  }
});

// node_modules/knack-api-helper/knack-api-helper.js
var require_knack_api_helper = __commonJS({
  "node_modules/knack-api-helper/knack-api-helper.js"(exports, module) {
    var _fetch = require_fetch();
    function KnackAPI3(config) {
      checkConfig();
      if (config.auth === "view-based") {
        this.headers = {
          "X-Knack-Application-ID": config.applicationId,
          "X-Knack-REST-API-Key": "knack",
          "Authorization": typeof config.userToken === "string" ? config.userToken : "",
          "Content-Type": "application/json"
        };
      } else if (config.auth === "object-based") {
        this.headers = {
          "X-Knack-Application-ID": config.applicationId,
          "X-Knack-REST-API-Key": config.apiKey,
          "Content-Type": "application/json"
        };
      }
      this.urlBase = `https://api.knack.com/v1`;
      this.remoteLogin = async function(settings = { email, password }) {
        return await _fetch.one({
          url: `${this.urlBase}/applications/${this.headers["X-Knack-Application-ID"]}/session`,
          options: {
            method: "POST",
            body: JSON.stringify({
              email: settings.email,
              password: settings.password
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        });
      };
      this.login = async function(settings = { email, password }) {
        if (settings.email && settings.password) {
          const res2 = await this.remoteLogin(settings);
          const token = res2.json.session.user.token;
          this.headers.Authorization = token;
          return token;
        } else {
          throw new Error("You did not specify one/both of email and password in settings object. Could not log in");
        }
      }, this.validateSession = async function(settings = { userToken, userRoleCheck }) {
        if (typeof settings.userToken !== "string") {
          throw new Error("You must provide a settings object with at least a userToken (string) to validateSession()");
        }
        try {
          const response = await _fetch.one({
            url: `${this.urlBase}/session/token`,
            options: {
              method: "GET",
              headers: {
                "Authorization": settings.userToken,
                "x-knack-application-id": this.headers["X-Knack-Application-ID"]
              }
            }
          });
          const session = response.json?.session;
          if (!session) throw new Error("No session found");
          if (session.user.status !== "current") throw new Error("Valid user but session not current.");
          if (session.user.account_status !== "active") throw new Error("Valid user but status not active.");
          if (session.user.approval_status !== "approved") throw new Error("Valid user but approval status is not approved.");
          if (settings.userRoleCheck) {
            if (!session.user.profile_keys.includes(settings.userRoleCheck)) {
              throw new Error("Valid user but does not include the specified user role.");
            }
          }
          return true;
        } catch (err) {
          return false;
        }
      }, this.url = function(settings = { scene, view, object, recordId }) {
        let url2 = this.urlBase;
        if (config.auth === "view-based") {
          url2 += `/pages/${settings.scene}/views/${settings.view}/records/`;
        } else if (config.auth === "object-based") {
          url2 += `/objects/${settings.object}/records/`;
        }
        if (settings.recordId) url2 += settings.recordId;
        return url2;
      };
      this.getRetries = function(retries2) {
        if (typeof retries2 === "number") {
          return retries2;
        } else {
          return 5;
        }
      };
      this.setup = function(method, settings) {
        let url2 = "";
        if (config.auth === "view-based") {
          url2 = this.url({
            scene: settings.scene,
            view: settings.view,
            recordId: settings.recordId
          });
        } else if (config.auth === "object-based") {
          url2 = this.url({
            object: settings.object,
            recordId: settings.recordId
          });
        }
        const options2 = {
          method,
          headers: this.headers
        };
        if (settings.body) options2.body = JSON.stringify(settings.body);
        const retries2 = this.getRetries(settings.retries);
        return { url: url2, options: options2, retries: retries2, helperData: settings.helperData };
      };
      this.single = async function(method, settings) {
        const req = this.setup(method, settings);
        return await _fetch.one(req);
      };
      this.many = async function(method, settings) {
        if (method === "GET") return console.log("knackAPI.many is only for POST, PUT and DELETE");
        const requests2 = [];
        settings.records.forEach((record) => {
          const reqSettings = {
            view: settings.view,
            scene: settings.scene,
            object: settings.object,
            retries: settings.retries
          };
          if (method !== "DELETE") {
            reqSettings.body = record;
          }
          if (method !== "POST") {
            reqSettings.recordId = record.id;
          }
          requests2.push(this.setup(method, reqSettings));
        });
        if (settings.resultsReport) this.tools.manyResultsReport.remove(settings.resultsReport);
        const progressCbs2 = this.progressCbsSetup(settings);
        const results = await _fetch.many({ requests: requests2, delayMs: 125, progressCbs: progressCbs2 });
        results.settings = settings;
        results.summary = this.tools.manyResultsReport.calc(results);
        if (settings.resultsReport) {
          this.tools.manyResultsReport.create(settings.resultsReport, results);
        }
        return results;
      };
      this.progressCbsSetup = function(settings) {
        let progressCbs2 = [];
        if (settings.progressBar) {
          this.tools.progressBar.create(settings.progressBar);
          progressCbs2.push((progress, len, fetchResult) => {
            this.tools.progressBar.update(settings.progressBar.id, progress, len);
          });
        }
        if (settings.progressCbs && settings.progressCbs.length) {
          settings.progressCbs.forEach((progressCb) => progressCbs2.push(progressCb));
        }
        return progressCbs2;
      };
      this.get = async function(settings = { view, scene, object, recordId, helperData }) {
        return await this.single("GET", settings);
      };
      this.post = async function(settings = { view, scene, object, body, helperData, retries }) {
        return await this.single("POST", settings);
      };
      this.put = async function(settings = { recordId, view, scene, object, body, helperData, retries }) {
        return await this.single("PUT", settings);
      };
      this.delete = async function(settings = { recordId, view, scene, object, helperData, retries }) {
        return await this.single("DELETE", settings);
      };
      this.getMany = async function(settings = { view, scene, object, filters, rowsPerpage, startAtPage, maxRecordsToGet, helperData }, currentPage = 1, final = { records: [], pages: [] }) {
        const req = this.setup("GET", settings);
        if (currentPage === 1) {
          if (settings.startAtPage > 1) currentPage = settings.startAtPage;
        }
        const maxRecordsToGet2 = settings.maxRecordsToGet > 0 ? settings.maxRecordsToGet : Infinity;
        let rowsPerPage = settings.rowsPerPage ? settings.rowsPerPage : 1e3;
        req.url += `?page=${currentPage}&rows_per_page=${rowsPerPage}`;
        if (settings.format) req.url += `&format=${settings.format}`;
        if (settings.filters) req.url += `&filters=${JSON.stringify(settings.filters)}`;
        const result = await _fetch.one(req);
        final.pages.push(result);
        result.json.records.map((record) => final.records.push(record));
        final.helperData = settings.helperData;
        if (final.records.length > maxRecordsToGet2) {
          final.records = final.records.splice(0, maxRecordsToGet2);
        }
        if (final.records.length < maxRecordsToGet2 && result.json.current_page < result.json.total_pages) {
          return await this.getMany(settings, result.json.current_page + 1, final);
        } else {
          return final;
        }
      };
      this.putMany = async function(settings = { records, view, scene, object, helperData, retries, progressBar, progressCbs, resultsReport }) {
        return await this.many("PUT", settings);
      };
      this.postMany = async function(settings = { records, view, scene, object, helperData, retries, progressBar, progressCbs, resultsReport }) {
        return await this.many("POST", settings);
      };
      this.deleteMany = async function(settings = { records, view, scene, object, helperData, retries, progressBar, progressCbs, resultsReport }) {
        return await this.many("DELETE", settings);
      };
      this.getFromReportView = async function(settings = { view, scene, sceneRecordId, helperData, retries }) {
        if (config.auth !== "view-based") throw new Error("getFromReportView() only works when using view-based auth");
        if (!settings.view || !settings.scene) throw new Error("getFromReportView() requires a view and scene. You did not specify one or both.");
        if (settings.recordId) throw new Error(`getFromReportView() does not support recordId. Specify settings.sceneRecordId if you are trying to load a report on a child page that has the data source of "this page's record" or similar.`);
        let url2 = `${this.urlBase}/scenes/${settings.scene}/views/${settings.view}/report`;
        if (settings.sceneRecordId) {
          const sceneSlug = await this.getSceneSlug(settings.scene);
          url2 += `?${sceneSlug}_id=${settings.sceneRecordId}`;
        }
        const req = {
          url: url2,
          options: {
            method: "GET",
            headers: this.headers
          },
          retries: this.getRetries(settings.retries),
          helperData: settings.helperData
        };
        return await _fetch.one(req);
      };
      this.tools = {
        progressBar: {
          html(id) {
            return $(`
                    <div id="${id}" style="margin-bottom: 10px;">
                        <span class="before-progress-bar" style="margin-right: 5px;"><em><strong>Processing records</em></strong></span>
                        <progress id="progressBar" value="0" max="100"></progress>
                        <span class="after-progress-bar" style="margin-left: 5px;" id="progressText">Initialising...</span>
                    </div>
                `);
          },
          update(id, progress, len) {
            $(`#${id} #progressBar`).val(Math.round(progress / len * 100));
            $(`#${id} #progressText`).text(`${progress}/${len}`);
          },
          create(progressBar2) {
            $(`#${progressBar2.id}`).remove();
            if (progressBar2.insertAfter) {
              this.html(progressBar2.id).insertAfter(progressBar2.insertAfter);
            } else if (progressBar2.insertBefore) {
              this.html(progressBar2.id).insertBefore(progressBar2.insertBefore);
            } else if (progressBar2.appendTo) {
              this.html(progressBar2.id).appendTo(progressBar2.appendTo);
            } else if (progressBar2.prependTo) {
              this.html(progressBar2.id).prependTo(progressBar2.prependTo);
            } else {
              console.log("Invalid progress bar location");
            }
          }
        },
        manyResultsReport: {
          calc(results) {
            const fulfilled = results.reduce((acc, curr) => {
              if (curr.status === "fulfilled") acc++;
              return acc;
            }, 0);
            const rejected = results.reduce((acc, curr) => {
              if (curr.status === "rejected") acc++;
              return acc;
            }, 0);
            const errors = results.filter((result) => {
              if (result.status !== "fulfilled") {
                return true;
              } else {
                return false;
              }
            });
            return { fulfilled, rejected, errors };
          },
          html(id, results) {
            const summary = this.calc(results);
            return $(`
                    <div id=${id}>
                        <p><strong>Finished processing</strong></p>
                        <p>Summary:</p>
                        <p>
                            <ul>
                                <li>Failed: ${summary.rejected}</li>
                                <li>Succeeded: ${summary.fulfilled}</li>
                            </ul>
                        </p>
                    </div>
                `);
          },
          create(resultsReport2, results) {
            if (resultsReport2.insertAfter) {
              this.html(resultsReport2.id, results).insertAfter(resultsReport2.insertAfter);
            } else if (resultsReport2.insertBefore) {
              this.html(resultsReport2.id, results).insertBefore(resultsReport2.insertBefore);
            } else if (resultsReport2.appendTo) {
              this.html(resultsReport2.id, results).appendTo(resultsReport2.appendTo);
            } else if (resultsReport2.prependTo) {
              this.html(resultsReport2.id, results).prependTo(resultsReport2.prependTo);
            } else {
              console.log("Invalid summary location");
            }
          },
          remove(resultsReport2) {
            $(`#${resultsReport2.id}`).remove();
          }
        }
      };
      this.getSceneSlug = async function(sceneKey) {
        const appDataUrl = `${this.urlBase}/applications/${this.headers["X-Knack-Application-ID"]}`;
        const appData = await _fetch.one({
          url: appDataUrl,
          options: {
            method: "GET"
          }
        });
        const scenes = appData.json.application.scenes;
        const scene2 = scenes.find((scene3) => scene3.key === sceneKey);
        if (!scene2) throw new Error(`Scene with key ${sceneKey} not found, when trying to find corresponding slug (url). Could not continue.`);
        const slug = scene2.slug;
        if (!slug) throw new Error(`Scene with key ${sceneKey} found, but no slug (url) found. Could not continue.`);
        return slug;
      };
      function checkConfig() {
        if (!config) throw new Error("KnackAPI config settings object not found");
        if (!config.auth) throw new Error("KnackAPI.auth configuration not found");
        if (config.auth !== "object-based" && config.auth !== "view-based") {
          throw new Error(`KnackAPI.auth invalid - should be "view-based" or "object-based" but got "${config.auth}"`);
        }
        if (!config.applicationId) throw new Error(`KnackAPI.applicationId not found`);
        if (config.auth === "object-based" && !config.apiKey) throw new Error("Object-based auth selected but did not find an API key");
        try {
          if (config.auth === "object-based" && Knack) {
            console.log(`
                    Warning! Object-based auth selected but it looks like you are running code in the Knack Javascript area. 
                    We strongly recommend you use view-based auth instead;
                `);
          }
        } catch (err) {
        }
      }
    }
    module.exports = KnackAPI3;
  }
});

// node_modules/papaparse/papaparse.min.js
var require_papaparse_min = __commonJS({
  "node_modules/papaparse/papaparse.min.js"(exports, module) {
    !function(e, t) {
      "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && "undefined" != typeof exports ? module.exports = t() : e.Papa = t();
    }(exports, function s() {
      "use strict";
      var f = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== f ? f : {};
      var n = !f.document && !!f.postMessage, o = f.IS_PAPA_WORKER || false, a = {}, u = 0, b = { parse: function(e, t) {
        var r2 = (t = t || {}).dynamicTyping || false;
        J(r2) && (t.dynamicTypingFunction = r2, r2 = {});
        if (t.dynamicTyping = r2, t.transform = !!J(t.transform) && t.transform, t.worker && b.WORKERS_SUPPORTED) {
          var i = function() {
            if (!b.WORKERS_SUPPORTED) return false;
            var e2 = (r3 = f.URL || f.webkitURL || null, i2 = s.toString(), b.BLOB_URL || (b.BLOB_URL = r3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", i2, ")();"], { type: "text/javascript" })))), t2 = new f.Worker(e2);
            var r3, i2;
            return t2.onmessage = _, t2.id = u++, a[t2.id] = t2;
          }();
          return i.userStep = t.step, i.userChunk = t.chunk, i.userComplete = t.complete, i.userError = t.error, t.step = J(t.step), t.chunk = J(t.chunk), t.complete = J(t.complete), t.error = J(t.error), delete t.worker, void i.postMessage({ input: e, config: t, workerId: i.id });
        }
        var n2 = null;
        b.NODE_STREAM_INPUT, "string" == typeof e ? (e = function(e2) {
          if (65279 === e2.charCodeAt(0)) return e2.slice(1);
          return e2;
        }(e), n2 = t.download ? new l(t) : new p(t)) : true === e.readable && J(e.read) && J(e.on) ? n2 = new g(t) : (f.File && e instanceof File || e instanceof Object) && (n2 = new c(t));
        return n2.stream(e);
      }, unparse: function(e, t) {
        var n2 = false, _2 = true, m2 = ",", y2 = "\r\n", s2 = '"', a2 = s2 + s2, r2 = false, i = null, o2 = false;
        !function() {
          if ("object" != typeof t) return;
          "string" != typeof t.delimiter || b.BAD_DELIMITERS.filter(function(e2) {
            return -1 !== t.delimiter.indexOf(e2);
          }).length || (m2 = t.delimiter);
          ("boolean" == typeof t.quotes || "function" == typeof t.quotes || Array.isArray(t.quotes)) && (n2 = t.quotes);
          "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (r2 = t.skipEmptyLines);
          "string" == typeof t.newline && (y2 = t.newline);
          "string" == typeof t.quoteChar && (s2 = t.quoteChar);
          "boolean" == typeof t.header && (_2 = t.header);
          if (Array.isArray(t.columns)) {
            if (0 === t.columns.length) throw new Error("Option columns is empty");
            i = t.columns;
          }
          void 0 !== t.escapeChar && (a2 = t.escapeChar + s2);
          ("boolean" == typeof t.escapeFormulae || t.escapeFormulae instanceof RegExp) && (o2 = t.escapeFormulae instanceof RegExp ? t.escapeFormulae : /^[=+\-@\t\r].*$/);
        }();
        var u2 = new RegExp(Q(s2), "g");
        "string" == typeof e && (e = JSON.parse(e));
        if (Array.isArray(e)) {
          if (!e.length || Array.isArray(e[0])) return h2(null, e, r2);
          if ("object" == typeof e[0]) return h2(i || Object.keys(e[0]), e, r2);
        } else if ("object" == typeof e) return "string" == typeof e.data && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || i), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : "object" == typeof e.data[0] ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || "object" == typeof e.data[0] || (e.data = [e.data])), h2(e.fields || [], e.data || [], r2);
        throw new Error("Unable to serialize unrecognized input");
        function h2(e2, t2, r3) {
          var i2 = "";
          "string" == typeof e2 && (e2 = JSON.parse(e2)), "string" == typeof t2 && (t2 = JSON.parse(t2));
          var n3 = Array.isArray(e2) && 0 < e2.length, s3 = !Array.isArray(t2[0]);
          if (n3 && _2) {
            for (var a3 = 0; a3 < e2.length; a3++) 0 < a3 && (i2 += m2), i2 += v2(e2[a3], a3);
            0 < t2.length && (i2 += y2);
          }
          for (var o3 = 0; o3 < t2.length; o3++) {
            var u3 = n3 ? e2.length : t2[o3].length, h3 = false, f2 = n3 ? 0 === Object.keys(t2[o3]).length : 0 === t2[o3].length;
            if (r3 && !n3 && (h3 = "greedy" === r3 ? "" === t2[o3].join("").trim() : 1 === t2[o3].length && 0 === t2[o3][0].length), "greedy" === r3 && n3) {
              for (var d2 = [], l2 = 0; l2 < u3; l2++) {
                var c2 = s3 ? e2[l2] : l2;
                d2.push(t2[o3][c2]);
              }
              h3 = "" === d2.join("").trim();
            }
            if (!h3) {
              for (var p2 = 0; p2 < u3; p2++) {
                0 < p2 && !f2 && (i2 += m2);
                var g2 = n3 && s3 ? e2[p2] : p2;
                i2 += v2(t2[o3][g2], p2);
              }
              o3 < t2.length - 1 && (!r3 || 0 < u3 && !f2) && (i2 += y2);
            }
          }
          return i2;
        }
        function v2(e2, t2) {
          if (null == e2) return "";
          if (e2.constructor === Date) return JSON.stringify(e2).slice(1, 25);
          var r3 = false;
          o2 && "string" == typeof e2 && o2.test(e2) && (e2 = "'" + e2, r3 = true);
          var i2 = e2.toString().replace(u2, a2);
          return (r3 = r3 || true === n2 || "function" == typeof n2 && n2(e2, t2) || Array.isArray(n2) && n2[t2] || function(e3, t3) {
            for (var r4 = 0; r4 < t3.length; r4++) if (-1 < e3.indexOf(t3[r4])) return true;
            return false;
          }(i2, b.BAD_DELIMITERS) || -1 < i2.indexOf(m2) || " " === i2.charAt(0) || " " === i2.charAt(i2.length - 1)) ? s2 + i2 + s2 : i2;
        }
      } };
      if (b.RECORD_SEP = String.fromCharCode(30), b.UNIT_SEP = String.fromCharCode(31), b.BYTE_ORDER_MARK = "\uFEFF", b.BAD_DELIMITERS = ["\r", "\n", '"', b.BYTE_ORDER_MARK], b.WORKERS_SUPPORTED = !n && !!f.Worker, b.NODE_STREAM_INPUT = 1, b.LocalChunkSize = 10485760, b.RemoteChunkSize = 5242880, b.DefaultDelimiter = ",", b.Parser = E, b.ParserHandle = r, b.NetworkStreamer = l, b.FileStreamer = c, b.StringStreamer = p, b.ReadableStreamStreamer = g, f.jQuery) {
        var d = f.jQuery;
        d.fn.parse = function(o2) {
          var r2 = o2.config || {}, u2 = [];
          return this.each(function(e2) {
            if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && f.FileReader) || !this.files || 0 === this.files.length) return true;
            for (var t = 0; t < this.files.length; t++) u2.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, r2) });
          }), e(), this;
          function e() {
            if (0 !== u2.length) {
              var e2, t, r3, i, n2 = u2[0];
              if (J(o2.before)) {
                var s2 = o2.before(n2.file, n2.inputElem);
                if ("object" == typeof s2) {
                  if ("abort" === s2.action) return e2 = "AbortError", t = n2.file, r3 = n2.inputElem, i = s2.reason, void (J(o2.error) && o2.error({ name: e2 }, t, r3, i));
                  if ("skip" === s2.action) return void h2();
                  "object" == typeof s2.config && (n2.instanceConfig = d.extend(n2.instanceConfig, s2.config));
                } else if ("skip" === s2) return void h2();
              }
              var a2 = n2.instanceConfig.complete;
              n2.instanceConfig.complete = function(e3) {
                J(a2) && a2(e3, n2.file, n2.inputElem), h2();
              }, b.parse(n2.file, n2.instanceConfig);
            } else J(o2.complete) && o2.complete();
          }
          function h2() {
            u2.splice(0, 1), e();
          }
        };
      }
      function h(e) {
        this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
          var t = w(e2);
          t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
          this._handle = new r(t), (this._handle.streamer = this)._config = t;
        }.call(this, e), this.parseChunk = function(e2, t) {
          if (this.isFirstChunk && J(this._config.beforeFirstChunk)) {
            var r2 = this._config.beforeFirstChunk(e2);
            void 0 !== r2 && (e2 = r2);
          }
          this.isFirstChunk = false, this._halted = false;
          var i = this._partialLine + e2;
          this._partialLine = "";
          var n2 = this._handle.parse(i, this._baseIndex, !this._finished);
          if (!this._handle.paused() && !this._handle.aborted()) {
            var s2 = n2.meta.cursor;
            this._finished || (this._partialLine = i.substring(s2 - this._baseIndex), this._baseIndex = s2), n2 && n2.data && (this._rowCount += n2.data.length);
            var a2 = this._finished || this._config.preview && this._rowCount >= this._config.preview;
            if (o) f.postMessage({ results: n2, workerId: b.WORKER_ID, finished: a2 });
            else if (J(this._config.chunk) && !t) {
              if (this._config.chunk(n2, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = true);
              n2 = void 0, this._completeResults = void 0;
            }
            return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(n2.data), this._completeResults.errors = this._completeResults.errors.concat(n2.errors), this._completeResults.meta = n2.meta), this._completed || !a2 || !J(this._config.complete) || n2 && n2.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), a2 || n2 && n2.meta.paused || this._nextChunk(), n2;
          }
          this._halted = true;
        }, this._sendError = function(e2) {
          J(this._config.error) ? this._config.error(e2) : o && this._config.error && f.postMessage({ workerId: b.WORKER_ID, error: e2, finished: false });
        };
      }
      function l(e) {
        var i;
        (e = e || {}).chunkSize || (e.chunkSize = b.RemoteChunkSize), h.call(this, e), this._nextChunk = n ? function() {
          this._readChunk(), this._chunkLoaded();
        } : function() {
          this._readChunk();
        }, this.stream = function(e2) {
          this._input = e2, this._nextChunk();
        }, this._readChunk = function() {
          if (this._finished) this._chunkLoaded();
          else {
            if (i = new XMLHttpRequest(), this._config.withCredentials && (i.withCredentials = this._config.withCredentials), n || (i.onload = v(this._chunkLoaded, this), i.onerror = v(this._chunkError, this)), i.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !n), this._config.downloadRequestHeaders) {
              var e2 = this._config.downloadRequestHeaders;
              for (var t in e2) i.setRequestHeader(t, e2[t]);
            }
            if (this._config.chunkSize) {
              var r2 = this._start + this._config.chunkSize - 1;
              i.setRequestHeader("Range", "bytes=" + this._start + "-" + r2);
            }
            try {
              i.send(this._config.downloadRequestBody);
            } catch (e3) {
              this._chunkError(e3.message);
            }
            n && 0 === i.status && this._chunkError();
          }
        }, this._chunkLoaded = function() {
          4 === i.readyState && (i.status < 200 || 400 <= i.status ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : i.responseText.length, this._finished = !this._config.chunkSize || this._start >= function(e2) {
            var t = e2.getResponseHeader("Content-Range");
            if (null === t) return -1;
            return parseInt(t.substring(t.lastIndexOf("/") + 1));
          }(i), this.parseChunk(i.responseText)));
        }, this._chunkError = function(e2) {
          var t = i.statusText || e2;
          this._sendError(new Error(t));
        };
      }
      function c(e) {
        var i, n2;
        (e = e || {}).chunkSize || (e.chunkSize = b.LocalChunkSize), h.call(this, e);
        var s2 = "undefined" != typeof FileReader;
        this.stream = function(e2) {
          this._input = e2, n2 = e2.slice || e2.webkitSlice || e2.mozSlice, s2 ? ((i = new FileReader()).onload = v(this._chunkLoaded, this), i.onerror = v(this._chunkError, this)) : i = new FileReaderSync(), this._nextChunk();
        }, this._nextChunk = function() {
          this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
        }, this._readChunk = function() {
          var e2 = this._input;
          if (this._config.chunkSize) {
            var t = Math.min(this._start + this._config.chunkSize, this._input.size);
            e2 = n2.call(e2, this._start, t);
          }
          var r2 = i.readAsText(e2, this._config.encoding);
          s2 || this._chunkLoaded({ target: { result: r2 } });
        }, this._chunkLoaded = function(e2) {
          this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
        }, this._chunkError = function() {
          this._sendError(i.error);
        };
      }
      function p(e) {
        var r2;
        h.call(this, e = e || {}), this.stream = function(e2) {
          return r2 = e2, this._nextChunk();
        }, this._nextChunk = function() {
          if (!this._finished) {
            var e2, t = this._config.chunkSize;
            return t ? (e2 = r2.substring(0, t), r2 = r2.substring(t)) : (e2 = r2, r2 = ""), this._finished = !r2, this.parseChunk(e2);
          }
        };
      }
      function g(e) {
        h.call(this, e = e || {});
        var t = [], r2 = true, i = false;
        this.pause = function() {
          h.prototype.pause.apply(this, arguments), this._input.pause();
        }, this.resume = function() {
          h.prototype.resume.apply(this, arguments), this._input.resume();
        }, this.stream = function(e2) {
          this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
        }, this._checkIsFinished = function() {
          i && 1 === t.length && (this._finished = true);
        }, this._nextChunk = function() {
          this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : r2 = true;
        }, this._streamData = v(function(e2) {
          try {
            t.push("string" == typeof e2 ? e2 : e2.toString(this._config.encoding)), r2 && (r2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
          } catch (e3) {
            this._streamError(e3);
          }
        }, this), this._streamError = v(function(e2) {
          this._streamCleanUp(), this._sendError(e2);
        }, this), this._streamEnd = v(function() {
          this._streamCleanUp(), i = true, this._streamData("");
        }, this), this._streamCleanUp = v(function() {
          this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
        }, this);
      }
      function r(m2) {
        var a2, o2, u2, i = Math.pow(2, 53), n2 = -i, s2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, h2 = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, t = this, r2 = 0, f2 = 0, d2 = false, e = false, l2 = [], c2 = { data: [], errors: [], meta: {} };
        if (J(m2.step)) {
          var p2 = m2.step;
          m2.step = function(e2) {
            if (c2 = e2, _2()) g2();
            else {
              if (g2(), 0 === c2.data.length) return;
              r2 += e2.data.length, m2.preview && r2 > m2.preview ? o2.abort() : (c2.data = c2.data[0], p2(c2, t));
            }
          };
        }
        function y2(e2) {
          return "greedy" === m2.skipEmptyLines ? "" === e2.join("").trim() : 1 === e2.length && 0 === e2[0].length;
        }
        function g2() {
          return c2 && u2 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + b.DefaultDelimiter + "'"), u2 = false), m2.skipEmptyLines && (c2.data = c2.data.filter(function(e2) {
            return !y2(e2);
          })), _2() && function() {
            if (!c2) return;
            function e2(e3, t3) {
              J(m2.transformHeader) && (e3 = m2.transformHeader(e3, t3)), l2.push(e3);
            }
            if (Array.isArray(c2.data[0])) {
              for (var t2 = 0; _2() && t2 < c2.data.length; t2++) c2.data[t2].forEach(e2);
              c2.data.splice(0, 1);
            } else c2.data.forEach(e2);
          }(), function() {
            if (!c2 || !m2.header && !m2.dynamicTyping && !m2.transform) return c2;
            function e2(e3, t3) {
              var r3, i2 = m2.header ? {} : [];
              for (r3 = 0; r3 < e3.length; r3++) {
                var n3 = r3, s3 = e3[r3];
                m2.header && (n3 = r3 >= l2.length ? "__parsed_extra" : l2[r3]), m2.transform && (s3 = m2.transform(s3, n3)), s3 = v2(n3, s3), "__parsed_extra" === n3 ? (i2[n3] = i2[n3] || [], i2[n3].push(s3)) : i2[n3] = s3;
              }
              return m2.header && (r3 > l2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + l2.length + " fields but parsed " + r3, f2 + t3) : r3 < l2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + l2.length + " fields but parsed " + r3, f2 + t3)), i2;
            }
            var t2 = 1;
            !c2.data.length || Array.isArray(c2.data[0]) ? (c2.data = c2.data.map(e2), t2 = c2.data.length) : c2.data = e2(c2.data, 0);
            m2.header && c2.meta && (c2.meta.fields = l2);
            return f2 += t2, c2;
          }();
        }
        function _2() {
          return m2.header && 0 === l2.length;
        }
        function v2(e2, t2) {
          return r3 = e2, m2.dynamicTypingFunction && void 0 === m2.dynamicTyping[r3] && (m2.dynamicTyping[r3] = m2.dynamicTypingFunction(r3)), true === (m2.dynamicTyping[r3] || m2.dynamicTyping) ? "true" === t2 || "TRUE" === t2 || "false" !== t2 && "FALSE" !== t2 && (function(e3) {
            if (s2.test(e3)) {
              var t3 = parseFloat(e3);
              if (n2 < t3 && t3 < i) return true;
            }
            return false;
          }(t2) ? parseFloat(t2) : h2.test(t2) ? new Date(t2) : "" === t2 ? null : t2) : t2;
          var r3;
        }
        function k(e2, t2, r3, i2) {
          var n3 = { type: e2, code: t2, message: r3 };
          void 0 !== i2 && (n3.row = i2), c2.errors.push(n3);
        }
        this.parse = function(e2, t2, r3) {
          var i2 = m2.quoteChar || '"';
          if (m2.newline || (m2.newline = function(e3, t3) {
            e3 = e3.substring(0, 1048576);
            var r4 = new RegExp(Q(t3) + "([^]*?)" + Q(t3), "gm"), i3 = (e3 = e3.replace(r4, "")).split("\r"), n4 = e3.split("\n"), s4 = 1 < n4.length && n4[0].length < i3[0].length;
            if (1 === i3.length || s4) return "\n";
            for (var a3 = 0, o3 = 0; o3 < i3.length; o3++) "\n" === i3[o3][0] && a3++;
            return a3 >= i3.length / 2 ? "\r\n" : "\r";
          }(e2, i2)), u2 = false, m2.delimiter) J(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), c2.meta.delimiter = m2.delimiter);
          else {
            var n3 = function(e3, t3, r4, i3, n4) {
              var s4, a3, o3, u3;
              n4 = n4 || [",", "	", "|", ";", b.RECORD_SEP, b.UNIT_SEP];
              for (var h3 = 0; h3 < n4.length; h3++) {
                var f3 = n4[h3], d3 = 0, l3 = 0, c3 = 0;
                o3 = void 0;
                for (var p3 = new E({ comments: i3, delimiter: f3, newline: t3, preview: 10 }).parse(e3), g3 = 0; g3 < p3.data.length; g3++) if (r4 && y2(p3.data[g3])) c3++;
                else {
                  var _3 = p3.data[g3].length;
                  l3 += _3, void 0 !== o3 ? 0 < _3 && (d3 += Math.abs(_3 - o3), o3 = _3) : o3 = _3;
                }
                0 < p3.data.length && (l3 /= p3.data.length - c3), (void 0 === a3 || d3 <= a3) && (void 0 === u3 || u3 < l3) && 1.99 < l3 && (a3 = d3, s4 = f3, u3 = l3);
              }
              return { successful: !!(m2.delimiter = s4), bestDelimiter: s4 };
            }(e2, m2.newline, m2.skipEmptyLines, m2.comments, m2.delimitersToGuess);
            n3.successful ? m2.delimiter = n3.bestDelimiter : (u2 = true, m2.delimiter = b.DefaultDelimiter), c2.meta.delimiter = m2.delimiter;
          }
          var s3 = w(m2);
          return m2.preview && m2.header && s3.preview++, a2 = e2, o2 = new E(s3), c2 = o2.parse(a2, t2, r3), g2(), d2 ? { meta: { paused: true } } : c2 || { meta: { paused: false } };
        }, this.paused = function() {
          return d2;
        }, this.pause = function() {
          d2 = true, o2.abort(), a2 = J(m2.chunk) ? "" : a2.substring(o2.getCharIndex());
        }, this.resume = function() {
          t.streamer._halted ? (d2 = false, t.streamer.parseChunk(a2, true)) : setTimeout(t.resume, 3);
        }, this.aborted = function() {
          return e;
        }, this.abort = function() {
          e = true, o2.abort(), c2.meta.aborted = true, J(m2.complete) && m2.complete(c2), a2 = "";
        };
      }
      function Q(e) {
        return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function E(j) {
        var z, M = (j = j || {}).delimiter, P = j.newline, U = j.comments, q = j.step, N = j.preview, B = j.fastMode, K = z = void 0 === j.quoteChar || null === j.quoteChar ? '"' : j.quoteChar;
        if (void 0 !== j.escapeChar && (K = j.escapeChar), ("string" != typeof M || -1 < b.BAD_DELIMITERS.indexOf(M)) && (M = ","), U === M) throw new Error("Comment character same as delimiter");
        true === U ? U = "#" : ("string" != typeof U || -1 < b.BAD_DELIMITERS.indexOf(U)) && (U = false), "\n" !== P && "\r" !== P && "\r\n" !== P && (P = "\n");
        var W = 0, H = false;
        this.parse = function(i, t, r2) {
          if ("string" != typeof i) throw new Error("Input must be a string");
          var n2 = i.length, e = M.length, s2 = P.length, a2 = U.length, o2 = J(q), u2 = [], h2 = [], f2 = [], d2 = W = 0;
          if (!i) return L();
          if (j.header && !t) {
            var l2 = i.split(P)[0].split(M), c2 = [], p2 = {}, g2 = false;
            for (var _2 in l2) {
              var m2 = l2[_2];
              J(j.transformHeader) && (m2 = j.transformHeader(m2, _2));
              var y2 = m2, v2 = p2[m2] || 0;
              for (0 < v2 && (g2 = true, y2 = m2 + "_" + v2), p2[m2] = v2 + 1; c2.includes(y2); ) y2 = y2 + "_" + v2;
              c2.push(y2);
            }
            if (g2) {
              var k = i.split(P);
              k[0] = c2.join(M), i = k.join(P);
            }
          }
          if (B || false !== B && -1 === i.indexOf(z)) {
            for (var b2 = i.split(P), E2 = 0; E2 < b2.length; E2++) {
              if (f2 = b2[E2], W += f2.length, E2 !== b2.length - 1) W += P.length;
              else if (r2) return L();
              if (!U || f2.substring(0, a2) !== U) {
                if (o2) {
                  if (u2 = [], I(f2.split(M)), F(), H) return L();
                } else I(f2.split(M));
                if (N && N <= E2) return u2 = u2.slice(0, N), L(true);
              }
            }
            return L();
          }
          for (var w2 = i.indexOf(M, W), R = i.indexOf(P, W), C = new RegExp(Q(K) + Q(z), "g"), S = i.indexOf(z, W); ; ) if (i[W] !== z) if (U && 0 === f2.length && i.substring(W, W + a2) === U) {
            if (-1 === R) return L();
            W = R + s2, R = i.indexOf(P, W), w2 = i.indexOf(M, W);
          } else if (-1 !== w2 && (w2 < R || -1 === R)) f2.push(i.substring(W, w2)), W = w2 + e, w2 = i.indexOf(M, W);
          else {
            if (-1 === R) break;
            if (f2.push(i.substring(W, R)), D(R + s2), o2 && (F(), H)) return L();
            if (N && u2.length >= N) return L(true);
          }
          else for (S = W, W++; ; ) {
            if (-1 === (S = i.indexOf(z, S + 1))) return r2 || h2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: u2.length, index: W }), T();
            if (S === n2 - 1) return T(i.substring(W, S).replace(C, z));
            if (z !== K || i[S + 1] !== K) {
              if (z === K || 0 === S || i[S - 1] !== K) {
                -1 !== w2 && w2 < S + 1 && (w2 = i.indexOf(M, S + 1)), -1 !== R && R < S + 1 && (R = i.indexOf(P, S + 1));
                var O = A(-1 === R ? w2 : Math.min(w2, R));
                if (i.substr(S + 1 + O, e) === M) {
                  f2.push(i.substring(W, S).replace(C, z)), i[W = S + 1 + O + e] !== z && (S = i.indexOf(z, W)), w2 = i.indexOf(M, W), R = i.indexOf(P, W);
                  break;
                }
                var x = A(R);
                if (i.substring(S + 1 + x, S + 1 + x + s2) === P) {
                  if (f2.push(i.substring(W, S).replace(C, z)), D(S + 1 + x + s2), w2 = i.indexOf(M, W), S = i.indexOf(z, W), o2 && (F(), H)) return L();
                  if (N && u2.length >= N) return L(true);
                  break;
                }
                h2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: u2.length, index: W }), S++;
              }
            } else S++;
          }
          return T();
          function I(e2) {
            u2.push(e2), d2 = W;
          }
          function A(e2) {
            var t2 = 0;
            if (-1 !== e2) {
              var r3 = i.substring(S + 1, e2);
              r3 && "" === r3.trim() && (t2 = r3.length);
            }
            return t2;
          }
          function T(e2) {
            return r2 || (void 0 === e2 && (e2 = i.substring(W)), f2.push(e2), W = n2, I(f2), o2 && F()), L();
          }
          function D(e2) {
            W = e2, I(f2), f2 = [], R = i.indexOf(P, W);
          }
          function L(e2) {
            return { data: u2, errors: h2, meta: { delimiter: M, linebreak: P, aborted: H, truncated: !!e2, cursor: d2 + (t || 0) } };
          }
          function F() {
            q(L()), u2 = [], h2 = [];
          }
        }, this.abort = function() {
          H = true;
        }, this.getCharIndex = function() {
          return W;
        };
      }
      function _(e) {
        var t = e.data, r2 = a[t.workerId], i = false;
        if (t.error) r2.userError(t.error, t.file);
        else if (t.results && t.results.data) {
          var n2 = { abort: function() {
            i = true, m(t.workerId, { data: [], errors: [], meta: { aborted: true } });
          }, pause: y, resume: y };
          if (J(r2.userStep)) {
            for (var s2 = 0; s2 < t.results.data.length && (r2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !i); s2++) ;
            delete t.results;
          } else J(r2.userChunk) && (r2.userChunk(t.results, n2, t.file), delete t.results);
        }
        t.finished && !i && m(t.workerId, t.results);
      }
      function m(e, t) {
        var r2 = a[e];
        J(r2.userComplete) && r2.userComplete(t), r2.terminate(), delete a[e];
      }
      function y() {
        throw new Error("Not implemented.");
      }
      function w(e) {
        if ("object" != typeof e || null === e) return e;
        var t = Array.isArray(e) ? [] : {};
        for (var r2 in e) t[r2] = w(e[r2]);
        return t;
      }
      function v(e, t) {
        return function() {
          e.apply(t, arguments);
        };
      }
      function J(e) {
        return "function" == typeof e;
      }
      return o && (f.onmessage = function(e) {
        var t = e.data;
        void 0 === b.WORKER_ID && t && (b.WORKER_ID = t.workerId);
        if ("string" == typeof t.input) f.postMessage({ workerId: b.WORKER_ID, results: b.parse(t.input, t.config), finished: true });
        else if (f.File && t.input instanceof File || t.input instanceof Object) {
          var r2 = b.parse(t.input, t.config);
          r2 && f.postMessage({ workerId: b.WORKER_ID, results: r2, finished: true });
        }
      }), (l.prototype = Object.create(h.prototype)).constructor = l, (c.prototype = Object.create(h.prototype)).constructor = c, (p.prototype = Object.create(p.prototype)).constructor = p, (g.prototype = Object.create(h.prototype)).constructor = g, b;
    });
  }
});

// node_modules/bimsc-knack-api/knack-api/knack-api-payloads.js
function createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    recordId: record_id,
    body: recordData
  };
  return payload;
}
function createApiPayloadPutMany(sceneKey, viewKey, records2, progress) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    records: records2
  };
  return payload;
}
function createApiPayloadPostSingle(sceneKey, viewKey, record) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    body: record
  };
  return payload;
}
function createApiPayloadPostMany(sceneKey, viewKey, records2) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    records: records2
  };
  return payload;
}
function createApiPayloadGetSingle(sceneKey, viewKey, record_id) {
  const payload = {
    scene: sceneKey,
    view: viewKey,
    recordId: record_id
  };
  return payload;
}
function createApiPayloadGetMany(sceneKey, viewKey, filters3, parentRecord, format) {
  if (parentRecord) {
    var url2 = `https://api.knack.com/v1/pages/${sceneKey}/views/${viewKey}/records?${parentRecord.name}_id=${parentRecord.id}`;
    if (filters3) {
      url2 += "&filters=" + encodeURIComponent(JSON.stringify(filters3));
    }
    return url2;
  } else {
    if (!format) {
      format = "both";
    }
    const payload = {
      scene: sceneKey,
      view: viewKey,
      format
    };
    if (filters3) {
      payload.filters = filters3;
    }
    return payload;
  }
}
function createApiPayloadDeleteSingle(sceneKey, viewKey, record) {
  const payload = {
    recordId: record.id,
    scene: sceneKey,
    view: viewKey
    //view_21 is a view with a delete link like a grid or details view
  };
  return payload;
}
var payloads = {
  // get
  getSingle: (sceneKey, viewKey, record_id) => createApiPayloadGetSingle(sceneKey, viewKey, record_id),
  getMany: (sceneKey, viewKey, filters3, parentRecord, format) => createApiPayloadGetMany(sceneKey, viewKey, filters3, parentRecord, format),
  // post
  postSingle: (sceneKey, viewKey, record) => createApiPayloadPostSingle(sceneKey, viewKey, record),
  postMany: (sceneKey, viewKey, records2) => createApiPayloadPostMany(sceneKey, viewKey, records2),
  // delete
  deleteSingle: (sceneKey, viewKey, record) => createApiPayloadDeleteSingle(sceneKey, viewKey, record),
  // put
  putSingle: (sceneKey, viewKey, record_id, recordData) => createApiPayloadPutSingle(sceneKey, viewKey, record_id, recordData),
  putMany: (sceneKey, viewKey, records2, progress) => createApiPayloadPutMany(sceneKey, viewKey, records2, progress)
};

// node_modules/bimsc-knack-api/knack-api/knack-api-filters.js
function createFilters(condition) {
  return {
    "match": condition,
    "rules": []
  };
}
function Commonfilters(field_key) {
  return {
    isDuringTheCurrentMonth: {
      field: field_key,
      operator: "is during the current",
      type: "month"
    },
    isDuringThePreviousMonth: {
      field: field_key,
      operator: "is during the previous",
      range: "1",
      type: "months"
    },
    isDuringTheNextMonth: {
      field: field_key,
      operator: "is during the next",
      range: "1",
      type: "months"
    },
    isBeforeThePreviousMonth: {
      field: field_key,
      operator: "is before the previous",
      range: "1",
      type: "months"
    }
  };
}
var filters2 = {
  create: (condition) => createFilters(condition),
  common: (field_key) => Commonfilters(field_key)
};

// node_modules/bimsc-knack-api/knack-api/knack-api-calls.js
var import_knack_api_helper2 = __toESM(require_knack_api_helper(), 1);

// node_modules/bimsc-knack-api/knack-api/knack-api-init.js
var import_knack_api_helper = __toESM(require_knack_api_helper(), 1);
async function knackApiInit() {
  const runEnv = "browser";
  if (runEnv === "browser") {
    return new import_knack_api_helper.default({
      auth: "view-based",
      applicationId: Knack.application_id,
      userToken: Knack.getUserToken()
    });
  }
  if (runEnv === "server") {
    const userToken2 = await knackLogin();
    return new import_knack_api_helper.default({
      auth: "view-based",
      applicationId: process.env.KNACK_APP_ID,
      userToken: userToken2
    });
  }
}
async function knackLogin() {
  const knackAPI = new import_knack_api_helper.default({
    auth: "view-based",
    applicationId: process.env.KNACK_APP_ID
  });
  try {
    return await knackAPI.login({
      email: process.env.KNACK_API_LOGIN,
      password: process.env.KNACK_API_PASSWORD
    });
  } catch (err) {
    console.log(err);
  }
}

// node_modules/bimsc-knack-api/knack-api/knack-api-calls.js
async function knackApiViewGetSingle(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const response = await knackAPI.get(payload);
    console.log("api call completed");
    const responseJson = response.json;
    return responseJson;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewGetMany(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const resRecords = await knackAPI.getMany(payload);
    console.log("api call completed");
    return resRecords.records;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewGetManyParentRecord(payload) {
  const basePayload = payload;
  var iteration = 1;
  var iterationUrl = `&page=${iteration}&rows_per_page=1000`;
  var currentPayload = basePayload + iterationUrl;
  var headers = {
    "Authorization": Knack.getUserToken(),
    "X-Knack-REST-API-Key": "knack",
    "X-Knack-Application-Id": Knack.application_id,
    "Content-Type": "application/json"
  };
  var response = {};
  var responseJson = await fetchAPIcall(currentPayload, headers);
  response = { ...responseJson };
  if (responseJson.total_records > 1e3) {
    const numIteration = responseJson.total_pages;
    for (var i = 2; i <= numIteration; i++) {
      var iteration = i;
      var iterationUrl = `&page=${iteration}&rows_per_page=1000`;
      var currentPayload = basePayload + iterationUrl;
      responseJson = await fetchAPIcall(currentPayload, headers);
      response.records = [...response.records, ...responseJson.records];
    }
  }
  return response;
}
async function knackApiViewPostMany(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const responses = await knackAPI.postMany(payload);
    if (responses.summary.rejected > 0) {
      responses.summary.errors.forEach((err) => {
        console.log(JSON.stringify(err.reason));
      });
    }
    console.log("api call completed");
    return responses;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewPostSingle(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const response = await knackAPI.post(payload);
    const recordCreated = response.json;
    console.log("api call completed");
    return recordCreated;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewPutSingle(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const response = await knackAPI.put(payload);
    const responseJson = await response.json;
    console.log("api call completed");
    return responseJson;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewPutMany(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const responses = await knackAPI.putMany(payload);
    if (responses.summary.rejected > 0) {
      res.summary.errors.forEach((err) => {
        errorHandler(err.reason);
      });
    }
    console.log("api call completed");
    return responses;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function knackApiViewDeleteSingle(payload) {
  const knackAPI = await knackApiInit();
  console.log("api call started");
  try {
    const response = await knackAPI.delete(payload);
    console.log("api call completed");
    return response;
  } catch (err) {
    console.log("api call failed", err);
    return null;
  }
}
async function fetchAPIcall(payload, headers) {
  console.log("api call started");
  try {
    const response = await fetch(payload, {
      method: "GET",
      headers
    });
    const responseJson = await response.json();
    console.log("api call completed");
    return responseJson;
  } catch (err) {
    console.log("api call failed");
    console.log("err", err);
    return err;
  }
}
var calls = {
  // get
  getSingle: (payload) => knackApiViewGetSingle(payload),
  getMany: (payload) => knackApiViewGetMany(payload),
  getManyParentRecord: (payload) => knackApiViewGetManyParentRecord(payload),
  // post
  postSingle: (payload) => knackApiViewPostSingle(payload),
  postMany: (payload) => knackApiViewPostMany(payload),
  //put
  putMany: (payload) => knackApiViewPutMany(payload),
  putSingle: (payload) => knackApiViewPutSingle(payload),
  // delete
  deleteSingle: (payload) => knackApiViewDeleteSingle(payload)
};

// node_modules/bimsc-knack-api/knack-api/knack-api-utils.js
var utils = {
  isoTo_MMDDYYYY: (isoDate) => isoDatestoKnackDatesMMDDYYYY(isoDate),
  isoTo_DDMMYYYY: (isoDate) => isoDatestoKnackDatesDDMMYYYY(isoDate)
};
function isoDatestoKnackDatesMMDDYYYY(isoDate) {
  isoDate = new Date(isoDate);
  return {
    date: isoDate.toLocaleDateString("en-US"),
    // Convert to "MM/DD/YYYY" format
    // iso_timestamp: item.creationTime,
    hours: (isoDate.getUTCHours() % 12 || 12).toString().padStart(2, "0"),
    minutes: isoDate.getUTCMinutes().toString().padStart(2, "0"),
    am_pm: isoDate.getUTCHours() >= 12 ? "PM" : "AM"
    // unix_timestamp: isoDate.getTime(),
    // timestamp: isoDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  };
}
function isoDatestoKnackDatesDDMMYYYY(isoDate) {
  isoDate = new Date(isoDate);
  return {
    date: isoDate.toLocaleDateString("en-GB"),
    // Convert to "MM/DD/YYYY" format
    // iso_timestamp: item.creationTime,
    hours: (isoDate.getUTCHours() % 12 || 12).toString().padStart(2, "0"),
    minutes: isoDate.getUTCMinutes().toString().padStart(2, "0"),
    am_pm: isoDate.getUTCHours() >= 12 ? "PM" : "AM"
    // unix_timestamp: isoDate.getTime(),
    // timestamp: isoDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  };
}

// node_modules/bimsc-knack-api/index.js
var knackApi = {
  filters: filters2,
  payloads,
  calls,
  utils
};

// node_modules/bimsc-knack-interface/messages/message-functions.js
function removePopup(viewKey) {
  $("#" + viewKey + " .popup-message").remove();
}
function addPopup(viewKey, message, popupType) {
  var divSelector = $("#" + viewKey);
  var popup2 = $("<div>").addClass("popup-message");
  var messageDiv = $("<div>").html(message).css({
    marginBottom: "20px",
    fontSize: "18px",
    color: "#fff"
  });
  var progressBarContainer = $("<div>").addClass("progress-bar-container");
  var progressBar2 = $("<div>").attr("id", "popup-progress-bar-" + viewKey).addClass("popup-progress-bar");
  var progressText = $("<div>").attr("id", "progress-text-" + viewKey).addClass("progress-text").text("0%");
  progressBarContainer.append(progressBar2);
  progressBarContainer.append(progressText);
  popup2.append(messageDiv);
  if (popupType === "progress") {
    popup2.append(progressBarContainer);
    console.log("progress popup");
  }
  var spinnerContainer = $("<div>").addClass("spinner-container");
  var spinner = $("<i>").addClass("fa fa-spinner fa-spin spinner").attr("id", "popup-spinner-" + viewKey);
  spinnerContainer.append(spinner);
  if (popupType === "spinner") {
    popup2.append(spinnerContainer);
    console.log("spinner popup");
  }
  console.log(popup2.html());
  divSelector.css("position", "relative").append(popup2);
}
function updatePopupProgress(viewKey, progress) {
  $("#popup-progress-bar-" + viewKey).css("width", progress + "%");
  $("#progress-text-" + viewKey).text(Math.round(progress) + "%");
}
var popup = {
  add: (viewKey, message, popupType) => addPopup(viewKey, message, popupType),
  remove: (viewKey) => removePopup(viewKey),
  update: (viewKey, progress) => updatePopupProgress(viewKey, progress)
};

// node_modules/bimsc-knack-interface/messages/message.js
var msg = {
  popup
};

// node_modules/bimsc-knack-interface/views/tables/tables-functions.js
function addCheckboxes(view2) {
  $("#" + view2.key + " .kn-table thead tr").prepend('<th><input type="checkbox"></th>');
  $("#" + view2.key + " .kn-table tbody tr").each(function() {
    if (!$(this).hasClass("kn-table-group")) {
      $(this).prepend('<td><input type="checkbox"></td>');
    } else {
      $(this).prepend("<td></td>");
    }
  });
}
function handleHeaderCheckboxChange(view2, selectionRules) {
  selectionRules = selectionRules || (() => true);
  $("#" + view2.key + ' .kn-table thead input[type="checkbox"]').change(function() {
    var isChecked = $(this).prop("checked");
    $("#" + view2.key + ' .kn-table tbody tr:not(.kn-table-group) input[type="checkbox"]').each(function() {
      var selectBasedOnRules = selectionRules();
      $(this).prop("checked", isChecked && selectBasedOnRules);
    });
  });
}
function getTableCheckedRecords(view2) {
  const checkedRecords = [];
  $("#" + view2.key + ' .kn-table tbody tr:not(.kn-table-group) input[type="checkbox"]').each(function() {
    var isChecked = $(this).prop("checked");
    if (isChecked) {
      var id = $(this).closest("tr").attr("id");
      checkedRecords.push({ id });
    }
  });
  return checkedRecords;
}
function addFilterToTableView(view2, newFilters) {
  const filters3 = Knack.views[view2.key].getFilters();
  let combinedFilters;
  if (filters3.match) {
    filters3.rules.push(newFilters);
    combinedFilters = JSON.parse(JSON.stringify(filters3));
  } else if (filters3.length) {
    filters3.push(newFilters);
    combinedFilters = {
      match: "and",
      rules: JSON.parse(JSON.stringify(filters3))
    };
  } else {
    combinedFilters = [newFilters];
  }
  Knack.views[view2.key].handleChangeFilters(JSON.stringify(combinedFilters));
}
function setFilterToTableView(view2, newFilters) {
  Knack.views[view2.key].handleChangeFilters(JSON.stringify(newFilters));
}
function reRenderTableOrCalendar(view2) {
  var originalFilters = JSON.stringify(Knack.views[view2.key].getFilters());
  Knack.views[view2.key].handleChangeFilters(originalFilters);
}

// node_modules/bimsc-knack-interface/views/tables/tables.js
var tables = {
  addCheckboxes: (view2) => addCheckboxes(view2),
  addHeadEventHandler: (view2, rules) => handleHeaderCheckboxChange(view2, rules),
  getChechedRecords: (view2) => getTableCheckedRecords(view2),
  addFilters: (view2, filters3) => addFilterToTableView(view2, filters3),
  setFilters: (view2, filters3) => setFilterToTableView(view2, filters3),
  reRender: (view2) => reRenderTableOrCalendar(view2)
};

// node_modules/bimsc-knack-interface/index.js
var knackInterface = {
  msg,
  views: {
    tables
  }
};

// node_modules/bimsc-js-utils/js-utils/files/files.js
var import_papaparse = __toESM(require_papaparse_min(), 1);
function parseCSV(csvText, convertNumber) {
  const parsedData = import_papaparse.default.parse(csvText, {
    header: true,
    // Treat the first row as headers
    skipEmptyLines: true,
    // Skip any empty rows
    dynamicTyping: convertNumber
    // Automatically convert numeric values
  });
  return parsedData.data;
}
async function fetchCSV(url2) {
  try {
    const response = await fetch(url2);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    return csvText.trim();
  } catch (error) {
    console.error("Error fetching the CSV file:", error);
  }
}
function cleanCSV(csvObj) {
  const cleanedData = csvObj.map((entry) => {
    const cleanedEntry = {};
    for (let [key, value] of Object.entries(entry)) {
      try {
        const cleanKey = key.replace(/\r/g, "").trim();
        const cleanValue = value.replace(/\r/g, "").trim();
        cleanedEntry[cleanKey] = cleanValue;
      } catch (err) {
        cleanedEntry[key] = value;
      }
    }
    return cleanedEntry;
  });
  return cleanedData;
}
function jsonToHtml(json) {
  const jsonObject = JSON.parse(json);
  return `<pre>${JSON.stringify(jsonObject, null, 2)}</pre>`;
}
var files = {
  parseCSV: (csvContent, convertNumbers) => parseCSV(csvContent, convertNumbers),
  fetchCSV: (url2) => fetchCSV(url2),
  cleanCSV: (csvObj) => cleanCSV(csvObj),
  jsonToHtml: (jsonContent) => jsonToHtml(jsonContent)
};

// node_modules/bimsc-js-utils/js-utils/times/time.js
function isoDateToDDMMYYYYHHMMampm(dateISOStr) {
  const date = new Date(dateISOStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  return {
    date: formattedDate,
    time: formattedTime,
    string: formattedDate + " " + formattedTime
  };
}
function isoGetPreviousDay1159pm(dateISOStr) {
  const date = new Date(dateISOStr);
  date.setDate(date.getDate() - 1);
  date.setHours(23, 59, 0, 0);
  return date.toISOString();
}
var times = {
  convert: {
    isoDateToDDMMYYYYHHMMampm: (dateISOStr) => isoDateToDDMMYYYYHHMMampm(dateISOStr)
  },
  operations: {
    ISO: {
      getPreviousDay1159pm: (dateISOStr) => isoGetPreviousDay1159pm(dateISOStr)
    }
  }
};

// node_modules/bimsc-js-utils/index.js
var bimscJs = {
  files,
  times
};

// bimsc-accounting/functions/send-local-request.js
async function triggerServerPOST(url2, data) {
  try {
    const res2 = await fetch(url2, {
      method: "POST",
      // Specify the method
      headers: {
        "Content-Type": "application/json"
        // Set the content type to JSON
      },
      body: JSON.stringify(data)
      // Convert data to JSON string
    });
    const response = await res2.text();
    console.log("Success:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}
async function triggerServerGET(url2) {
  try {
    const response = await $.ajax({
      url: url2,
      method: "GET"
    });
    console.log("Success:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}
var sendToLocalHost = {
  GET: (url2) => triggerServerGET(url2),
  POST: (url2, data) => triggerServerPOST(url2, data)
};

// bimsc-accounting/renders/add-transaction-render.js
$(document).on("knack-form-submit.view_44", async function(event, view2, record) {
  event.preventDefault();
  const url2 = "http://localhost:3000/api/accounting/add-wise-transactions";
  const data = { test: "test" };
  const res2 = await sendToLocalHost.POST(url2, data);
  console.log(res2);
});
$(document).on("knack-form-submit.view_42", async function(event, view2, record) {
  const url2 = "http://localhost:3000/api/accounting/add-westpac-transactions";
  const data = { test: "test" };
  const res2 = await sendToLocalHost.POST(url2, data);
  console.log(res2);
});

// bimsc-accounting/renders/check-duplicates.js
var view_45RenderCount = -1;
$(document).on("knack-view-render.view_45", async function(event, view2, data) {
  view_45RenderCount += 1;
  if (view_45RenderCount % 2 === 0) {
    knackInterface.msg.popup.add(view2.key, "loading in progress", "spinner");
    const payload = knackApi.payloads.getMany("scene_26", "view_45");
    const records2 = await knackApi.calls.getMany(payload);
    console.log("records", records2);
    const dupRecords = checkForDuplicates(records2);
    console.log("dupRecords", dupRecords);
    const filters3 = knackApi.filters.create("OR");
    for (var dup of dupRecords) {
      const rule = { field: "field_177", operator: "is", value: dup.field_177_raw };
      filters3.rules.push(rule);
    }
    console.log("filters", filters3);
    knackInterface.views.tables.setFilters(view2, filters3);
    knackInterface.msg.popup.remove(view2.key);
  }
  knackInterface.views.tables.addCheckboxes(view2);
  knackInterface.views.tables.addHeadEventHandler(view2);
  $("#view_45_filters").remove();
});
function checkForDuplicates(records2) {
  const fieldCounts = records2.reduce((acc, rec) => {
    const fieldValue = rec.field_177_raw;
    acc[fieldValue] = (acc[fieldValue] || 0) + 1;
    return acc;
  }, {});
  const duplicateRecords = records2.filter((rec) => fieldCounts[rec.field_177_raw] >= 2);
  return duplicateRecords;
}

// bimsc-accounting/renders/update-transaction-types.js
import { knackApi as knackApi2 } from "https://damoosnz.github.io/bimsc-knack-api/dist/bundle.js";
$(document).on("knack-view-render.view_55", async function(event, view2, data) {
  const payload_1 = knackApi2.payloads.getMany("scene_31", "view_53");
  const tr_types = await knackApi2.calls.getMany(payload_1);
  console.log("tr_types", tr_types);
  const payload_2 = knackApi2.payloads.getMany("scene_31", "view_52");
  const unPro_trs = await knackApi2.calls.getMany(payload_2);
  console.log("unPro_trs", unPro_trs);
  const new_tr_types = listUniqueTrTypes(unPro_trs);
  console.log("new_tr_types", new_tr_types);
  if (new_tr_types.length > 0) {
    const payload_3 = knackApi2.payloads.postMany("scene_31", "view_54", new_tr_types);
    const added_tr_types = await knackApi2.calls.postMany(payload_3);
  }
});
function listUniqueTrTypes(records2) {
  const uniqueTrTypes = records2.reduce((acc, rec) => {
    const type = rec.field_176_raw;
    const bank = rec.field_229_raw[0]?.id;
    if (!acc.some((item) => item.field_231 + item.field_232 === type + bank)) {
      acc.push({ field_231: type, field_232: rec.field_229_raw[0]?.id });
    }
    return acc;
  }, []);
  return uniqueTrTypes;
}

// bimsc-accounting/renders/view-transaction-details.js
$(document).on("knack-view-render.view_45", function(event, view2, records2) {
  displayReadableJson(view2, "field_228");
});
$(document).on("knack-view-render.view_46", function(event, view2, records2) {
  displayReadableJson(view2, "field_158");
});
function displayReadableJson(view2, field) {
  $(`#${view2.key} td[data-field-key=${field}]`).each(function() {
    const jsonString = $(this).find("span").text();
    const prettyJson = bimscJs.files.jsonToHtml(jsonString);
    $(this).html(prettyJson);
  });
}

// bimsc-accounting/renders/populate-transations-info.js
import { knackApi as knackApi3 } from "https://damoosnz.github.io/bimsc-knack-api/dist/bundle.js";
$(document).on("knack-view-render.view_38", async function(event, view2, data) {
  const payload_1 = knackApi3.payloads.getMany("scene_30", "view_50");
  const unPro_trs = await knackApi3.calls.getMany(payload_1);
  console.log("unPro_trs", unPro_trs);
  const payload_2 = knackApi3.payloads.getMany("scene_31", "view_53");
  const tr_types = await knackApi3.calls.getMany(payload_2);
  console.log("tr_types", tr_types);
  if (unPro_trs.length > 0) {
  }
});
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.4.1
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/
//# sourceMappingURL=bundle.dev.js.map
