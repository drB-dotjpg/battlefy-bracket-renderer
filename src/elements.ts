function getDoubleEliminationElement(matches: BracketMatch[]) : HTMLElement{
    const element: HTMLElement = document.createElement("div");
    
    const winnersMatches: BracketMatch[] = [];
    const losersMatches: BracketMatch[] = [];
    
    for (var i = 0; i < matches.length; i++){
        if (matches[i].type == "winner"){
            winnersMatches.push(matches[i]);
        } else {
            losersMatches.push(matches[i]);
        }
    }

    const winnersElement: HTMLElement = getEliminationElement(winnersMatches, "winners");
    const losersElement: HTMLElement = getEliminationElement(losersMatches, "losers");

    element.appendChild(winnersElement);
    element.appendChild(losersElement);
    
    return element;
}

function getEliminationElement(matches: BracketMatch[], roundNaming?: "winners" | "losers") : HTMLElement {
    const element: HTMLElement = document.createElement("div");
    element.className = "elim-bracket-wrapper";

    const roundElims: HTMLElement[] = [];
    const roundsNum = Math.max(...matches.map(o => o.roundNumber));

    for (var i = 0; i < roundsNum; i++){
        const roundElim = document.createElement("div");
        roundElim.className = "elim-grid-wrapper";
        const roundHeader = document.createElement("div");
        roundHeader.className = "grid-header";

        if (roundNaming == "winners" && i == roundsNum - 2){
            roundHeader.innerText = "Grand Finals";
        } 
        else if (roundNaming == "winners" && i == roundsNum - 1){
            roundHeader.innerText = "Reset";
        }
        else if (roundNaming == "losers" && i == roundsNum - 1){
            roundHeader.innerText = "Losers Finals";
        }
        else if (i == roundsNum - 1){
            roundHeader.innerText = "Finals";
        }
        else {
            roundHeader.innerText = "Round " + (i+1);
        }

        roundElim.appendChild(roundHeader);
        roundElims.push(roundElim);
        element.appendChild(roundElim);
    }

    for (var i = 0; i < matches.length; i++){
        const elim = getEliminationStyleMatchElement(matches[i]);
        if (matches[i].roundNumber != 0){
            roundElims[matches[i].roundNumber-1].appendChild(elim);
        } else {
            elim.classList.add("elim-third")
            roundElims[roundElims.length-1].appendChild(elim);
        }
    }

    return element;
}

function getEliminationStyleMatchElement(match: BracketMatch): HTMLElement {
    const element = document.createElement("div");
    element.className = "elim-round-wrapper";

    if (match.topWinner || match.bottomWinner){
        element.dataset.roundStatus = "finished";
    } else if (match.topName !== undefined || match.bottomName !== undefined){
        element.dataset.roundStatus = "in-progress"
    } else {
        element.dataset.roundStatus = "not-started";
    }

    const topTeam = document.createElement("div");
    topTeam.className = "team-wrapper";

    if (match.topWinner){
        topTeam.classList.add("winner");
    }
    
    const topName = document.createElement("div");
    topName.className = "team";
    topName.innerText = match.topName !== undefined ? match.topName : "-";

    const topScore = document.createElement("div");
    topScore.className = "score";
    topScore.innerText = match.topScore !== undefined ? match.topScore.toString() : "-";

    topTeam.appendChild(topName);
    topTeam.appendChild(topScore);

    const bottomTeam = document.createElement("div");
    bottomTeam.className = "team-wrapper";

    if (match.bottomWinner) {
        bottomTeam.classList.add("winner");
    }

    const bottomName = document.createElement("div");
    bottomName.className = "team";
    bottomName.innerText = match.bottomName !== undefined ? match.bottomName : "-";

    const bottomScore = document.createElement("div");
    bottomScore.className = "score";
    bottomScore.innerText = match.bottomScore !== undefined ? match.bottomScore.toString() : "-";

    bottomTeam.appendChild(bottomName);
    bottomTeam.appendChild(bottomScore);

    element.appendChild(topTeam);
    element.appendChild(bottomTeam);

    return element;
}

function getSwissElement(matches: BracketMatch[], round: number): HTMLElement {
    const element = document.createElement("div");
    element.className = "swiss-bracket-wrapper";

    for (var i = 0; i < matches.length; i++){
        if (matches[i].roundNumber == round){
            element.appendChild(getSwissStyleMatchElement(matches[i]));
        }
    }

    return element;
}

function getSwissStyleMatchElement(match: BracketMatch): HTMLElement {
    const element = document.createElement("div");
    element.className = "swiss-round-wrapper";

    if (match.topWinner || match.bottomWinner){
        element.dataset.roundStatus = "finished";
    } else if (match.topName !== undefined || match.bottomName !== undefined){
        element.dataset.roundStatus = "in-progress"
    } else {
        element.dataset.roundStatus = "not-started";
    }

    const topTeam = document.createElement("div");
    topTeam.className = "team-wrapper";

    if (match.topWinner){
        topTeam.classList.add("winner");
    }
    
    const topName = document.createElement("div");
    topName.className = "team";
    topName.innerText = match.topName !== undefined ? match.topName : "-";

    const topScore = document.createElement("div");
    topScore.className = "score";
    topScore.innerText = match.topScore !== undefined ? match.topScore.toString() : "-";

    topTeam.appendChild(topName);
    topTeam.appendChild(topScore);

    const bottomTeam = document.createElement("div");
    bottomTeam.className = "team-wrapper";

    if (match.bottomWinner) {
        bottomTeam.classList.add("winner");
    }

    const bottomName = document.createElement("div");
    bottomName.className = "team";
    bottomName.innerText = match.bottomName !== undefined ? match.bottomName : "-";

    const bottomScore = document.createElement("div");
    bottomScore.className = "score";
    bottomScore.innerText = match.bottomScore !== undefined ? match.bottomScore.toString() : "-";

    bottomTeam.appendChild(bottomName);
    bottomTeam.appendChild(bottomScore);

    element.appendChild(topTeam);
    element.appendChild(bottomTeam);

    return element;
}