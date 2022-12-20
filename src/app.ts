declare var gsap: any;

const select = document.getElementById("bracket-select");
var brackets : BracketInfo[];
var currentBracket: BracketInfo = undefined;

async function updateBracket(){
    const camera = document.getElementById("camera");
    const zoom = document.getElementById("zoom");

    const bracket = brackets[parseInt((<HTMLSelectElement>select).value)];
    const matches = bracket.type != "roundrobin" ? await getBracketMatches(bracket) : await getRoundRobinMatches(bracket);

    const animate = !areBracketsEqual(bracket, currentBracket);
    currentBracket = bracket;

    if (animate){
        camera.style.transform = "translate(0px,0px)";
        zoom.style.transform = "scale(0,0)";
    }

    zoom.innerHTML = '';

    switch(bracket.type){
        case "elimination":
            if (bracket.style == "double"){
                zoom.appendChild(getDoubleEliminationElement(matches));
                showControl("double-elim");
                updateCamera("double-elim", animate);
            } else {
                zoom.appendChild(getEliminationElement(matches));
                showControl("elim");
                updateCamera("elim", animate)
            }
            break;
        case "swiss":
            var roundNum = parseInt(swissRound.value);
            console.log(roundNum);
            if (isNaN(roundNum)){
                addSwissRoundControls(matches[matches.length-1].roundNumber);
                roundNum = 1;
            }

            zoom.appendChild(getSwissElement(matches, roundNum));
            showControl("swiss");
            updateCamera("swiss", animate);
            break;
        case "roundrobin":
            var roundNum = parseInt(roundRobinRound.value);
            if (isNaN(roundNum)){
                addRoundRobinRoundControls(matches[matches.length-1].roundNumber);
                roundNum = 1;
            }

            zoom.appendChild(getRoundRobinElement(matches, roundNum));
            showControl("roundrobin");
            updateCamera("roundrobin", animate);
            break;
    }
}

async function searchForBrackets(){
    const inputVal = (<HTMLInputElement>document.getElementById('input')).value;
    select.innerHTML = "";
        
    brackets = await getAllBracketInfo(inputVal);
    for (var i = 0; i < brackets.length; i++){
        const option = document.createElement("option");
        option.value = i.toString();
        option.innerText = brackets[i].name
        select.appendChild(option);
    }

    select.dispatchEvent(new Event('change'));

    gsap.fromTo("#options-pt2", {display: "block", opacity: 0, scale: .75}, {opacity: 1, scale: 1});
    updateBracket();
}

function showControl(type: "elim" | "double-elim" | "swiss" | "roundrobin"){
    const allControls = document.querySelectorAll(".controls");
    for (var i = 0; i < allControls.length; i++){
        if (allControls[i].id == "controls-" + type || allControls[i].id == "cam-controls"){
            (allControls[i] as HTMLElement).style.display = "flex";
        } else {
            (allControls[i] as HTMLElement).style.display = "none";
        }
    }
}

function addSwissRoundControls(rounds: number){
    const selector = document.getElementById("swiss-round-select");
    selector.innerHTML = '';
    for (var i = 0; i < rounds; i++){
        const option = document.createElement("option");
        option.value = (i+1).toString();
        option.innerText = (i+1).toString();
        selector.appendChild(option);
    }
}

const swissRound = document.getElementById("swiss-round-select") as HTMLSelectElement;
swissRound.addEventListener("change", async function(){
    await updateBracket();
});

function addRoundRobinRoundControls(rounds: number){
    const selector = document.getElementById("roundrobin-round-select");
    selector.innerHTML = '';
    for (var i = 0; i < rounds; i++){
        const option = document.createElement("option");
        option.value = (i+1).toString();
        option.innerText = (i+1).toString();
        selector.appendChild(option);
    }
}

const roundRobinRound = document.getElementById("roundrobin-round-select") as HTMLSelectElement;
roundRobinRound.addEventListener("change", async function(){
    await updateBracket();
});

function areBracketsEqual(bracket1: BracketInfo, bracket2: BracketInfo){
    if (bracket1 === undefined || bracket2 === undefined){
        return false;
    }
    return bracket1.id == bracket2.id;
}