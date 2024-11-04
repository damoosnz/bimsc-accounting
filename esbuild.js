const esbuild = require('esbuild');

// Determine environment based on process arguments or environment variables
const isDevelopment = process.env.NODE_ENV === 'development';

esbuild.build({
  entryPoints: ['index.js'], // Entry point to your project
  bundle: true, // Bundle the whole project
  outfile: isDevelopment ? 'src/dist/bundle.dev.js' : 'src/dist/bundle.js', // Different bundle filenames for dev and prod
  format: 'esm', // Output as an ES module
  platform: 'browser', // Bundle for browser usage
  define: {
    'process.env.KNACK_API_RUNENV': '"browser"', // Set your environment
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'), // Set NODE_ENV
  },
  // globalName: 'knackApi', // Expose the knackApi object globally if needed
  target: ['es2020'], // Specify the target environment
  sourcemap: isDevelopment, // Only generate sourcemaps in development
  minify: !isDevelopment, // Minify only in production
  // watch: isDevelopment, // Enable watch mode in development
}).catch(() => process.exit(1));