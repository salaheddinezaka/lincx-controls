let colleges = [];
const zoneAttributes = {};

function loadColleges() {
  fetch(
    "https://cdn.jsdelivr.net/gh/salaheddinezaka/lincx-controls/search-schools/schools.json"
  ).then((res) => res.json().then((vals) => (colleges = vals)));
}

function insertModalIntoPage() {
  const modalElement = document.createElement("div");
  modalElement.id = "modal";
  modalElement.innerHTML = `
  <div class="scores__modal--background"></div>
  <div class="scores__modal" style="display: block; top: 50px; opacity: 1;">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="329pt"
      viewBox="0 0 329.26933 329"
      width="329pt"
      onclick="hideModal()"
    >
      <path
        d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"
      />
    </svg>
    <div class="modal__info">
      <div class="modal__header">
        <div class="modal__title">Which college will you be attending?</div>
        <img
          src="https://cdn.zeplin.io/5fb6b6e30914549574b7eeee/assets/CB1DF7C0-4276-47C2-8E7C-A7BAF5F76F9C.png"
          alt="credit score"
        />
      </div>
      <div class="modal__form">
        <div class="modal__input" id="autocomplete">
          <input
            class="autocomplete-input"
            type="text"
            placeholder="Enter your college name"
          />
          <ul class="autocomplete-result-list suggestions__list"></ul>
        </div>
        <button class="loan__button" onclick="">FIND LOANS</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(modalElement);
}

function hideModal() {
  $(".scores__modal--background").first().hide();
  $(".scores__modal").first().hide();
}

function showModal() {
  $(".scores__modal--background").first().show();
  $(".scores__modal").first().slideDown();
}

function addAutoComplete(element, callbackOnSubmit) {
  // #autocomplete
  new Autocomplete(element, {
    search: (input) => {
      if (input.length < 1) {
        return [];
      }
      return colleges.filter((college) => {
        return college.name.toLowerCase().startsWith(input.toLowerCase());
      });
    },
    onSubmit: (result) => {
      console.log(result);
      callbackOnSubmit(result);
    },
    getResultValue: (result) => result.name,
    renderResult: (result, props) => `
    <div class="suggestion__item" ${props}>
      <span class="college__name"
        >${result.name}</span
      >
      <span class="college__city">${result.state.name} ${result.state.region.name}</span>
    </div>
    `
  });
}

function updateZoneAttribute(attribute, value) {
  zoneAttributes[attribute] = value;
  console.log(zoneAttributes);
  // window.renderAdFeed(zoneAttributes);
}

function handleModalSubmit(value) {
  updateZoneAttribute("data-school", value);
  hideModal();
}

function handleSearchSubmit(value) {
  updateZoneAttribute("data-school", value);
}

function createSearchInput() {
  document.getElementById("search-schools-control").innerHTML = `
    <div class="search__control--container">
    <h3>Which college will you be attending?</h3>
    <div class="control__form">
      <div class="control__input" id="autocomplete__input">
        <input
          class="autocomplete-input"
          type="text"
          placeholder="Enter your college name"
        />
        <ul class="autocomplete-result-list suggestions__list"></ul>
      </div>
      <button class="search__button">FIND LOANS</button>
    </div>
  </div>
  `;
}

function makeSearchFixedOnScroll() {
  const searchContainerTop = document.getElementById("search-schools-control")
    .offsetTop;
  $(window).scroll(() => {
    const currentScroll = $(window).scrollTop();
    if (currentScroll >= searchContainerTop) {
      $("#search-schools-control").css({
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        "z-index": 1
      });
    } else {
      $("#search-schools-control").css({
        position: "static"
      });
    }
  });
}

function waitFor(element, callback) {
  const checkExist = setInterval(function () {
    if (document.querySelector(element)) {
      callback();
      clearInterval(checkExist);
    }
  }, 100);
}
window.onload = function () {
  if (window.jQuery) {
    insertModalIntoPage();
    hideModal();
    waitFor("#search-schools-control", async () => {
      createSearchInput();
      loadColleges();
      showModal();
      addAutoComplete("#autocomplete", handleModalSubmit);
      addAutoComplete("#autocomplete__input", handleSearchSubmit);
      makeSearchFixedOnScroll();
    });
  }
};
