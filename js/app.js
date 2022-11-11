const Game = {
   correctAnswers: 0,
   wrongAnswers: 0,
   variants: {
      count: 4,
      Initials: ['A)', 'B)', 'C)', 'D)', 'E)'],
   },
   questionArr: [],
}
let data;

fetch("api/flags.json").then(res => res.json()).then(res => { data = res; loadQuestion() });


function getRandomCountry() {
   return data[Math.floor(Math.random() * data.length)];
}

function generateVariants(country) {
   let countryArr = [];
   for (let i = 1; i < Game.variants.count; i++) {
      let isSame = false;
      let country_ = getRandomCountry();
      if (country.code == country_.code) {
         i--;
         continue;
      }

      for (let j = 0; j < country_.length; j++) {
         if (country_[j].code == country.code) {
            i--;
            isSame = true
            break;
         }
      }
      if (isSame) {
         continue;
      }
      countryArr.push(country_);

   }
   countryArr.splice(1, 0, country)
   return countryArr;

}

function loadQuestion() {
   let country = getRandomCountry()
   let countryArr = generateVariants(country)
   Game.questionArr.push(country);



   document.querySelector(".flag-wrap img").src = country.flag.w80

   for (let i = 0; i < Game.variants.count; i++) {
      document.querySelector(".variants").innerHTML +=
         ` <button> ${Game.variants.Initials[i]}  ${countryArr[i].name} </button> `

   }



   // country_.forEach(o => {
   //    document.querySelector('.variants').innerHTML += o.name
   // })

}


