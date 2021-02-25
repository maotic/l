module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("nf3");
  eleventyConfig.addPassthroughCopy("puzzles");
  
  return {
    passthroughFileCopy: true
  };
};