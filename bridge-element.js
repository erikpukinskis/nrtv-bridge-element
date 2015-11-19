var library = require("nrtv-library")(require)

module.exports = library.export(
  "nrtv-bridge-element",
  ["nrtv-element", "nrtv-browser-bridge"],
  function(element, bridge) {

    function BridgeElement() {
      this.el = element.apply(null, arguments)

      this.el.assignId()
      this.show.id = this.el.id
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

    BridgeElement.prototype.show = {

      id: undefined,

      defineOnClient: function() {
        if (!this.showBinding) {
          this.showBinding = bridge.defineFunction(showElement).withArgs(this.id)
        }

        return this.showBinding
      }

    }

    return BridgeElement
  }
)
