interface Game {
    topTeam: string;
    topScore: number;
    topWinner: boolean;

    bottomTeam: string;
    bottomScore: number;
    bottomWinner: boolean;
}

const tempEndpoint = "https://api.battlefy.com/stages/628ba4e331af073dcd3476da/matches";
let games: Game[] = [];


fetch(tempEndpoint)
.then((response) => {
    return response.json();
})
.then((bracketResponse) => {
    
    for (var i = 0; i < bracketResponse.length; i++){
        games.push(jsonObjToGame(bracketResponse[i]));
    }

});

function jsonObjToGame(json): Game{
    const game: Game = {
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