declare var gsap: any;

const select = document.getElementById("bracket-select");

select.addEventListener("change", function() {
    const element = document.getElementById("bracket-zone");
    element.innerHTML = "";
    const bracketId = (<HTMLSelectElement>select).value;
    endpointToHTMLElements(bracketId, element);
});

interface Game {
    match: number;
    round: number;
    losers: boolean;

    topTeam: string;
    topScore: number;
    topWinner: boolean;

    bottomTeam: string;
    bottomScore: number;
    bottomWinner: boolean;
}

function searchForBrackets(){
    const inputVal = (<HTMLInputElement>document.getElementById('input')).value;
    select.innerHTML = "";

    const inputSplit = inputVal.split('/');
    const splitLen = inputSplit.length;
    const tourneyId = inputSplit[splitLen-1].indexOf("info") !== -1 || inputSplit[splitLen-1] == "" 
        ? inputSplit[splitLen-2] 
        : inputSplit[splitLen-1];

    document.getElementById("bracket-zone").innerHTML = "";

    fetch(`https://api.battlefy.com/tournaments/${tourneyId}?extend%5Bcampaign%5D%5Bsponsor%5D=true&extend%5Bstages%5D%5B%24query%5D%5BdeletedAt%5D%5B%24exists%5D=false&extend%5Bstages%5D%5B%24opts%5D%5Bname%5D=1&extend%5Bstages%5D%5B%24opts%5D%5Bbracket%5D=1`)
    .then((response) => {
        return response.json();
    })
    .then((tourneyResponse) => {
        
        for(var i = 0; i < tourneyResponse[0].stages.length; i++){
            if (tourneyResponse[0].stages[i].bracket.type == "elimination"){
                const option = document.createElement("option");
                option.value = tourneyResponse[0].stages[i]._id;
                option.innerText = tourneyResponse[0].stages[i].name;
                select.appendChild(option);
            }
        }
        select.dispatchEvent(new Event('change'));

        gsap.fromTo("#options-pt2", {display: "flex", opacity: 0, scale: .75}, {opacity: 1, scale: 1});
    })
}

function endpointToHTMLElements(endpoint: string, element: HTMLElement){
    element.innerHTML = '';

    fetch(`https://api.battlefy.com/stages/${endpoint}/matches`)
    .then((response) => {
        return response.json();
    })
    .then((bracketResponse) => {
        
        let winnersGames: Game[] = [];
        let winnersHighestRound: number = 1;
        let losersGames: Game[] = [];
        let losersHighestRound: number = 1;
        
        for (var i = 0; i < bracketResponse.length; i++){
            const game: Game = jsonObjToGame(bracketResponse[i]);
            if (!game.losers){
                winnersGames.push(game);
                winnersHighestRound = Math.max(winnersHighestRound, game.round);
            } else {
                losersGames.push(game);
                losersHighestRound = Math.max(losersHighestRound, game.round);
            }
        }


        const winnersBracketElement = document.createElement("div");
        winnersBracketElement.classList.add("bracket-wrapper");
        const winnersRounds = Array.apply(null, Array(winnersHighestRound)).map(()=>{return []});

        for (var i = 0; i < winnersGames.length; i++){
            winnersRounds[winnersGames[i].round-1].push(winnersGames[i]);
        }

        for (var i = 0; i < winnersRounds.length; i++){
            const grid = document.createElement("div");
            grid.classList.add("grid-wrapper");

            const gridHeader = document.createElement("div");
            gridHeader.classList.add("grid-header");
            gridHeader.innerText = getRoundName(i+1, winnersRounds.length, true);
            grid.appendChild(gridHeader);

            for (var j = 0; j < winnersRounds[i].length; j++){
                grid.appendChild(gameToHTMLElement(winnersRounds[i][j]));
            }

            winnersBracketElement.appendChild(grid);
        }

        const losersBracketElement = document.createElement("div");

        if (losersGames.length > 0){

            losersBracketElement.classList.add("bracket-wrapper");
            const losersRounds = Array.apply(null, Array(losersHighestRound)).map(()=>{return []});

            var isThirdPlace: boolean = false;

            if (losersGames.length == 1){
                losersRounds[losersGames[0].round].push(losersGames[0]);
                isThirdPlace = true;
            } else {
                for (var i = 0; i < losersGames.length; i++){
                    losersRounds[losersGames[i].round - 1].push(losersGames[i]);
                }
            }

            for (var i = 0; i < losersRounds.length; i++){
                const grid = document.createElement("div");
                grid.classList.add("grid-wrapper");

                const gridHeader = document.createElement("div");
                gridHeader.classList.add("grid-header");
                
                if (isThirdPlace){
                    gridHeader.innerText = `Third Place`;
                } else {
                    gridHeader.innerText = getRoundName(i+1, losersRounds.length, false);
                }
                
                grid.appendChild(gridHeader);

                for (var j = 0; j < losersRounds[i].length; j++){
                    grid.appendChild(gameToHTMLElement(losersRounds[i][j]));
                }

                losersBracketElement.appendChild(grid);
            }
        }

        element.appendChild(winnersBracketElement);
        if (losersGames.length > 0){
            element.appendChild(losersBracketElement);
        }

        gsap.fromTo(".round-wrapper", {opacity: 0, scale: .8}, {opacity: 1, scale: 1, stagger:{amount: .3, grid: "auto", from: "start"}});
        gsap.fromTo(".grid-header", {opacity: 0}, {opacity: 1, stagger:{amount: .3, grid: "auto", from: "start"}});

    });
}

