var tempEndpoint = "https://api.battlefy.com/stages/628ba4e331af073dcd3476da/matches";
var games = [];
fetch(tempEndpoint)
    .then(function (response) {
    return response.json();
})
    .then(function (bracketResponse) {
    for (var i = 0; i < bracketResponse.length; i++) {
        games.push(jsonObjToGame(bracketResponse[i]));
    }
});
function jsonObjToGame(json) {
    var game = {
        topTeam: json.top.team.name,
        topScore: json.top.score,
        topWinner: json.top.winner,
        bottomTeam: json.bottom.team.name,
        bottomScore: json.bottom.score,
        bottomWinner: json.bottom.winner
    };
    return game;
}
function gameToHTMLElement(game) {
    var roundWrapper = document.createElement("div");
    roundWrapper.classList.add("round-wrapper");
    var topTeamWrapper = document.createElement("div");
    topTeamWrapper.classList.add("team-wrapper");
    var topTeamName = document.createElement("div");
    topTeamName.classList.add("team");
    topTeamName.innerText = game.topTeam;
    topTeamWrapper.appendChild(topTeamName);
    var topTeamScore = document.createElement("div");
    topTeamScore.classList.add("score");
    topTeamScore.innerText = game.topScore.toString();
    topTeamWrapper.appendChild(topTeamScore);
    roundWrapper.appendChild(topTeamWrapper);
    var bottomTeamWrapper = document.createElement("div");
    bottomTeamWrapper.classList.add("team-wrapper");
    var bottomTeamName = document.createElement("div");
    bottomTeamName.classList.add("team");
    bottomTeamName.innerText = game.bottomTeam;
    bottomTeamWrapper.appendChild(bottomTeamName);
    var bottomTeamScore = document.createElement("div");
    bottomTeamScore.classList.add("score");
    bottomTeamScore.innerText = game.bottomScore.toString();
    bottomTeamWrapper.appendChild(bottomTeamScore);
    roundWrapper.appendChild(bottomTeamWrapper);
    if (game.topWinner) {
        topTeamWrapper.classList.add("winner");
    }
    else if (game.bottomWinner) {
        bottomTeamWrapper.classList.add("winner");
    }
    return roundWrapper;
}
