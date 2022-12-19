declare var gsap: any;

const select = document.getElementById("bracket-select");
var brackets : BracketInfo[];

select.addEventListener("change", async function() {
    await updateBracket();
});

async function updateBracket(roundNum: number = 1){
    const element = document.getElementById("bracket-zone");
    element.innerHTML = "";
    const camera = document.createElement("div");
    camera.id = "camera";
    camera.style.transform = "translate(0px,0px)"; //this fixes a bug ???? LOL
    element.appendChild(camera);

    const bracket = brackets[parseInt((<HTMLSelectElement>select).value)];
    const matches = bracket.type != "roundrobin" ? await getBracketMatches(bracket) : await getRoundRobinMatches(bracket);

    switch(bracket.type){
        case "elimination":
            if (bracket.style == "double"){
                camera.appendChild(getDoubleEliminationElement(matches));
                showControl("double-elim");
                updateCamera("double-elim", true);
            } else {
                camera.appendChild(getEliminationElement(matches));
                showControl("elim");
                updateCamera("elim", true)
            }
            break;
        case "swiss":
            camera.appendChild(getSwissElement(matches, roundNum));
            showControl("swiss");
            if (roundNum == 1){
                addSwissRoundControls(matches[matches.length-1].roundNumber);
            }
            updateCamera("swiss", true);
            break;
        case "roundrobin":
            camera.appendChild(getRoundRobinElement(matches, roundNum));
            showControl("groups");
            updateCamera("groups", true);
            break;
    }
}

async function searchForBrackets(){
    const inputVal = (<HTMLInputElement>document.getElementById('input')).value;
    select.innerHTML = "";

    document.getElementById("bracket-zone").innerHTML = "";
        
    brackets = await getAllBracketInfo(inputVal);
    for (var i = 0; i < brackets.length; i++){
        const option = document.createElement("option");
        option.value = i.toString();
        option.innerText = brackets[i].name
        select.appendChild(option);
    }

    select.dispatchEvent(new Event('change'));

    gsap.fromTo("#options-pt2", {display: "block", opacity: 0, scale: .75}, {opacity: 1, scale: 1});
}

function showControl(type: "elim" | "double-elim" | "swiss" | "groups"){
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
    await updateBracket(parseInt(swissRound.value))
});