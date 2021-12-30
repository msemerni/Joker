const container = document.getElementById("container");
const promoButton = document.getElementById("promoButton");
const alertPromo = document.createElement("resultBox");
alertPromo.style.textAlign = "center";
container.appendChild(alertPromo);

promoText.oninput = () => {
    alertPromo.innerText = "";
}

//МОЖЕТ ЛИ ПРОМОКОД НАЧИНАТЬСЯ С НУЛЯ? ДОПУСТИМ, ЧТО МОЖЕТ. НО ТАК СЛОЖНЕЕ ))
//ЕСЛИ НЕ МОЖЕТ НАЧИНАТЬСЯ С НУЛЯ:
// if ( (promoTextNumber/10000000) >= 1 && (promoTextNumber/10000000) < 10){
//     promoTextNumber = true;
//      ....
// }

let counterKeyDown = 0;
promoText.addEventListener("keydown", (e) => {
    // counterKeyDown = promoText.value.length;
    // if (promoText.value == "") {
    //     counterKeyDown = 0;
    // }
    if (e.key >= "0" && e.key <= "9") {
        counterKeyDown++;
        console.log(counterKeyDown);
    }
    // else if (e.key == "Delete" || e.key == "Backspace") {
    //     counterKeyDown--;
    //     console.log(counterKeyDown);
    // }
})

promoButton.onclick = () => {
    const promoText = document.getElementById("promoText");
    const promoTextNumber = +promoText.value;
    const returnedValue = getBonus(promoTextNumber);
    counterKeyDown = 0;
    alertPromo.innerText = "";

    if (returnedValue === 0) {
        alertPromo.innerText = `Промокод ${promoText.value} не действительный`;
        console.log(`Промокод ${promoText.value} не действительный`);
    }
    else {
        alertPromo.innerText += `Промокод: ${promoText.value}\n Бонус: ${returnedValue} грн.`;
        console.log(`Бонус: ${returnedValue} грн.`);
    }
    promoText.value = "";

};

function checkNumber(key) {
    return (key >= "0" && key <= "9");
    // return (key >= "0" && key <= "9") || key == "ArrowLeft" || key == "ArrowRight" || key == "Delete" || key == "Backspace";
}

//// Функция расчета бонуса, которая принимает тип "number":
function getBonus(someNumber) {
    // if ( (someNumber/10000000) >= 1 && (someNumber/10000000) < 10){
    //     someNumber = true;
    //      ...
    // }

    let promoNumber = someNumber;
    let allDigits = [];
    let evenSum = 0;
    let oddSum = 0;

    //получение всех цифр промокода
    for (let i = 7; i >= 0; i--) {
        allDigits[i] = Math.floor(promoNumber % 10);
        promoNumber /= 10;
    }
    console.log(allDigits);
    //если число целое и восьмизначное
    if (((someNumber ^ 0) === someNumber) && (counterKeyDown === 8)) {
        ////////////////////создание массива всех нечетных двузначных + однозначных (чет и нечет) чисел///////////
        let oddPairsAndOthers = [];
        for (let i = 0; i < allDigits.length - 1; i++) {

            if ((allDigits[i] % 2 !== 0 && allDigits[i + 1] % 2 !== 0)) { // нечет и след нечет
                oddPairsAndOthers.push(allDigits[i] * 10 + allDigits[i + 1]);
            }
            else if (allDigits[i] % 2 === 0) { // если четная
                oddPairsAndOthers.push(allDigits[i]);
            }
            else if ((allDigits[i] % 2 !== 0 && (allDigits[i - 1] % 2 === 0) && allDigits[i + 1] % 2 === 0)) {
                oddPairsAndOthers.push(allDigits[i]); // нечет + слева и справа четная
            }
        }
        // console.log(oddPairsAndOthers);

        ///////////////////создание массива из нечетных двузначных между которыми только четные///////////////////
        let oddPairs = [];
        let oddPairsCounter = 0;

        for (let i = 0; i < oddPairsAndOthers.length; i++) {
            //если двузначное и предыдущее четное или двузначное стоит в начале
            if (((oddPairsAndOthers[i] / 10 > 1) && (oddPairsAndOthers[i - 1] % 2 === 0)) ||
                ((oddPairsAndOthers[i] / 10 > 1) && (i === 0))) {
                oddPairs.push(oddPairsAndOthers[i]);
                oddPairsCounter++;
            }
            // если нечетное однозначное и только одна пара в массиве
            if ((oddPairsAndOthers[i] % 2 !== 0) && (oddPairsAndOthers[i] / 10 <= 1) && (oddPairsCounter <= 1)) {
                oddPairs = [];
            }
        }
        // console.log(oddPairs);
        // console.log(oddPairsCounter);

        ///////////////////расчет бонусов///////////////////////////////////////////////////////////////////////
        if (oddPairs.length > 1) {
            let pairGrowCounter = 0;
            for (num of oddPairs) {
                if ((Math.floor(num / 10)) < (num % 10)) {
                    pairGrowCounter++;
                }
            }
            if (pairGrowCounter === oddPairs.length) {
                return 2000;
            }
            else {
                return 1000;
            }
        }
        else {
            for (num of allDigits) {
                if (num % 2 === 0) {
                    evenSum += num;
                }
                else {
                    oddSum += num;
                }
            }
            // console.log(`Even sum: ${evenSum}`); ////
            // console.log(`Odd sum: ${oddSum}`); ////
            if (evenSum > oddSum) {
                return 100;
            }
            else {
                return 0;
            };
        }
    }
    else {
        return 0;
    };
};