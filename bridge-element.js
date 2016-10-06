var library = require("nrtv-library")(require)

module.exports = library.export(
  "nrtv-bridge-element",
  ["web-element", "browser-bridge"],
  function(element, bridge) {

    function BridgeElement() {
      this.el = element.apply(null, arguments)
      this.el.assignId()
    }

    BridgeElement.prototype.element =
      function() {
        return this.el
      }

    BridgeElement.prototype.render =
      function() {
        return this.el.render()
      }

    function showElement(id) {
      var el = document.getElementById(id)
      el.className = el.className.replace(/\bhidden\b/, " ")
    }

    // Should this be bridgeElement.show.bindOnClient() to make it more obvious what's happening?

    BridgeElement.prototype.defineShowInBrowser = function() {
        return bridge.defineFunction(showElement).withArgs(this.el.id)
      }

    return BridgeElement
  }
)
