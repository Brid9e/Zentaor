
class CalModel {
  dark() {
    document.documentElement.style.setProperty("--color-bg", "var(--color-dark)");
  }
  light() {
    document.documentElement.style.setProperty("--color-bg", "var(--color-light)");
  }
}

let _model = new CalModel()

function changeModel() {
  if (localStorage.model == 'dark') {
    console.log('dark-1')
    _model.light()
  } else {
    console.log('light-1')
    _model.dark()
  }
}

function initModel() {
  if (localStorage.model == 'dark') {
    _model.dark()
  } else {
    _model.light()
  }
}
