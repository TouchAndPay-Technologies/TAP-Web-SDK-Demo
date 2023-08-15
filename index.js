const body = document.querySelector("body")
const form = document.querySelector("form")
const error = document.querySelector(".error-field");
const alertHolder = document.querySelector("#alert-holder")
const api_key = "TkdLb2VUMk46ZXRoWEdJSEF0Z24xOnB1WVUzd3dvS1c4bw==";
const billerCategory = document.querySelector("#categories");
const billerCategories = document.querySelector("#billerCategory");
const billerProduct = document.querySelector("#billerProduct");

// const api_key = "TkdLb2VUMk46ZXRoWEdJSEF0Z24xOnB1WVUzd3dvS1c4bw"

// https://raissuers-staging.touchandpay.me/v1/remita/biller-category

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

const getCategories = async () => {
  try {
    const { data } = await axios.get("https://raissuers-staging.touchandpay.me/v1/remita/biller-category");

    // console.log(data)
    if (data?.success?.status === 1) {
      categoryModal(data?.success.message, "success")
      createBillerCategoriesSelect(billerCategory, data?.content, 'categories')
    } else {
      categoryModal(data?.error.message, "error")
      createCategoriesFallback(billerCategory)
    }
  } catch (error) {
    categoryModal("error fetcing categories", "error")
    createCategoriesFallback(billerCategory)

  }
}



const getBillerByCategories = async (category) => {
  try {
    const { data } = await axios.get(`https://raissuers-staging.touchandpay.me/v1/remita/biller-by-category?category=${category}`);

    if (data?.success?.status === 1) {
      categoryModal(data?.success.message, "success")
      createBillerCategoriesSelect(billerCategories, data?.content, 'biller')

    } else {
      categoryModal(data?.error?.message, "error")
      createCategoriesFallback(billerCategories)
      createCategoriesFallback(billerProduct)
    }
  } catch (error) {
    categoryModal(error?.message, "error")
    createCategoriesFallback(billerCategories)
    createCategoriesFallback(billerProduct)


  }
}

const getBillerProducts = async (category) => {
  try {
    const { data } = await axios.get(`https://raissuers-staging.touchandpay.me/v1/remita/biller-product?billerID=${category}`);

    if (data?.success?.status === 1) {
      categoryModal(data?.success.message, "success")
      createBillerCategoriesSelect(billerProduct, data?.content, 'product')

    } else {
      categoryModal(data?.error?.message, "error")
      createCategoriesFallback(billerProduct)
    }
  } catch (error) {
    categoryModal(error?.message, "error")
    createCategoriesFallback(billerProduct)

  }
}

const createCategoriesFallback = (elementTag) => {

  //Find existing options and delete
  const newOptions = elementTag.querySelectorAll("option");
  newOptions.forEach((option) => option.remove());

  // fill with default value for no data present
  const optionSelect = document.createElement("option");
  optionSelect.setAttribute("value", -1);
  optionSelect.innerHTML = 'No data present';

  elementTag.append(optionSelect);

}
const categoryModal = (message, status) => {
  const msgTag = document.createElement("p");
  msgTag.innerHTML = message;

  if (status === "success") {
    msgTag.setAttribute("class", "modal modal-success");

  } else {
    msgTag.setAttribute("class", "modal modal-error");

  }
  body.append(msgTag)

  setTimeout(() => {
    document.querySelector('.modal').remove()
  }, 4000);
}

const createBillerCategoriesSelect = (elementTag, options, type) => {

  if (type === "categories") {
    elementTag.innerHTML = ""
    //Create first blank
    const optionSelect = document.createElement("option");
    optionSelect.setAttribute("value", -1);
    optionSelect.innerHTML = "select category";
    elementTag.append(optionSelect)


    options.forEach(option => {
      const optionSelect = document.createElement("option");
      optionSelect.setAttribute("value", `${option?.categoryId}`);
      optionSelect.innerHTML = option?.categoryName;

      elementTag.append(optionSelect);

    })
  } else if (type === "biller") {
    elementTag.innerHTML = ""
    //Create first blank
    const optionSelect = document.createElement("option");
    optionSelect.setAttribute("value", -1);
    optionSelect.innerHTML = "select biller category";
    elementTag.append(optionSelect)


    options.forEach(option => {
      const optionSelect = document.createElement("option");
      optionSelect.setAttribute("value", `${option?.billerId}`);
      optionSelect.innerHTML = option?.billerName;

      elementTag.append(optionSelect);
    })
  } else {
    elementTag.innerHTML = ""

    //Create first blank
    const optionSelect = document.createElement("option");
    optionSelect.setAttribute("value", -1);
    optionSelect.innerHTML = "select biller product";
    elementTag.append(optionSelect)


    options.forEach(option => {
      const optionSelect = document.createElement("option");
      optionSelect.setAttribute("value", `${option?.billPaymentProductId}`);
      optionSelect.innerHTML = option?.billPaymentProductName;

      elementTag.append(optionSelect);
    })

  }


}

getCategories()


const handleCategoriesSelect = (event) => {
  const categoryId = Number((event.target.value))
  if (categoryId !== -1) {
    getBillerByCategories(categoryId)
  }
}

const handleBillerSelect = (event) => {
  const categoryId = ((event.target.value))
  if (categoryId !== -1) {

    getBillerProducts(categoryId)
  }
}


billerCategory.addEventListener('change', handleCategoriesSelect)
billerCategories.addEventListener("change", handleBillerSelect)