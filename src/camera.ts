declare var gsap: any;
const tl = gsap.timeline();

function updateCamera(bracketType: "elim" | "double-elim" | "swiss" | "groups", noAnim: boolean = false){
    var camFocusVal = (document.querySelector('input[name="cam-focus"]:checked') as HTMLSelectElement).value;

    //i hope you like nested code (remember this is just a prototype!)
    switch(bracketType){
        case "elim":
            if(camFocusVal == "all"){
                showAll(noAnim);
            } else if (camFocusVal == "in-progress") {
                showInProgress();
            } else if (camFocusVal == "finished"){
                showFinished();
            }
        break;

        case "double-elim":
            const bracketFocusVal = (document.querySelector('input[name="de-bracket-cam"]:checked') as HTMLSelectElement).value;
            if(camFocusVal == "all"){
                showAllDE(bracketFocusVal, noAnim);
            } else if (camFocusVal == "in-progress") {
                showInProgressDE(bracketFocusVal);
            } else if (camFocusVal == "finished"){
                showFinishedDE(bracketFocusVal);
            }
        break;

        case "swiss":
            if(camFocusVal == "all"){
                
            } else if (camFocusVal == "in-progress") {

            } else if (camFocusVal == "finished"){
                
            }
        break;

        case "groups":
            if(camFocusVal == "all"){

            } else if (camFocusVal == "in-progress") {

            } else if (camFocusVal == "finished"){
                
            }
        break;
    }
}

function showAll(noAnim: boolean = false){
    const root = document.getElementById("bracket-zone");
    var camera = root.querySelectorAll(".bracket");

    centerOnElements(camera, noAnim);
}

function showAllDE(bracket: string, noAnim: boolean = false){
    if (bracket == "both"){
        showAll(noAnim);
        return;
    }

    const bracketOfInterest = document.querySelectorAll(`.bracket[data-bracket-type=${bracket}]`);
    centerOnElements(bracketOfInterest, noAnim)
}

function showInProgress(){
    const root = document.getElementById("bracket-zone");
    var elementsOfInterest = root.querySelectorAll("div[data-round-status=\"in-progress\"]");

    if (elementsOfInterest.length <= 0){
        return;
    }
    centerOnElements(elementsOfInterest);
}

function showInProgressDE(bracket: string){
    if (bracket == "both"){
        showInProgress();
        return;
    }

    const bracketOfInterest = document.querySelector(`.bracket[data-bracket-type=${bracket}]`);
    var elementsOfInterest = bracketOfInterest.querySelectorAll("div[data-round-status=\"in-progress\"]");

    if (elementsOfInterest.length <= 0){
        return;
    }
    centerOnElements(elementsOfInterest);
}

function showFinished(){
    const root = document.getElementById("bracket-zone");
    var elementsOfInterest = root.querySelectorAll("div[data-round-status=\"finished\"]");
    if (elementsOfInterest.length <= 0){
        return;
    }
    centerOnElements(elementsOfInterest);
}

function showFinishedDE(bracket: string){
    if (bracket == "both"){
        showFinished();
        return;
    }

    const bracketOfInterest = document.querySelector(`.bracket[data-bracket-type=${bracket}]`);
    var elementsOfInterest = bracketOfInterest.querySelectorAll("div[data-round-status=\"finished\"]");

    if (elementsOfInterest.length <= 0){
        return;
    }
    centerOnElements(elementsOfInterest);
}

function centerOnElements(elementsOfInterest: NodeListOf<Element>, noAnim: boolean = false){
    const root = document.getElementById("bracket-zone");
    const camera = document.getElementById("camera");
    const bracket = camera.firstChild as HTMLElement;
    bracket.style.transformOrigin = "top left";

    var maxWidth = 0;
    var minWidth = root.clientWidth;
    var maxHeight = 0;
    var minHeight = root.clientHeight;

    for (var i = 0; i < elementsOfInterest.length; i++){
        const elim = elementsOfInterest[i] as HTMLElement;
        const pos = getPosOfElement(root, elim);
        console.log(elementsOfInterest[i], pos);

        maxWidth = Math.max(...pos[0], maxWidth);
        minWidth = Math.min(...pos[0], minWidth);
        maxHeight = Math.max(...pos[1], maxHeight);
        minHeight = Math.min(...pos[1], minHeight);
    }

    console.log(maxWidth, minWidth, maxHeight, minHeight);

    const targetWidth = maxWidth - minWidth;
    const targetHeight = maxHeight - minHeight;
    var scale = 1;
    console.log(targetWidth, root.clientWidth);
    if (targetWidth > root.clientWidth){
        scale = (root.clientWidth/targetWidth) * .98;
        console.log("width fit");
    }
    else {
    // if (targetHeight < root.clientHeight){
        scale = (root.clientHeight/targetHeight) * .98;
        console.log("height fit");
        if (targetWidth * scale > root.clientWidth){
            scale = (root.clientWidth/targetWidth) * .98;
            console.log("width fit 2");
        }
    }

    moveCamera(
        bracket,
        (root.clientWidth - maxWidth*scale - minWidth*scale ) / 2,
        (root.clientHeight - maxHeight*scale - minHeight*scale) / 2,
        scale,
        noAnim
    );
}

function getPosOfElement(root: HTMLElement, elim: HTMLElement) : number[][] {
    return [
        [elim.offsetLeft, elim.offsetLeft + elim.clientWidth],
        [elim.offsetTop, elim.offsetTop + elim.clientHeight]
    ];
}

function moveCamera(elim: HTMLElement, x: number, y: number, scale: number, instant: boolean = false){
    const camera = document.getElementById("camera");
    tl.to(camera, {
        x: x,
        y: y,
        duration: instant ? 0 : 1,
        ease: "power2.inOut"
    })
    .to(elim, {
        scale: scale,
        duration: instant ? 0 : 1,
        ease: "power2.inOut"
    }, "<");
}