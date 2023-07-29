const Body = document.body;
const NameHeader = document.querySelector(".name");
const translatedToArea = document.querySelector(".translateTo");
const translatedFromArea = document.querySelector(".translateFrom");
const translateButton = document.querySelector(".translateButton");

const iconReverse = document.querySelector(".fa-refresh");
const iconCopy1 = document.querySelector(".clone1");
const iconCopy2 = document.querySelector(".clone2");
const iconVolume1 = document.querySelector(".volume1");
const iconVolume2 = document.querySelector(".volume2");

const Words = document.querySelector(".words");
const KnowButton = document.querySelector(".know");
const DontKnowButton = document.querySelector(".dknow");
const ScoreButton = document.querySelector(".score");
const WinButton = document.querySelector(".win");

const WrapperRepeat = document.querySelector(".wrapperRepeat");

let text = "cat";
let from = "en-US";
let to = "ru-RU";
let fromTemple = "en-US";
let toTemple = "ru-RU";
let reverse = false;

//Слушатели
translateButton.addEventListener("click", Translate);

// Реверс языков
iconReverse.addEventListener("click", () => {
  let a = translatedToArea.value;
  if (reverse) {
    reverse = false;
    translatedToArea.value = translatedFromArea.value;
    translatedFromArea.value = a;
    NameHeader.innerHTML = "From ENG to RU";
  } else {
    reverse = true;
    translatedToArea.value = translatedFromArea.value;
    translatedFromArea.value = a;
    NameHeader.innerHTML = "From RU to ENG";
  }
});

//копирование
iconCopy1.addEventListener("click", () => {
  navigator.clipboard.writeText(translatedToArea.value);
});

iconCopy2.addEventListener("click", () => {
  navigator.clipboard.writeText(translatedFromArea.value);
});

//озвучка
iconVolume1.addEventListener("click", () => {
  let utterance = new SpeechSynthesisUtterance(translatedToArea.value);
  speechSynthesis.speak(utterance);
});

iconVolume2.addEventListener("click", () => {
  let utterance = new SpeechSynthesisUtterance(translatedFromArea.value);
  speechSynthesis.speak(utterance);
});

//Перевод с помощью стороннего АПИ
function Translate() {
  if (translatedToArea.value == "") {
    //console.log("пустая строка");
  } else {
    text = translatedToArea.value;
    //реверс языков
    if (reverse) {
      from = toTemple;
      to = fromTemple;
    } else {
      from = fromTemple;
      to = toTemple;
    }

    let api = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${from}|${to}`;
    fetch(api)
      .then(translatedFromArea.setAttribute("placeholder", "Translating..."))
      .then((translatedFromArea.value = ""))
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.responseData.translatedText);
        translatedFromArea.value = data.responseData.translatedText;
      })
      .then(
        setTimeout(() => {
          translatedFromArea.setAttribute("placeholder", "");
          //console.log("Переведено");
        }, 1000)
      );
  }
}

//
//Логика карточек
//

let randomValues = getRandomValuesFromArray(regText, 20);
let score = 0;
let win = 0;
let flag = true;
let flag2 = true;

Words.innerHTML = randomValues[0];
//Если знаешь слово
KnowButton.addEventListener("click", () => {
  score++;
  win++;
  ScoreButton.innerHTML = `${score}/20`;
  WinButton.innerHTML = `${win}/20`;
  //слебующее слово
  Words.innerHTML = randomValues[score];
  //
  translatedToArea.focus();
  checkScore();
});

//Если НЕ знаешь слово
DontKnowButton.addEventListener("click", () => {
  score++;
  ScoreButton.innerHTML = `${score}/20`;
  //слебующее слово
  Words.innerHTML = randomValues[score];
  //
  if (reverse) {
    reverse = false;
    translatedToArea.value = "";
    translatedFromArea.value = "";
    NameHeader.innerHTML = "From ENG to RU";
  }
  // слово отправляется в переводчик
  let textToTranslate = randomValues[score - 1].substring(1);
  //console.log(textToTranslate);
  translatedToArea.value = textToTranslate;
  //
  if (flag) {
    flag = false;
    let newH1 = document.createElement("h1");
    newH1.innerHTML = "На повторение:";
    newH1.classList.add("repeatHeader1");
    WrapperRepeat.appendChild(newH1);
  }
  //
  let newH2 = document.createElement("h2");
  newH2.innerHTML = randomValues[score - 1];
  if (flag2) {
    newH2.classList.add("repeatHeader3");
    flag2 = false;
  } else {
    newH2.classList.add("repeatHeader2");
    flag2 = true;
  }
  WrapperRepeat.appendChild(newH2);
  //
  Translate();
  checkScore();
});

//проверка
function checkScore() {
  if (score < 20) {
    return 0;
  }
  let winPhrase = "";
  if (win < 5) {
    winPhrase = "Надо подучиться!";
  } else if (win < 14) {
    winPhrase = " Виден прогресс!";
  } else if (win < 18) {
    winPhrase = " Близко к идеалу!";
  } else {
    winPhrase = "   Превосходно!";
  }
  if (score == 20) {
    Words.innerHTML = `<pre>
  На сегодня всё!
Ваш результат ${win}/20
 ${winPhrase}
</pre>`;
    DontKnowButton.classList.add("hidden");
    KnowButton.classList.add("hidden");
  }
  let ButtonRepeat = document.createElement("button");
  ButtonRepeat.innerHTML = "Обновить слова";
  ButtonRepeat.classList.add("buttonRepeat");
  WrapperRepeat.appendChild(ButtonRepeat);
  ButtonRepeat.addEventListener("click", Repeat);
}

//Новые 20 слов
function Repeat() {
  //
  if (win < 20) {
    let hr = document.createElement("hr");
    hr.classList.add("hrRepeat");
    WrapperRepeat.appendChild(hr);
  }
  //
  this.classList.add("hidden");
  //
  randomValues = getRandomValuesFromArray(regText, 20);
  score = 0;
  win = 0;
  //
  DontKnowButton.classList.remove("hidden");
  KnowButton.classList.remove("hidden");
  //
  Words.innerHTML = randomValues[score];
  ScoreButton.innerHTML = `${score}/20`;
  WinButton.innerHTML = `${win}/20`;
  //
  window.scrollTo(0, 0);
}

function hasTouch() {
  return (
    "ontouchstart" in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

if (hasTouch()) {
  // remove all the :hover stylesheets
  try {
    // prevent exception on browsers not supporting DOM styleSheets properly
    for (var si in document.styleSheets) {
      var styleSheet = document.styleSheets[si];
      if (!styleSheet.rules) continue;

      for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
        if (!styleSheet.rules[ri].selectorText) continue;

        if (styleSheet.rules[ri].selectorText.match(":hover")) {
          styleSheet.deleteRule(ri);
        }
      }
    }
  } catch (ex) {}
}
