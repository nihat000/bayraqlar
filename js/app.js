"use strict";
const Game = {
   freeze: false,
   correctAnswer: 0,
   wrongAnswer: 0,
   settings: {
      region: ['Europe'],
      timerId: 0,
      timer: 0,
      timerId_: 0,
      timer_: 0,
      variants: {
         count: 6,
         initials: {
            standart: ['A)', 'B)', 'C)', 'D)', 'E)', 'F)']
         }
      },
   },
   data: null,
   question: {
      'title': "Choose the correct variant",
      answer: '',
      variants: [],
   }
}


let scoreEl = document.querySelector(".question-screen .score .point")
let timerEl = document.querySelector(".question-screen .timer span");
let selectedMode = 0;

fetch('./api/all.json').then(res => res.json()).then(data => { Game.data = data; })

function selectMode(id, th) {
   selectedMode = id;
   document.querySelectorAll('.mode').forEach(x => x.classList.remove('selected-mode'))
   th.classList.add('selected-mode')
}


function changeDuration() {
   document.querySelector('#duration').innerHTML = document.querySelector('#range').value + " seconds"
}



function getCountry() {
   while (true) {
      let z = Game.data[Math.floor(Math.random() * Game.data.length)];
      for (let i = 0; i < Game.settings.region.length; i++) {
         if (z.region == Game.settings.region[i]) {
            return z
         }
      }
   }
}

function getQuestion() {
   document.querySelector(' .variants').innerHTML = ""
   Game.question.answer = getCountry();
   Game.question.variants = [];

   document.getElementById('flag').src = Game.question.answer.flags.svg;

   for (let i = 0; i < Game.settings.variants.count - 1; i++) {
      Game.question.variants.push(getCountry());
   }
   Game.question.variants.splice(Math.round(Math.random() * (Game.settings.variants.count + 1)), 0, Game.question.answer);


   for (let i = 0; i < Game.question.variants.length; i++) {
      let btn = document.createElement('button');
      btn.onclick = nextQuestion;
      btn.className = 'answer';
      btn.dataset.name = Game.question.variants[i].name.common
      btn.innerText = Game.settings.variants.initials.standart[i] + " " + Game.question.variants[i].name.common
      document.querySelector('.variants').append(btn);
   }

   // console.log(Game.question.answer.name.common, Game.question.variants);
   // empty

}




function startGame() {

   let region = [];
   document.getElementsByName('region').forEach(r => {
      if (r.checked) {
         region.push(r.value)
      }
   })
   if (region.length == 0) {
      alert("Please choose at least one region")
      return false;
   }
   Game.settings.region = region;

   document.querySelectorAll('.screen').forEach(s => { s.style.display = "none" })
   document.querySelector('.question-screen').style.display = 'block';
   getQuestion();




   if (selectedMode == 0) {
      Game.settings.timer = document.querySelector("#range").value;
      Game.settings.timerId = setInterval(() => {
         if (Game.settings.timer > 0) {
            timerEl.innerText = Game.settings.timer + " seconds"
            Game.settings.timer--;
         } else {
            clearInterval(Game.settings.timerId);
            finishGame();
         }

      }, 1000);
   }

   else if (selectedMode == 1) {
      Game.settings.timer = document.querySelector("#range").value;
      Game.settings.timerId = setInterval(() => {
         if (Game.settings.timer > 0) {
            timerEl.innerText = Game.settings.timer + " seconds"
            Game.settings.timer--;
         } else {
            clearInterval(Game.settings.timerId);
            finishGame();
         }

      }, 1000);
   }
}




function nextQuestion() {
   let this_ = this;
   if (Game.freeze) {
      return false;
   }

   Game.freeze = true;
   let i = 1;
   let j = true;
   this_.classList.toggle('bg-9');
   let freezeId = setInterval(() => {
      if (i == 8) {
         clearInterval(freezeId)
         reveal();
      }
      if (j) {
         this.style.opacity = 0.5
      } else {
         this.style.opacity = 1
      }
      j = !j
      i++;

   }, 150)
   function reveal() {
      // console.log(this_);
      if (this_.dataset.name == Game.question.answer.name.common) {
         this_.classList.add('bg-correct')
         Game.correctAnswer++;
         scoreEl.innerText = Game.correctAnswer + " correct";

         let startPoint = 80
         let endPoint = 30

         document.querySelector('.plus-1').style.display = "block";
         let timerX = setInterval(() => {
            document.querySelector('.plus-1').style.top = startPoint + "px"
            startPoint -= 3
            if (startPoint < endPoint) {
               document.querySelector('.plus-1').style.display = "none";
               clearInterval(timerX)
            }
         }, 30)


      } else {
         this_.classList.add('bg-wrong');
      }
      setTimeout(() => { Game.freeze = false; getQuestion() }, 300)
   }

}

function finishGame() {
   document.querySelectorAll('.screen').forEach(x => x.style.display = "none")
   document.querySelector('.result-screen').style.display = "block";
   document.querySelector('.result-screen .b').innerText = `You got ${Game.correctAnswer} correct answer `;
   document.querySelector('.result-screen .bb').innerText = `You got ${Game.wrongAnswer} wrong answer `;
   document.querySelector('.result-screen .bbb').innerText = `Accuracy Percentage ${Game.correctAnswer / (Game.correctAnswer + Game.wrongAnswer) * 100}% `;



}


function closeResult() {
   document.querySelectorAll('.screen').forEach(x => x.style.display = "none")
   document.querySelector('.start-screen').style.display = "block";
}