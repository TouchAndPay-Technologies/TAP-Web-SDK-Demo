
const form = document.querySelector("form")
const error = document.querySelector(".error-field");
const alertHolder = document.querySelector("#alert-holder")
// const api_key = "TkdLb2VUMk46ZXRoWEdJSEF0Z24xOnB1WVUzd3dvS1c4bw==";
const api_key = "TkdLb2VUMk46ZXRoWEdJSEF0Z24xOnB1WVUzd3dvS1c4bw"



form.addEventListener("submit", function (event) {
  event.preventDefault()

  alertHolder.innerHTML = ""
  const fullname = this[0].value
  const amountinkobo = this[1].value;
  const email = this[2].value;

  if (fullname == "" || amountinkobo == "" || email == "") {
    error.innerHTML = ("Fields can not be empty")
  } else {
    error.innerHTML = ""
    payWithTAP(email, amountinkobo, fullname);
  }
})


function generateREF() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return result;
}

function payWithTAP(email, amountinkobo, fullname) {
  const handler = TAPPaymentPop.setup({
    apiKey: api_key,
    amount: amountinkobo,
    transID: `KLMNOYZabcdefghijkl${Math.random().toString(36).slice(2)}qrstuvwxyz`,
    email: email,
    customPayload: {
      fullname: fullname,
    },
    callback: function (response) {
      console.log(response);
      const msg =
        'Success. The transaction id is <b>"' +
        response.transID +
        '"</b>';
      document.getElementById("alert-holder").innerHTML =
        ('<div class="alert alert-success">' + msg + "</div>");
      document.getElementById("pay-form").reset();
    },
    onClose: function () {
      const msg = "Closed. Please click the 'Pay' button to try again";
      document.getElementById("alert-holder").innerHTML =
        '<div class="alert alert-info">' + msg + "</div>";
    },
  });

  handler.openIframe();
}
