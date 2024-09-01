module.exports = function(source) {
    return source
        .replace(/\/\*\* -- teamix debugger start -- \*\*\/[\s\S]+?\/\*\* -- teamix debugger end -- \*\*\//g, "")
};