function jsonObjToGame(json): Game{
    var topTeam = json.top.team;
    if (topTeam === undefined) {
        topTeam = {name: "-"}
    }
    var topScore = json.top.score;
    if (topScore === undefined){
        topScore = "-";
    }
    var bottomTeam = json.bottom.team;
    if (bottomTeam === undefined) {
        bottomTeam = {name: "-"}
    }
    var bottomScore = json.bottom.score;
    if (bottomScore === undefined) { 
        bottomScore = "-";
    }

    // console.log(topName,topScore,bottomName,bottomScore);

    const game: Game = {
        match: json.matchNumber,
        round: json.roundNumber,
        losers: json.matchType == "loser",
        topTeam: topTeam.name,
        topScore: topScore,
        topWinner: json.top.winner,
        bottomTeam: bottomTeam.name,
        bottomScore: bottomScore,
        bottomWinner: json.bottom.winner
    };
    return game;
}

function gameToHTMLElement(game: Game): HTMLDivElement{
    const roundWrapper = document.createElement("div");
    roundWrapper.classList.add("round-wrapper");

    const topTeamWrapper = document.createElement("div");
    topTeamWrapper.classList.add("team-wrapper");

    const topTeamName = document.createElement("div");
    topTeamName.classList.add("team");
    topTeamName.innerText = game.topTeam;
    topTeamWrapper.appendChild(topTeamName);

    const topTeamScore = document.createElement("div");
    topTeamScore.classList.add("score");
    topTeamScore.innerText = game.topScore.toString();
    topTeamWrapper.appendChild(topTeamScore);

    roundWrapper.appendChild(topTeamWrapper);

    const bottomTeamWrapper = document.createElement("div");
    bottomTeamWrapper.classList.add("team-wrapper");

    const bottomTeamName = document.createElement("div");
    bottomTeamName.classList.add("team");
    bottomTeamName.innerText = game.bottomTeam;
    bottomTeamWrapper.appendChild(bottomTeamName);

    const bottomTeamScore = document.createElement("div");
    bottomTeamScore.classList.add("score");
    bottomTeamScore.innerText = game.bottomScore.toString();
    bottomTeamWrapper.appendChild(bottomTeamScore);

    roundWrapper.appendChild(bottomTeamWrapper);

    if (game.topWinner){
        topTeamWrapper.classList.add("winner");
    } else if (game.bottomWinner) {
        bottomTeamWrapper.classList.add("winner");
    }

    return roundWrapper;
}

function getRoundName(round: number, numRounds: number, isDoubleElim: boolean): string{
    if (isDoubleElim){
        if (round == numRounds){
            return "Reset";
        } else if (round == numRounds - 1){
            return "Finals";
        }
    } else if (round == numRounds){
        return "Finals";
    }
    return "Round " + round;
}