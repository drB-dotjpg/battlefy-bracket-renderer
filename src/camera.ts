declare var gsap: any;
const tl = gsap.timeline();

function showAll(noAnim: boolean = false){
    const root = document.getElementById("bracket-zone");
    const camera = document.getElementById("camera");
    const bracket = camera.firstChild as HTMLElement;
    bracket.style.transformOrigin = "top left";


    const bWidth = bracket.offsetWidth;
    const bHeight = bracket.offsetHeight;

    var scale = 1;
    if (bWidth > root.offsetWidth || bWidth < root.offsetWidth){
        scale = (root.offsetWidth/bWidth) * .98;
    }
    if (bHeight > root.offsetHeight || bHeight < root.offsetHeight){
        scale = (root.offsetHeight/bHeight) * .98;
    }

    
    moveCamera(
        bracket,
        (root.clientWidth - camera.clientWidth * scale) / 2,
        (root.clientHeight - camera.clientHeight * scale) / 2,
        scale,
        noAnim
    );
}

function showInProgress(){
    const root = document.getElementById("bracket-zone");
    var elementsOfInterest = root.querySelectorAll("div[data-round-status=\"in-progress\"]");
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

function centerOnElements(elementsOfInterest: NodeListOf<Element>){
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
    if (targetWidth > root.clientWidth || targetWidth < root.clientWidth){
        scale = Math.min(((root.clientWidth/targetWidth) * .85), 2);
    }
    if (targetHeight > root.clientHeight || targetHeight < root.clientHeight){
        scale = Math.min(((root.clientHeight/targetHeight) * .85), 2);
    }

    moveCamera(
        bracket,
        (root.clientWidth - maxWidth*scale - minWidth*scale ) / 2,
        (root.clientHeight - maxHeight*scale - minHeight*scale) / 2,
        scale
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

//for debug
function setBound(x: number, y: number, w: number, h: number){
    const bound = document.getElementById("bound");
    bound.style.transform = `translate(${x}px, ${y}px)`
    bound.style.width = w + "px";
    bound.style.height = h + "px"
}