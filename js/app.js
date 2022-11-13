"use strict";
const Game = {
   freeze: false,
   settings: {
      region: ['Europe'],
      timerId: 0,
      timer: 0,
      mode: [{
         type: "timer",
         name: "timer-60",
         timeLimit: 60
      }, {
         type: "timer",
         name: 'timer-30',
         timeLimit: 30,
      }, {
         name: "millionarie",
         type: 'millionarie',
         qTimeLimit: 30,
         hint: ['joker', '50-50', 'call']
      }, {
         type: 'learn',
      }, {

      }
      ]
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


let correctAnswerEl = document.querySelector(".question .correct-answer-count span")
let timerEl = document.querySelector(".question .timer span");

fetch('./api/all.json').then(res => res.json()).then(data => { Game.data = data; })

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




function startGame(index = 0,) {

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

   document.querySelectorAll('.screen').forEach(s => {
      s.style.display = "none"
   })
   getQuestion();
   document.querySelector('.screen-question').style.display = 'block';



   if (Game.settings.mode[index].timeLimit > 0) {
      Game.settings.timer = Game.settings.mode[index].timeLimit
      Game.settings.timerId = setInterval(() => {
         if (Game.settings.timer > 0) {
            timerEl.innerText = Game.settings.timer + " seconds"
            Game.settings.timer--;
         } else {
            clearInterval(Game.settings.timerId);
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
         correctAnswerEl.innerText = Game.correctAnswer + " correct";

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