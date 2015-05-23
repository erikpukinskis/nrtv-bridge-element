requirejs = require("requirejs")

requirejs(
  ["chai", "nrtv-component", "element-tie"],
  function(chai, component) {
    var expect = chai.expect
    var Widget = component()

    var el = Widget.element("hi")

    expect(el.html()).to.match(/div/)
  }
)