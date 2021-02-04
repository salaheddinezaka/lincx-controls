let colleges = []
const zoneAttributes = {}

function loadColleges() {
  fetch('https://cdn.jsdelivr.net/gh/salaheddinezaka/lincx-controls/search-schools/schools.json').then((res) =>
    res.json().then((vals) => (colleges = vals))
  )
}

function hideModal() {
  $('.scores__modal--background').first().hide()
  $('.scores__modal').first().hide()
}

function showModal() {
  $('.scores__modal--background').first().show()
  $('.scores__modal').first().slideDown()
}

function addAutoComplete(element, callbackOnSubmit) {
  // #autocomplete
  new Autocomplete(element, {
    search: (input) => {
      if (input.length < 1) {
        return []
      }
      return colleges.filter((college) => {
        return college.name.toLowerCase().startsWith(input.toLowerCase())
      })
    },
    onSubmit: (result) => {
      console.log(result)
      callbackOnSubmit(result)
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
  })
}

function updateZoneAttribute(attribute, value) {
  zoneAttributes[attribute] = value
  console.log(zoneAttributes)
  // window.renderAdFeed(zoneAttributes);
}

function handleModalSubmit(value) {
  updateZoneAttribute('data-school', value)
  hideModal()
}

function handleSearchSubmit(value) {
  updateZoneAttribute('data-school', value)
}

function createSearchInput() {
  document.getElementById('search-schools-control').innerHTML = `
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
  `
}

function makeSearchFixedOnScroll() {
  const searchContainerTop = document.getElementById('search-schools-control')
    .offsetTop
  $(window).scroll(() => {
    const currentScroll = $(window).scrollTop()
    if (currentScroll >= searchContainerTop) {
      $('#search-schools-control').css({
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        'z-index': 1
      })
    } else {
      $('#search-schools-control').css({
        position: 'static'
      })
    }
  })
}

function waitFor(element, callback) {
  const checkExist = setInterval(function () {
    if (document.querySelector(element)) {
      callback()
      clearInterval(checkExist)
    }
  }, 100)
}

hideModal()
waitFor('#search-schools-control', async () => {
  createSearchInput()
  loadColleges()
  showModal()
  addAutoComplete('#autocomplete', handleModalSubmit)
  addAutoComplete('#autocomplete__input', handleSearchSubmit)
  makeSearchFixedOnScroll()
})
