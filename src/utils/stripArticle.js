export const stripArticle = (title) => {
    return title
      .trim()
      .toLowerCase()
      .replace(/^(el|la|los|las|un|una|unos|unas|the|a|an)\s+/i, "");
  };
  