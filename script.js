var tempEndpoint = "https://api.battlefy.com/stages/628ba4e331af073dcd3476da/matches";
endpointToHTMLElements(tempEndpoint, document.body);
function endpointToHTMLElements(endpoint, element) {
    fetch(endpoint)
        .then(function (response) {
        return response.json();
    })
        .then(function (bracketResponse) {
        var winnersGames = [];
        var winnersHighestRound = 0;
        var losersGames = [];
        var losersHighestRound = 0;
        for (var i = 0; i < bracketResponse.length; i++) {
            var game = jsonObjToGame(bracketResponse[i]);
            if (!game.losers) {
                winnersGames.push(game);
                winnersHighestRound = Math.max(winnersHighestRound, game.round);
            }
            else {
                losersGames.push(game);
                losersHighestRound = Math.max(losersHighestRound, game.round);
            }
        }
        var winnersBracketElement = document.createElement("div");
        winnersBracketElement.classList.add("bracket-wrapper");
        var winnersRounds = Array.apply(null, Array(winnersHighestRound)).map(function () { return []; });
        for (var i = 0; i < winnersGames.length; i++) {
            winnersRounds[winnersGames[i].round - 1].push(winnersGames[i]);
        }
        for (var i = 0; i < winnersRounds.length; i++) {
            var grid = document.createElement("div");
            grid.classList.add("grid-wrapper");
            var gridHeader = document.createElement("div");
            gridHeader.classList.add("grid-header");
            gridHeader.innerText = "Round ".concat(i + 1);
            grid.appendChild(gridHeader);
            for (var j = 0; j < winnersRounds[i].length; j++) {
                grid.appendChild(gameToHTMLElement(winnersRounds[i][j]));
            }
            winnersBracketElement.appendChild(grid);
        }
        var losersBracketElement = document.createElement("div");
        losersBracketElement.classList.add("bracket-wrapper");
        var losersRounds = Array.apply(null, Array(losersHighestRound)).map(function () { return []; });
        for (var i = 0; i < losersGames.length; i++) {
            losersRounds[losersGames[i].round - 1].push(losersGames[i]);
        }
        for (var i = 0; i < losersRounds.length; i++) {
            var grid = document.createElement("div");
            grid.classList.add("grid-wrapper");
            var gridHeader = document.createElement("div");
            gridHeader.classList.add("grid-header");
            gridHeader.innerText = "Round ".concat(i + 1);
            grid.appendChild(gridHeader);
            for (var j = 0; j < losersRounds[i].length; j++) {
                grid.appendChild(gameToHTMLElement(losersRounds[i][j]));
            }
            losersBracketElement.appendChild(grid);
        }
        element.appendChild(winnersBracketElement);
        if (losersGames.length > 0) {
            element.appendChild(losersBracketElement);
        }
    });
}
function jsonObjToGame(json) {
    var game = {
        match: json.matchNumber,
        round: json.roundNumber,
        losers: json.matchType == "loser",
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
