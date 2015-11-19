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

  ["sms", "./bridge-element", "nrtv-server", "nrtv-element", "nrtv-make-request", "nrtv-browser-bridge"],
  function(sms, BridgeElement, server, element, makeRequest, bridge) {

    function Texter() {

      var successMessage =
        new BridgeElement(
          ".success.hidden",
          "Success! You da real MVP."
        )

      var showSuccess = successMessage.show.defineOnClient()

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
        .defineInBrowser()
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
  ["text-important-people", "sms", "sinon", "nrtv-browse", "html", "nrtv-server"],
  function(expect, done, Texter, sms, sinon, browse, html, server) {

    sinon.stub(sms, "send")

    var instance = new Texter()

    server.start(3090)

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
        server.stop()
        done()
      }      
    }

  }
)
