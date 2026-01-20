// Load environment variables first (before any data modules run)
require('dotenv').config();

const bundlerPlugin = require('@11ty/eleventy-plugin-bundle');
const sass = require('sass');
const path = require('path');
const fs = require('fs');

module.exports = function(eleventyConfig) {
  // Add bundle plugin for CSS/JS
  eleventyConfig.addPlugin(bundlerPlugin);

  // SCSS compilation
  eleventyConfig.addTemplateFormats('scss');
  eleventyConfig.addExtension('scss', {
    outputFileExtension: 'css',
    compile: async function(inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      
      // Skip partials (files starting with _)
      if (parsed.name.startsWith('_')) {
        return;
      }

      // Remove front matter if present (Eleventy will have already processed it)
      // The inputContent here is after front matter removal
      let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || '.', 'src/assets/scss']
      });

      return async () => {
        return result.css;
      };
    }
  });

  // Copy static assets
  eleventyConfig.addPassthroughCopy('src/assets/js');
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/logo.jpg');

  // Filters
  eleventyConfig.addFilter('formatDate', function(date) {
    if (!date) return '';
    // Parse YYYY-MM-DD as local date to avoid timezone issues
    const parts = date.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  });

  eleventyConfig.addFilter('formatPrice', function(price) {
    if (!price) return '';
    const num = parseFloat(price);
    return isNaN(num) ? price : `$${num.toFixed(2)}`;
  });

  eleventyConfig.addFilter('unique', function(array) {
    return [...new Set(array)];
  });

  eleventyConfig.addFilter('map', function(array, attribute) {
    return array.map(item => item[attribute]);
  });

  // Event image path filter - converts filename to full path
  eleventyConfig.addFilter('eventImage', function(filename) {
    if (!filename) return '';
    // If it's already a full URL (http:// or https://), return as-is
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    // Otherwise, prepend the local events images path
    return `/assets/images/events/${filename}`;
  });

  // Shortcodes
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
      layouts: '_includes/layouts'
    },
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
