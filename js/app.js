"use strict";
const Game = {
   settings: {
      region: ['Europe'],
      mode: 'Timer',
   },
   correctAnswer: 0,
   wrongAnswer: 0,
   variants: {
      count: 4,
      initials: {
         standart: ['A)', 'B)', 'C)', 'D)']

      }
   },
   data: null,
   question: {
      'title': "Choose the correct variant",
      answer: '',
      variants: [],
   }
}

let timer = 60;
let correctAnswerEl = document.querySelector(".question .correct-answer-count span")
let timerEl = document.querySelector(".question .timer span");

fetch('./api/all.json').then(res => res.json()).then(data => { Game.data = data; main() })

function getCountry() {
   while (true) {
      let z = Game.data[Math.floor(Math.random() * Game.data.length)];
      for (let i = 0; i < Game.settings.mode.length; i++) {
         if (z.region == Game.settings.region[i]) {
            return z
         }
      }
   }
}

function getQuestion() {
   document.querySelector('.question .variants').innerHTML = ""
   Game.question.answer = getCountry();
   Game.question.variants = [];

   document.getElementById('flag').src = Game.question.answer.flags.svg;

   for (let i = 0; i < Game.variants.count - 1; i++) {
      Game.question.variants.push(getCountry());
   }
   Game.question.variants.splice(Math.round(Math.random(Game.variants.count)), 0, Game.question.answer);


   for (let i = 0; i < Game.question.variants.length; i++) {
      let btn = document.createElement('button');
      btn.onclick = nextQuestion;
      btn.className = 'answer';
      btn.dataset.name = Game.question.variants[i].name.common
      btn.innerText = Game.variants.initials.standart[i] + " " + Game.question.variants[i].name.common
      document.querySelector('.variants').append(btn);
   }

   // console.log(Game.question.answer.name.common, Game.question.variants);

}

function main() {
   getQuestion();
   // startGame();
}


function startGame() {
   let region = [];
   document.getElementsByName('region').forEach(r => {
      if (r.checked) {
         region.push(r.value)
      }
   })
   if (region.length == 0) {
      return false;
   }
   Game.settings.region = region;

   document.querySelectorAll('.screen').forEach(s => {
      s.style.display = "none"
   })
   getQuestion();
   document.querySelector('.screen-question').style.display = 'block';

   let timerId = setInterval(() => {
      if (timer > 0) {
         timerEl.innerText = timer + " seconds"
         timer--;
      } else {
         clearInterval(timerId);
      }

   }, 1000);

}

function nextQuestion() {
   if (this.dataset.name == Game.question.answer.name.common) {
      Game.correctAnswer++;
      correctAnswerEl.innerText = Game.correctAnswer + " correct";
   }
   getQuestion();

}