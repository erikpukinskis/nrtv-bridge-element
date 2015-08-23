var library = require("nrtv-library")(require)

module.exports = library.export(
  "nrtv-bridge-element",
  ["nrtv-element", "nrtv-browser-bridge"],
  function(element, BrowserBridge) {

    function BridgeElement() {
      this.el = element.apply(null, arguments)

      this.id = this.el.assignId()
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
      var el = $("#"+id)
      el.removeClass("hidden")
    }

    BridgeElement.prototype.showOnClient =
      function() {
        var show = BrowserBridge
        .defineOnClient(showElement)

        return show.withArgs(this.el.id).ajaxResponse()
      }

    return BridgeElement
  }
)
