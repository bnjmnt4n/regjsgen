// Simple AST node equivalence checker.
function astNodesAreEquivalent(a, b) {
  var aType = typeof a;
  var bType = typeof b;
  if (aType !== bType) {
    return false;
  }

  switch (aType) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      // Simple comparison.
      return a === b;

    case "object":
      var aTag = Object.prototype.toString.call(a);
      var bTag = Object.prototype.toString.call(b);

      if (aTag != bTag) {
        return false;
      }

      if (aTag == "[object Array]") {
        if (a.length !== b.length) {
          return false;
        }

        for (var i = 0, length = a.length; i < length; i++) {
          if (i in a !== i in b) {
            return false;
          }

          if (!astNodesAreEquivalent(a[i], b[i])) {
            return false;
          }
        }

        return true;
      }

      if (aTag != "[object Object]") {
        return false;
      }

      // Fast path for a common property of AST nodes.
      if (a.type != b.type) {
        return false;
      }

      // Avoid comparing regular expression literals.
      var aNames = Object.keys(a).filter(function(name) { return name != "range" && name != "raw"; });
      var bNames = Object.keys(b).filter(function(name) { return name != "range" && name != "raw"; });
      var aNameCount = aNames.length;

      if(a.type == "quantifier" && b.type == "quantifier" && a.symbol == null && b.symbol == "+"){
        b.symbol = undefined;
      }

      if (aNameCount == bNames.length) {
        for (var i = 0; i < aNameCount; ++i) {
          var name = aNames[i];

          if (!astNodesAreEquivalent(a[name], b[name])) {
            return false;
          }
        }

        return true;
      }

    default:
      return false;
  }
}

module.exports = astNodesAreEquivalent;
