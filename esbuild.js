const esbuild = require('esbuild');

// Function to build the project for production
async function build() {
  const buildOptions = {
    entryPoints: ['index.js'], // Entry point to your project
    bundle: true, // Bundle the whole project
    outfile: 'src/dist/bundle.js', // Production output filename
    format: 'esm', // Output as an ES module
    platform: 'browser', // Bundle for browser usage
    target: ['es2020'], // Specify the target environment
    define: {
      'process.env.KNACK_API_RUNENV': '"browser"', // Set your environment
      'process.env.NODE_ENV': '"production"', // Set NODE_ENV to production
    },
    globalName: 'knackApi', // Expose the knackApi object globally if needed
    sourcemap: false, // No sourcemaps for production
    minify: true, // Minify for production
  };

  try {
    // Build the project
    await esbuild.build(buildOptions);
    console.log('Production build completed. Output: dist/bundle.js');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Function to serve the project in development mode
async function serve() {

  const contextOptions = {
    entryPoints: ['index.js'],
    bundle: true,
    outfile: 'src/dist/bundle-dev.js',
    format: 'esm',
    sourcemap: true,
    minify: false,
    define: {
      'process.env.KNACK_API_RUNENV': '"browser"', // Set your environment
      'process.env.NODE_ENV': '"development"', // Set NODE_ENV to production
    },
  }

  const serverOptions = {
    servedir: 'src/dist', // Directory to serve files from
    port: 8888, // Port number
    onRequest: (args) => {
      args.res.setHeader('Access-Control-Allow-Origin', '*')
    },
    host: 'localhost',  // Explicitly specify host
  }

  try {
    const context = await esbuild.context(contextOptions);
    const server = await context.serve(serverOptions);
    console.log(`Development server is running at http://localhost:${serverOptions.port}`);
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
}

// Main function to execute build and serve based on the environment
async function main() {
  if (process.env.NODE_ENV === 'development') {
    await serve(); // Start the server in development mode
  } else {
    await build(); // Build the project for production
  }
}

// Run the main function
main();
