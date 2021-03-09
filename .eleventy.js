module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("nf3");
  eleventyConfig.addPassthroughCopy("puzzles");
  eleventyConfig.addPassthroughCopy("chessground-assets");
  eleventyConfig.addPassthroughCopy("random");
  eleventyConfig.addPassthroughCopy("tmep");
  
  return {
    passthroughFileCopy: true
  };
};