// Element Tie

define(
  "nrtv-element-tie",
  ["nrtv-component", "nrtv-element"],
  function(component, element) {

    function ElementTie() {
      this.el = element.apply(null, arguments)

      this.id = this.el.assignId()
    }

    ElementTie.prototype.html =
      function() {
        return this.el.html()
      }

    function showElement(id) {
      var el = $("#"+id)
      el.removeClass("hidden")
    }

    ElementTie.prototype.showOnClient =
      function(bridge) {
        var show = bridge
        .defineOnClient(showElement)

        return show(this.el.id).evalResponse()
      }
    
    component.addTypeOfTie(
      "element", ElementTie
    )
  }
)