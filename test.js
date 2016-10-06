var test = require("nrtv-test")(require)
var library = test.library


library.define("sms", function() {
  return {
    send: function() {
      throw new Error("We don't actually want to be here!")
    }
  }
})


library.define (
  "text-important-people",

  ["sms", "./bridge-element", "nrtv-server", "web-element", "make-request", "browser-bridge"],
  function(sms, BridgeElement, Server, element, makeRequest, BrowserBridge) {

    function Texter() {
      var server = new Server()
      this.start = server.start.bind(server)
      this.stop = server.stop.bind(server)

      var bridge = new BrowserBridge()

      var successMessage =
        new BridgeElement(
          ".success.hidden",
          "Success! You da real MVP."
        )

      var showSuccess = successMessage.defineShowInBrowser()

      server.addRoute(
        "post",
        "/text",
        function(x, response) {
          sms.send(
            "812-320-1877",
            "Erik, do something!"
          )

          console.log("HAMMER TOAD:", showSuccess.ajaxResponse())
          response.json(showSuccess.ajaxResponse())
        }
      )

      var textSomeone = makeRequest
        .defineOn(bridge)
        .withArgs(
          {
            method: "post",
            path: "/text"
          },
          bridge.handle()
        )

      var body = element([
        element(
          "Press the button!"
        ),
        successMessage.element(),
        element(
          "button.do-it",
          {
            onclick: textSomeone.evalable()
          },
          "Do iiiiit"
        )
      ])

      server.addRoute("get", "/", bridge.sendPage(body))
    }

    return Texter
  }
)


test.using(
  "important people are texted",
  ["text-important-people", "sms", "sinon", "nrtv-browse", "html"],
  function(expect, done, Texter, sms, sinon, browse, html) {

    sinon.stub(sms, "send")

    var instance = new Texter()

    instance.start(3090)

    browse("http://localhost:3090",
      function(browser) {

        browser.assertHasClass(".success", "hidden", hitButton)

        function hitButton() {
          browser.pressButton(
            ".do-it",
            runChecks.bind(null, browser)
          )
        }
      }
    )

    function runChecks(browser) {

      browser.assertNoClass(".success", "hidden", expectMessage)

      function expectMessage() {
        done.ish("message is visible!")

        expect(sms.send).to.have
        .been.calledWith(
          "812-320-1877",
          "Erik, do something!"
        )

        browser.done()
        instance.stop()
        done()
      }
    }

  }
)
