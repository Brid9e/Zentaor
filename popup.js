let syncData = document.getElementById("syncData");
let fromBg = document.getElementById("fromBg");
const darkLight = document.getElementById("dark-light");


if (!localStorage.model) {
  localStorage.model = 'light'
}

syncData.addEventListener("click", async () => {
  syncData.firstChild.classList.add('loading')
  if (isLoading) {
    return
  }
  syncDatas(true)
});

class Model {
  dark() {
    document.documentElement.style.setProperty("--color-bg", "var(--color-dark)");
    document.documentElement.style.setProperty("--color-font", "var(--color-info-4)");
    document.documentElement.style.setProperty("--color-hover", "var(--color-sub-dark)");
    document.documentElement.style.setProperty("--color-hover-1", "var(--color-light)");
    document.documentElement.style.setProperty("--color-high-light", "var(--color-light)");
  }
  light() {
    document.documentElement.style.setProperty("--color-bg", "var(--color-light)");
    document.documentElement.style.setProperty("--color-font", "var(--color-info)");
    document.documentElement.style.setProperty("--color-hover", "var(--color-sub)");
    document.documentElement.style.setProperty("--color-hover-1", "var(--color-primary)");
    document.documentElement.style.setProperty("--color-high-light", "var(--color-font)");
  }
}

const _model = new Model

window.onload = () => {
  if (localStorage.model == 'light') {
    _model.light()
  } else {
    _model.dark()
    localStorage.model = 'dark'
  }
}

darkLight.addEventListener("click", () => {
  if (localStorage.model == 'light') {
    _model.dark()
    localStorage.model = 'dark'
  } else {
    _model.light()
    localStorage.model = 'light'
  }
});

axios.get('./manifest.json').then(r => {
  const version = document.querySelector('.version-box')
  version.innerText = r.data.version
})

