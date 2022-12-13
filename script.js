var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const select = document.getElementById("bracket-select");
var brackets;
select.addEventListener("change", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const element = document.getElementById("bracket-zone");
        element.innerHTML = "";
        const bracket = brackets[parseInt(select.value)];
        const matches = yield getBracketMatches(bracket);
        switch (bracket.type) {
            case "elimination":
                if (bracket.style == "double") {
                    element.appendChild(getDoubleEliminationElement(matches));
                }
                else {
                    element.appendChild(getEliminationElement(matches));
                }
        }
        showAll();
    });
});
function searchForBrackets() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputVal = document.getElementById('input').value;
        select.innerHTML = "";
        document.getElementById("bracket-zone").innerHTML = "";
        brackets = yield getAllBracketInfo(inputVal);
        for (var i = 0; i < brackets.length; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            option.innerText = brackets[i].name;
            select.appendChild(option);
        }
        select.dispatchEvent(new Event('change'));
        gsap.fromTo("#options-pt2", { display: "flex", opacity: 0, scale: .75 }, { opacity: 1, scale: 1 });
    });
}
function showAll() {
    const root = document.getElementById("bracket-zone");
    const bracket = root.firstChild;
    bracket.style.transformOrigin = "top";
    const bWidth = bracket.offsetWidth;
    const bHeight = bracket.offsetHeight;
    if (bWidth > 1920 || bWidth < 1920) {
        bracket.style.scale = (1920 / bWidth).toString();
    }
    if (bHeight > 1080 || bHeight < 1080) {
        bracket.style.scale = (1080 / bHeight).toString();
    }
}
function getDoubleEliminationElement(matches) {
    const element = document.createElement("div");
    const winnersMatches = [];
    const losersMatches = [];
    for (var i = 0; i < matches.length; i++) {
        if (matches[i].type == "winner") {
            winnersMatches.push(matches[i]);
        }
        else {
            losersMatches.push(matches[i]);
        }
    }
    const winnersElement = getEliminationElement(winnersMatches, "winners");
    const losersElement = getEliminationElement(losersMatches, "losers");
    element.appendChild(winnersElement);
    element.appendChild(losersElement);
    return element;
}
function getEliminationElement(matches, roundNaming) {
    const element = document.createElement("div");
    element.className = "bracket-wrapper";
    const roundElims = [];
    const roundsNum = Math.max(...matches.map(o => o.roundNumber));
    for (var i = 0; i < roundsNum; i++) {
        const roundElim = document.createElement("div");
        roundElim.className = "grid-wrapper";
        const roundHeader = document.createElement("div");
        roundHeader.className = "grid-header";
        if (roundNaming == "winners" && i == roundsNum - 2) {
            roundHeader.innerText = "Grand Finals";
        }
        else if (roundNaming == "winners" && i == roundsNum - 1) {
            roundHeader.innerText = "Reset";
        }
        else if (roundNaming == "losers" && i == roundsNum - 1) {
            roundHeader.innerText = "Losers Finals";
        }
        else if (i == roundsNum - 1) {
            roundHeader.innerText = "Finals";
        }
        else {
            roundHeader.innerText = "Round " + (i + 1);
        }
        roundElim.appendChild(roundHeader);
        roundElims.push(roundElim);
        element.appendChild(roundElim);
    }
    for (var i = 0; i < matches.length; i++) {
        const elim = getEliminationStyleMatchElement(matches[i]);
        if (matches[i].roundNumber != 0) {
            roundElims[matches[i].roundNumber - 1].appendChild(elim);
        }
        else {
            elim.classList.add("elim-third");
            roundElims[roundElims.length - 1].appendChild(elim);
        }
    }
    return element;
}
function getEliminationStyleMatchElement(match) {
    const element = document.createElement("div");
    element.className = "round-wrapper";
    const topTeam = document.createElement("div");
    topTeam.className = "team-wrapper";
    if (match.topWinner) {
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
function getAllBracketInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputSplit = url.split('/');
        const splitLen = inputSplit.length;
        const tourneyId = inputSplit[splitLen - 1].indexOf("info") !== -1 || inputSplit[splitLen - 1] == ""
            ? inputSplit[splitLen - 2]
            : inputSplit[splitLen - 1];
        var brackets = [];
        return fetch(`https://api.battlefy.com/tournaments/${tourneyId}?extend%5Bcampaign%5D%5Bsponsor%5D=true&extend%5Bstages%5D%5B%24query%5D%5BdeletedAt%5D%5B%24exists%5D=false&extend%5Bstages%5D%5B%24opts%5D%5Bname%5D=1&extend%5Bstages%5D%5B%24opts%5D%5Bbracket%5D=1`)
            .then((response) => {
            return response.json();
        })
            .then((tourneyResponse) => {
            for (var i = 0; i < tourneyResponse[0].stages.length; i++) {
                const stage = tourneyResponse[0].stages[i];
                var bracket;
                if (stage.bracket.type == "elimination") {
                    bracket = {
                        id: stage._id,
                        name: stage.name,
                        type: stage.bracket.type,
                        totalRounds: stage.bracket.roundsCount,
                        currentRound: stage.bracket.currentRoundNumber,
                        style: stage.bracket.style
                    };
                }
                else {
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
    });
}
function getBracketMatches(bracket) {
    return __awaiter(this, void 0, void 0, function* () {
        var matches = [];
        return fetch(`https://api.battlefy.com/stages/${bracket.id}/matches`)
            .then((response) => {
            return response.json();
        })
            .then((bracketResponse) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            for (var i = 0; i < bracketResponse.length; i++) {
                const game = bracketResponse[i];
                var match;
                match = {
                    id: game._id,
                    topName: (_b = (_a = game === null || game === void 0 ? void 0 : game.top) === null || _a === void 0 ? void 0 : _a.team) === null || _b === void 0 ? void 0 : _b.name,
                    topScore: (_c = game === null || game === void 0 ? void 0 : game.top) === null || _c === void 0 ? void 0 : _c.score,
                    topSeed: (_d = game === null || game === void 0 ? void 0 : game.top) === null || _d === void 0 ? void 0 : _d.seedNumber,
                    topWinner: (_e = game === null || game === void 0 ? void 0 : game.top) === null || _e === void 0 ? void 0 : _e.winner,
                    bottomName: (_g = (_f = game === null || game === void 0 ? void 0 : game.bottom) === null || _f === void 0 ? void 0 : _f.team) === null || _g === void 0 ? void 0 : _g.name,
                    bottomScore: (_h = game === null || game === void 0 ? void 0 : game.bottom) === null || _h === void 0 ? void 0 : _h.score,
                    bottomSeed: (_j = game === null || game === void 0 ? void 0 : game.bottom) === null || _j === void 0 ? void 0 : _j.seedNumber,
                    bottomWinner: (_k = game === null || game === void 0 ? void 0 : game.bottom) === null || _k === void 0 ? void 0 : _k.winner,
                    matchNumber: game.matchNumber,
                    roundNumber: game.roundNumber,
                    type: game === null || game === void 0 ? void 0 : game.matchType
                };
                matches.push(match);
            }
            return matches;
        });
    });
}
//# sourceMappingURL=script.js.map