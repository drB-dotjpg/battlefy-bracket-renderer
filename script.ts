declare var gsap: any;

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

function generateOnClick(){
    const inputVal = (<HTMLInputElement>document.getElementById('input')).value;
    const bracketZone = document.getElementById('bracket-zone');
    endpointToHTMLElements(inputVal, bracketZone);
}

function endpointToHTMLElements(endpoint: string, element: HTMLElement){
    fetch(`https://api.battlefy.com/stages/${endpoint}/matches`)
    .then((response) => {
        return response.json();
    })
    .then((bracketResponse) => {
        
        let winnersGames: Game[] = [];
        let winnersHighestRound: number = 0;
        let losersGames: Game[] = [];
        let losersHighestRound: number = 0;
        
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
            gridHeader.innerText = `Round ${i+1}`;
            grid.appendChild(gridHeader);

            for (var j = 0; j < winnersRounds[i].length; j++){
                grid.appendChild(gameToHTMLElement(winnersRounds[i][j]));
            }

            winnersBracketElement.appendChild(grid);
        }


        const losersBracketElement = document.createElement("div");
        losersBracketElement.classList.add("bracket-wrapper");
        const losersRounds = Array.apply(null, Array(losersHighestRound)).map(()=>{return []});

        for (var i = 0; i < losersGames.length; i++){
            losersRounds[losersGames[i].round-1].push(losersGames[i]);
        }

        for (var i = 0; i < losersRounds.length; i++){
            const grid = document.createElement("div");
            grid.classList.add("grid-wrapper");

            const gridHeader = document.createElement("div");
            gridHeader.classList.add("grid-header");
            gridHeader.innerText = `Round ${i+1}`;
            grid.appendChild(gridHeader);

            for (var j = 0; j < losersRounds[i].length; j++){
                grid.appendChild(gameToHTMLElement(losersRounds[i][j]));
            }

            losersBracketElement.appendChild(grid);
        }

        element.appendChild(winnersBracketElement);
        if (losersGames.length > 0){
            element.appendChild(losersBracketElement);
        }

        gsap.fromTo(".round-wrapper", {scale: 0}, {scale: 1, stagger:{amount: 1.5, grid: "auto", from: "start"}});
        gsap.fromTo(".grid-header", {opacity: 0}, {opacity: 1, stagger:{amount: 1.5, grid: "auto", from: "start"}});

    });
}

function jsonObjToGame(json): Game{
    const game: Game = {
        match: json.matchNumber,
        round: json.roundNumber,
        losers: json.matchType == "loser",
        topTeam: json.top.team.name,
        topScore: json.top.score,
        topWinner: json.top.winner,
        bottomTeam: json.bottom.team.name,
        bottomScore: json.bottom.score,
        bottomWinner: json.bottom.winner
    }
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