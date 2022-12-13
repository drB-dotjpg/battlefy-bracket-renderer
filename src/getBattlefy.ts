async function getAllBracketInfo(url) : Promise<BracketInfo[]>{
    const inputSplit = url.split('/');
    const splitLen = inputSplit.length;
    const tourneyId = inputSplit[splitLen-1].indexOf("info") !== -1 || inputSplit[splitLen-1] == "" 
        ? inputSplit[splitLen-2] 
        : inputSplit[splitLen-1];

    var brackets: BracketInfo[] = [];

    return fetch(`https://api.battlefy.com/tournaments/${tourneyId}?extend%5Bcampaign%5D%5Bsponsor%5D=true&extend%5Bstages%5D%5B%24query%5D%5BdeletedAt%5D%5B%24exists%5D=false&extend%5Bstages%5D%5B%24opts%5D%5Bname%5D=1&extend%5Bstages%5D%5B%24opts%5D%5Bbracket%5D=1`)
    .then((response) => {
        return response.json();
    })
    .then((tourneyResponse) => {
        
        for(var i = 0; i < tourneyResponse[0].stages.length; i++){
            const stage = tourneyResponse[0].stages[i];
            var bracket;

            if (stage.bracket.type == "elimination"){
                bracket = {
                    id: stage._id,
                    name: stage.name,
                    type: stage.bracket.type,
                    totalRounds: stage.bracket.roundsCount,
                    currentRound: stage.bracket.currentRoundNumber,
                    style: stage.bracket.style
                };
            } else {
                bracket = {
                    id: stage._id,
                    name: stage.name,
                    type: stage.bracket.type,
                    totalRounds: stage.bracket.roundsCount,
                    currentRound: stage.bracket.currentRoundNumber,
                };
            }

            brackets.push(bracket);
        }

        return brackets;
    });
}

async function getBracketMatches(bracket: BracketInfo) : Promise<BracketMatch[]> {
    var matches: BracketMatch[] = [];

    return fetch(`https://api.battlefy.com/stages/${bracket.id}/matches`)
    .then((response) => {
        return response.json();
    })
    .then((bracketResponse) => {
        for (var i = 0; i < bracketResponse.length; i++){

            const game = bracketResponse[i];
            var match: BracketMatch;

            match = {
                id: game._id,
                topName: game?.top?.team?.name,
                topScore: game?.top?.score,
                topSeed: game?.top?.seedNumber,
                topWinner: game?.top?.winner,
                bottomName: game?.bottom?.team?.name,
                bottomScore: game?.bottom?.score,
                bottomSeed: game?.bottom?.seedNumber,
                bottomWinner: game?.bottom?.winner,
                matchNumber: game.matchNumber,
                roundNumber: game.roundNumber,
                type: game?.matchType
            }

            matches.push(match);
        }

        return matches;
    });
}