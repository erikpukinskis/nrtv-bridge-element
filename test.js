var library = require("nrtv-library")(require)

// We'll need an sms module to exist, but we're not going to actually use it, so let's just make an empty one.

library.define("sms", function() {
  return {
    send: function() {
      throw new Error("We don't actually want to be here!")
    }
  }
})


library.define (
  "text-important-people",

  ["sms", "./bridge-element", "nrtv-bridge-route", "nrtv-element", "nrtv-server"],
  function(sms, BridgeElement, BridgeRoute, element, Server) {

    function Texter() {

      var successMessage = new BridgeElement(".success.hidden", "Success! You da real MVP.")

      var showSuccess = successMessage.showOnClient()

      var textSomeone = new BridgeRoute(
        "post",
        "/text",
        function(x, response) {
          sms.send(
            "812-320-1877",
            "Erik, do something!"
          )

          response.json(showSuccess)
        }
      )

      var body = element([
        element(
          "Press the button!"
        ),
        successMessage.element(),
        element(
          "button.do-it",
          {
            onclick: textSomeone.bindOnClient().evalable()
          },
          "Do iiiiit"
        )
      ])

      var sender = BridgeRoute.sendPage(body)

      new BridgeRoute(
        "get",
        "/",
        sender
      )
    }

    var server = Server.collective()

    Texter.prototype.start = server.start.bind(server)

    Texter.prototype.stop = server.stop.bind(server)

    return Texter
  }
)

// Let's test to see if that works:

library.test(
  "important people are texted",
  ["text-important-people", "sms", "sinon", "zombie", "html"],
  function(expect, done, Texter, sms, sinon, Browser, html) {

    sinon.stub(sms, 'send')

    var instance = new Texter()

    instance.start(3090)

    Browser.localhost("localhost", 3090);

    var browser = new Browser()
    browser.on("error", function(e) {
      throw(e)
    })

    browser.visit("/", function() {
      browser.assert.hasClass('.success', 'hidden')

      browser.pressButton(
        ".do-it",
        runChecks
      )
    })

    function runChecks() {
      instance.stop()

      console.log("\n==============\n")
      console.log(html.prettyPrint(browser.html()))

      browser.assert.hasNoClass('.success', 'hidden')

      console.log("message is visible!")

      // And then we just expect that someone tried to sms me. This is a handy side-effect of having stubbed sms.send before. Now we can check to see if it was called. You can't do that unless you stub it.

      expect(sms.send).to.have
      .been.calledWith(
        "812-320-1877",
        "Erik, do something!"
      )

      console.log("sms got called!")
      done()
    }

  }
)
