function showAll(){
    const root = document.getElementById("bracket-zone");
    const bracket = root.firstChild as HTMLElement;
    bracket.style.transformOrigin = "top";

    const bWidth = bracket.offsetWidth;
    const bHeight = bracket.offsetHeight;

    if (bWidth > 1920 || bWidth < 1920){
        bracket.style.scale = (1920/bWidth).toString();
    }
    if (bHeight > 1080 || bHeight < 1080){
        bracket.style.scale = (1080/bHeight).toString();
    }
}