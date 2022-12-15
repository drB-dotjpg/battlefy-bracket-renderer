declare var gsap: any;

const select = document.getElementById("bracket-select");
var brackets : BracketInfo[];

select.addEventListener("change", async function() {
    const element = document.getElementById("bracket-zone");
    element.innerHTML = "";
    const camera = document.createElement("div");
    camera.id = "camera";
    element.appendChild(camera);

    const bracket = brackets[parseInt((<HTMLSelectElement>select).value)];
    const matches = await getBracketMatches(bracket);

    switch(bracket.type){
        case "elimination":
            if (bracket.style == "double"){
                camera.appendChild(getDoubleEliminationElement(matches));
            } else {
                camera.appendChild(getEliminationElement(matches));
            }
    }
    
    showAll(true);
});

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

    gsap.fromTo("#options-pt2", {display: "flex", opacity: 0, scale: .75}, {opacity: 1, scale: 1});
}