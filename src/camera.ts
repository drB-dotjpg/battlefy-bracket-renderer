declare var gsap: any;
const tl = gsap.timeline();

function updateCamera(bracketType: "elim" | "double-elim" | "swiss" | "roundrobin", animIn: boolean = false){
    var camFocusVal = (document.querySelector('input[name="cam-focus"]:checked') as HTMLSelectElement).value;
    console.log(animIn);

    switch(bracketType){
        case "elim":
            if(camFocusVal == "all"){
                showAll(animIn);
            } else if (camFocusVal == "in-progress") {
                showInProgress();
            } else if (camFocusVal == "finished"){
                showFinished();
            }
        break;

        case "double-elim":
            const bracketFocusVal = (document.querySelector('input[name="de-bracket-cam"]:checked') as HTMLSelectElement).value;
            if(camFocusVal == "all"){
                showAllDE(bracketFocusVal, animIn);
            } else if (camFocusVal == "in-progress") {
                showInProgressDE(bracketFocusVal);
            } else if (camFocusVal == "finished"){
                showFinishedDE(bracketFocusVal);
            }
        break;

        case "swiss":
            sortGroups();
            if(camFocusVal == "all"){
                groupRoundVisibility("all");
                showAll(animIn);
            } else if (camFocusVal == "in-progress") {
                groupRoundVisibility("in-progress");
            } else if (camFocusVal == "finished"){
                groupRoundVisibility("finished");
            }
        break;

        case "roundrobin":
            sortGroups();
            if(camFocusVal == "all"){
                groupRoundVisibility("all");
                showAll(animIn);
            } else if (camFocusVal == "in-progress") {
                groupRoundVisibility("in-progress");
            } else if (camFocusVal == "finished"){
                groupRoundVisibility("finished");
            }
        break;
    }

    if (animIn){
        tl.fromTo([".group-round-wrapper", ".elim-round-wrapper"], {
            opacity: 0,
            scale: .8
        }, {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            duration: .5,
            stagger: .025
        })
        .fromTo([".group-header", ".grid-header"], {
            opacity: 0
        }, {
            opacity: 1,
            ease: "power2.out",
            duration: 1
        }, "<");
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
        deUpdateBracketVisability(bracket);
        return;
    }

    var bracketOfInterest;
    if (bracket == "winners"){
        bracketOfInterest = document.querySelectorAll(".bracket[data-bracket-type=winners]");
        centerOnElements(bracketOfInterest, noAnim);
        deUpdateBracketVisability(bracket);
    } else if (bracket == "losers"){
        bracketOfInterest = document.querySelectorAll(".bracket[data-bracket-type=losers]");
        centerOnElements(bracketOfInterest, noAnim);
        deUpdateBracketVisability(bracket);
    }
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
        deUpdateBracketVisability(bracket);
        return;
    }

    const bracketOfInterest = document.querySelector(`.bracket[data-bracket-type=${bracket}]`);
    var elementsOfInterest = bracketOfInterest.querySelectorAll("div[data-round-status=\"in-progress\"]");

    if (elementsOfInterest.length <= 0){
        return;
    }
    centerOnElements(elementsOfInterest);
    deUpdateBracketVisability(bracket);
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
        deUpdateBracketVisability(bracket);
        return;
    }

    const bracketOfInterest = document.querySelector(`.bracket[data-bracket-type=${bracket}]`);
    var elementsOfInterest = bracketOfInterest.querySelectorAll("div[data-round-status=\"finished\"]");

    if (elementsOfInterest.length <= 0){
        return;
    }
    centerOnElements(elementsOfInterest);
    deUpdateBracketVisability(bracket);
}

function centerOnElements(elementsOfInterest: NodeListOf<Element>, noAnim: boolean = false){
    const root = document.getElementById("bracket-zone");

    var maxWidth = 0;
    var minWidth = Number.MAX_SAFE_INTEGER;
    var maxHeight = 0;
    var minHeight = Number.MAX_SAFE_INTEGER;

    for (var i = 0; i < elementsOfInterest.length; i++){
        const elim = elementsOfInterest[i] as HTMLElement;
        const pos = getPosOfElement(root, elim);
        // console.log(elementsOfInterest[i], pos);

        maxWidth = Math.max(...pos[0], maxWidth);
        minWidth = Math.min(...pos[0], minWidth);
        maxHeight = Math.max(...pos[1], maxHeight);
        minHeight = Math.min(...pos[1], minHeight);
    }

    // console.log(maxWidth, minWidth, maxHeight, minHeight);

    const targetWidth = maxWidth - minWidth;
    const targetHeight = maxHeight - minHeight;
    var scale = 1;
    
    if (targetWidth > root.clientWidth){
        scale = (root.clientWidth / Math.max(targetWidth, 500)) * .97;
        // console.log("fit via width");

        if (targetHeight * scale > root.clientHeight){
            scale = (root.clientHeight / Math.max(targetHeight, 500)) * .97;
            // console.log("then fit via height");
        }
    }
    else {
        scale = (root.clientHeight / Math.max(targetHeight, 500)) * .97;
        // console.log("fit via height");
        
        if (targetWidth * scale > root.clientWidth){
            scale = (root.clientWidth / Math.max(targetWidth, 500)) * .97;
            // console.log("then fit via width");
        }
    }

    moveCamera(
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

function moveCamera(x: number, y: number, scale: number, instant: boolean = false){
    tl.to("#camera", {
        x: x,
        y: y,
        duration: instant ? 0 : 1.5,
        ease: "power2.inOut"
    })
    .to("#zoom", {
        scale: scale,
        duration: instant ? 0 : 1.5,
        ease: "power2.inOut"
    }, "<");
}

function deUpdateBracketVisability(bracket: string) {
    tl.to(".bracket[data-bracket-type=losers]", {
        opacity: bracket != "winners" ? 1 : 0,
        duration: 1
    }, "<");
    tl.to(".bracket[data-bracket-type=winners]", {
        opacity: bracket != "losers" ? 1 : 0,
        duration: 1
    }, "<");
}

function sortGroups(){
    function comparator(a: HTMLElement, b: HTMLElement) {
        if (a.dataset.roundStatus == "in-progress" && b.dataset.roundStatus != "in-progress"){
            return 1;
        } if (a.dataset.roundStatus == b.dataset.roundStatus) { 
            return 0;
        } else {
            return -1;
        }
    }

    const groups = document.querySelectorAll(".group-bracket-wrapper");
    for (var i = 0; i < groups.length; i++){
        const rounds = groups[i].querySelectorAll("[data-round-status]");
        const roundsSorted = Array.from(rounds).sort(comparator);
        roundsSorted.forEach(e => groups[i].appendChild(e));
    }
}

function groupRoundVisibility(focus: "all" | "in-progress" | "finished"){
    switch (focus) {
        case "all":
            gsap.to("[data-round-status]", {
                duration: .25,
                opacity: 1
            });
            break;
        case "in-progress":
            gsap.to("[data-round-status=\"in-progress\"]", {
                duration: .25,
                opacity: 1
            })
            gsap.to("[data-round-status=\"finished\"]", {
                duration: .25,
                opacity: .4
            });
            break;
        case "finished":
            gsap.to("[data-round-status=\"finished\"]", {
                duration: .25,
                opacity: 1
            })
            gsap.to("[data-round-status=\"in-progress\"]", {
                duration: .25,
                opacity: .4
            });
            break;
    }
}