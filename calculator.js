const operation = document.getElementsByClassName("top")[0];
const result = document.getElementsByClassName("bottom")[0];
let mathArr = ["0", "+", "0"];
let showingResult = false;
const maxResultCharacters = 15;
let randomRange = [];
let randomStatus = false;

document.querySelector(".button-box").addEventListener("click", function (event){
    const item = event.target;
    const itemClasses = item.className.split(" ");
    if(itemClasses[0] === "btn"){
        if(mathArr[0] === "Math Error") clearAll();
        switch (itemClasses[1]){
            case "number":
                enableEditingModeOnce("0")
                appendNumber(item.innerHTML)
                break;
            case "point":
                enableEditingModeOnce("0")
                appendDecimalPoint()
                break;
            case "negate":
                enableEditingModeOnce(mathArr[0])
                negate()
                break;
            case "reset":
                enableEditingModeOnce("0")
                clearAll();
                break;
            case  "backspace":
                enableEditingModeOnce(mathArr[0])
                backspace()
                break;
            case "operator":
                enableEditingModeOnce("0")
                mathArr[2] = result.innerHTML;
                performBasicMath(mathArr, item.innerHTML)
                operation.innerHTML = mathArr[0] + mathArr[1];
                result.innerHTML = mathArr[2];
                break;
            case "equal":
                enableEditingModeOnce("0")
                mathArr[2] = result.innerHTML;
                convertToRegularOrExponent(mathArr, 2);
                operation.innerHTML = mathArr.join("");
                performBasicMath(mathArr, "+");
                result.innerHTML = mathArr[0];
                showingResult = true;
                result.style.color = "rgba(255, 230, 30, 0.7)";
                break;
            case "log":
                enableEditingModeOnce(mathArr[0]);
                mathArr[0] = result.innerHTML;
                mathArr[1] = "log";
                convertToRegularOrExponent(mathArr, 2);
                operation.innerHTML = `${mathArr[1]}10(${mathArr[0]})`;
                performBasicMath(mathArr, "+");
                result.innerHTML = mathArr[0];
                showingResult = true;
                result.style.color = "rgba(255, 230, 30, 0.7)";
                break;
            case "random":
                enableEditingModeOnce("0");
                if(!randomStatus){
                    randomStatus = true;
                    randomMode(randomStatus);
                    item.innerHTML = "LOWER LIMIT";
                    operation.innerHTML = "Setting Random"
                    result.innerHTML = "0"
                }else{
                    if(randomRange.length < 2){
                        if(Number.isNaN(parseFloat(result.innerHTML))) return;
                        randomRange.push(result.innerHTML);
                        operation.innerHTML = `Lower Limit=${randomRange[0]}`;
                        result.innerHTML = "0"
                        item.innerHTML = "UPPER LIMIT"
                        if(randomRange.length === 2){
                            item.innerHTML = "GET RANDOM";
                            operation.innerHTML = `Upper Limit=${randomRange[1]}`;
                            randomMode(false);
                            convertToRegularOrExponent(randomRange);
                        }
                    }else{
                        const lower = Math.min(Number(randomRange[0]), Number(randomRange[1]));
                        const upper = Math.max(Number(randomRange[0]), Number(randomRange[1]));
                        operation.innerHTML = `Random(${lower}, ${upper})`
                        const randomNumber = [String(Math.random() * (upper-lower) + lower)];
                        convertToRegularOrExponent(randomNumber, 1);
                        result.innerHTML = randomNumber[0];
                    }
                }
                break;
        }
    }
});

function randomMode(status){
    const elements = document.getElementsByClassName("operator");
    for(let i=0; i<elements.length; i++){
        elements[i].disabled = status;
    }
    document.querySelector(".log").disabled = status;
    document.querySelector(".equal").disabled = status;
}

function enableEditingModeOnce(StartingNumber){
    if(showingResult){
        showingResult = false;
        result.innerHTML = StartingNumber;
        result.style.color = "rgba(0, 155, 255, 0.7)";
    }
}

function appendNumber(digit){
    if(Number.isNaN(parseFloat(result.innerHTML))) return;
    if(result.innerHTML.length >= maxResultCharacters) return;
    if(result.innerHTML === "0"){
        result.innerHTML = digit;
    }else{
        result.innerHTML += digit;
    }
}

function appendDecimalPoint(){
    if(Number.isNaN(parseFloat(result.innerHTML))) return;
    if(result.innerHTML.length >= maxResultCharacters-1) return;
    if(!result.innerHTML.includes("\.")) result.innerHTML += "."
}

function negate(){
    if(Number.isNaN(parseFloat(result.innerHTML))) return;
    if(result.innerHTML.length >= maxResultCharacters && Number(result.innerHTML) > 0) return;
    result.innerHTML = String(-Number(result.innerHTML));
}

function backspace(){
    if(Number.isNaN(parseFloat(result.innerHTML))) return;
    let size = result.innerHTML[0] !== "-" ? result.innerHTML.length : result.innerHTML.length - 1;
    result.innerHTML = size > 1 ? result.innerHTML.substring(0, result.innerHTML.length - 1) : "0";
}

function clearAll(){
    mathArr = ["0", "+", "0"];
    showingResult = false;
    randomRange = [];
    randomStatus = false;
    randomMode(false)
    document.querySelector(".random").innerHTML = "RANDOM";
    result.innerHTML = "0";
    operation.innerHTML = "0";
}

function performBasicMath(mathArr, nextOperator) {
    if(Number.isNaN(parseFloat(mathArr[0])) || Number.isNaN(parseFloat(mathArr[2]))) return;
    switch (mathArr[1]){
        case "+":
            mathArr[0] = String(Number(mathArr[0]) + Number(mathArr[2]));
            break;
        case "-":
            mathArr[0] = String(Number(mathArr[0]) - Number(mathArr[2]));
            break;
        case "*":
            mathArr[0] = String(Number(mathArr[0]) * Number(mathArr[2]));
            break;
        case "/":
            mathArr[0] = mathArr[2] !== "0" ? String(Number(mathArr[0]) / Number(mathArr[2])) : "Math Error";
            break;
        case "^":
            mathArr[0] = String(Math.pow(mathArr[0], mathArr[2]));
            break;
        case "log":
            mathArr[0] = mathArr[0] > 0 ? String(Math.log10(mathArr[0])) : "Math Error";
    }
    mathArr[1] = nextOperator;
    mathArr[2] = "0";
    convertToRegularOrExponent(mathArr, 2);
    console.log(mathArr)
}

function convertToRegularOrExponent(mathArr, increment){
    for(let i=0; i<mathArr.length; i+=increment){
        if(mathArr[i].length <= 15 || Number.isNaN(parseFloat(mathArr[i]))){
            continue;
        }
        let digitsAfterDecimal = 11;
        while(parseFloat(mathArr[i]).toExponential(digitsAfterDecimal).length >= 15){
            digitsAfterDecimal--;
        }
        mathArr[i] = parseFloat(mathArr[i]).toExponential(digitsAfterDecimal);
    }
}
