# Important!

The code in the public folder is
* Publically accessible by anyone who has the URL
* Is designed to be imported into HTML and run client-side (eg a Knack app)

Therefore, DO NOT include any sensitive information like API keys.

It does NOT provide any extra security than running code directly in HTML (or directly in your Knack JS area).

Code written here:
* DOES have access to the window object, browser APIs etc, when run imported into a HTML file (or Knack app)
* Does _NOT_ have access to environemnt variables

If you need to run server-side code, create a netlify function in the functions folder instead.
