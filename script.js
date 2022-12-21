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
var currentBracket = undefined;
select.addEventListener("change", function () {
    const bracket = brackets[parseInt(select.value)];
    switch (bracket.type) {
        case "elimination":
            if (bracket.style == "double") {
                showControl("double-elim");
            }
            else {
                showControl("elim");
            }
            break;
        case "swiss":
            showControl("swiss");
            break;
        case "roundrobin":
            showControl("roundrobin");
    }
});
function updateBracket() {
    return __awaiter(this, void 0, void 0, function* () {
        const zoom = document.getElementById("zoom");
        const bracket = brackets[parseInt(select.value)];
        const matches = bracket.type != "roundrobin" ? yield getBracketMatches(bracket) : yield getRoundRobinMatches(bracket);
        const animate = !areBracketsEqual(bracket, currentBracket);
        currentBracket = bracket;
        if (animate) {
            yield animateOut();
        }
        else {
            zoom.innerHTML = "";
        }
        switch (bracket.type) {
            case "elimination":
                if (bracket.style == "double") {
                    zoom.appendChild(getDoubleEliminationElement(matches));
                    showControl("double-elim");
                    updateCamera("double-elim", animate);
                }
                else {
                    zoom.appendChild(getEliminationElement(matches));
                    showControl("elim");
                    updateCamera("elim", animate);
                }
                break;
            case "swiss":
                const swissRound = document.getElementById("swiss-round-select");
                var roundNum = parseInt(swissRound.value);
                console.log(roundNum);
                if (isNaN(roundNum)) {
                    addSwissRoundControls(matches[matches.length - 1].roundNumber);
                    roundNum = 1;
                }
                zoom.appendChild(getSwissElement(matches, roundNum));
                showControl("swiss");
                updateCamera("swiss", animate);
                break;
            case "roundrobin":
                const roundRobinRound = document.getElementById("roundrobin-round-select");
                var roundNum = parseInt(roundRobinRound.value);
                if (isNaN(roundNum)) {
                    addRoundRobinRoundControls(matches[matches.length - 1].roundNumber);
                    roundNum = 1;
                }
                zoom.appendChild(getRoundRobinElement(matches, roundNum));
                showControl("roundrobin");
                updateCamera("roundrobin", animate);
                break;
        }
        if (animate)
            animateIn();
    });
}
function searchForBrackets() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputVal = document.getElementById('input').value;
        select.innerHTML = "";
        brackets = yield getAllBracketInfo(inputVal);
        for (var i = 0; i < brackets.length; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            option.innerText = brackets[i].name;
            select.appendChild(option);
        }
        select.dispatchEvent(new Event('change'));
        gsap.fromTo("#options-pt2", { display: "block", opacity: 0, scale: .75 }, { opacity: 1, scale: 1 });
        updateBracket();
    });
}
function showControl(type) {
    const allControls = document.querySelectorAll(".controls");
    for (var i = 0; i < allControls.length; i++) {
        if (allControls[i].id == "controls-" + type || allControls[i].id == "cam-controls") {
            allControls[i].style.display = "flex";
        }
        else {
            allControls[i].style.display = "none";
        }
    }
}
function addSwissRoundControls(rounds) {
    const selector = document.getElementById("swiss-round-select");
    selector.innerHTML = '';
    for (var i = 0; i < rounds; i++) {
        const option = document.createElement("option");
        option.value = (i + 1).toString();
        option.innerText = (i + 1).toString();
        selector.appendChild(option);
    }
}
function addRoundRobinRoundControls(rounds) {
    const selector = document.getElementById("roundrobin-round-select");
    selector.innerHTML = '';
    for (var i = 0; i < rounds; i++) {
        const option = document.createElement("option");
        option.value = (i + 1).toString();
        option.innerText = (i + 1).toString();
        selector.appendChild(option);
    }
}
function areBracketsEqual(bracket1, bracket2) {
    if (bracket1 === undefined || bracket2 === undefined) {
        return false;
    }
    return bracket1.id == bracket2.id;
}
const tl = gsap.timeline();
function updateCamera(bracketType, noAnim = false) {
    var camFocusVal = document.querySelector('input[name="cam-focus"]:checked').value;
    switch (bracketType) {
        case "elim":
            if (camFocusVal == "all") {
                showAll(noAnim);
            }
            else if (camFocusVal == "in-progress") {
                showInProgress();
            }
            else if (camFocusVal == "finished") {
                showFinished();
            }
            break;
        case "double-elim":
            const bracketFocusVal = document.querySelector('input[name="de-bracket-cam"]:checked').value;
            if (camFocusVal == "all") {
                showAllDE(bracketFocusVal, noAnim);
            }
            else if (camFocusVal == "in-progress") {
                showInProgressDE(bracketFocusVal);
            }
            else if (camFocusVal == "finished") {
                showFinishedDE(bracketFocusVal);
            }
            break;
        case "swiss":
            sortGroups();
            if (camFocusVal == "all") {
                groupRoundVisibility("all");
            }
            else if (camFocusVal == "in-progress") {
                groupRoundVisibility("in-progress");
            }
            else if (camFocusVal == "finished") {
                groupRoundVisibility("finished");
            }
            showAll(noAnim);
            break;
        case "roundrobin":
            sortGroups();
            if (camFocusVal == "all") {
                groupRoundVisibility("all");
            }
            else if (camFocusVal == "in-progress") {
                groupRoundVisibility("in-progress");
            }
            else if (camFocusVal == "finished") {
                groupRoundVisibility("finished");
            }
            showAll(noAnim);
            break;
    }
}
function showAll(noAnim = false) {
    const root = document.getElementById("bracket-zone");
    var camera = root.querySelectorAll(".bracket");
    centerOnElements(camera, noAnim);
}
function showAllDE(bracket, noAnim = false) {
    if (bracket == "both") {
        showAll(noAnim);
        deUpdateBracketVisability(bracket, noAnim);
        return;
    }
    var bracketOfInterest;
    if (bracket == "winners") {
        bracketOfInterest = document.querySelectorAll(".bracket[data-bracket-type=winners]");
        centerOnElements(bracketOfInterest, noAnim);
        deUpdateBracketVisability(bracket, noAnim);
    }
    else if (bracket == "losers") {
        bracketOfInterest = document.querySelectorAll(".bracket[data-bracket-type=losers]");
        centerOnElements(bracketOfInterest, noAnim);
        deUpdateBracketVisability(bracket, noAnim);
    }
}
function showInProgress() {
    const root = document.getElementById("bracket-zone");
    var elementsOfInterest = root.querySelectorAll("div[data-round-status=\"in-progress\"]");
    if (elementsOfInterest.length <= 0) {
        return;
    }
    centerOnElements(elementsOfInterest);
}
function showInProgressDE(bracket) {
    if (bracket == "both") {
        showInProgress();
        deUpdateBracketVisability(bracket);
        return;
    }
    const bracketOfInterest = document.querySelector(`.bracket[data-bracket-type=${bracket}]`);
    var elementsOfInterest = bracketOfInterest.querySelectorAll("div[data-round-status=\"in-progress\"]");
    if (elementsOfInterest.length <= 0) {
        return;
    }
    centerOnElements(elementsOfInterest);
    deUpdateBracketVisability(bracket);
}
function showFinished() {
    const root = document.getElementById("bracket-zone");
    var elementsOfInterest = root.querySelectorAll("div[data-round-status=\"finished\"]");
    if (elementsOfInterest.length <= 0) {
        return;
    }
    centerOnElements(elementsOfInterest);
}
function showFinishedDE(bracket) {
    if (bracket == "both") {
        showFinished();
        deUpdateBracketVisability(bracket);
        return;
    }
    const bracketOfInterest = document.querySelector(`.bracket[data-bracket-type=${bracket}]`);
    var elementsOfInterest = bracketOfInterest.querySelectorAll("div[data-round-status=\"finished\"]");
    if (elementsOfInterest.length <= 0) {
        return;
    }
    centerOnElements(elementsOfInterest);
    deUpdateBracketVisability(bracket);
}
function centerOnElements(elementsOfInterest, noAnim = false) {
    const root = document.getElementById("bracket-zone");
    var maxWidth = 0;
    var minWidth = Number.MAX_SAFE_INTEGER;
    var maxHeight = 0;
    var minHeight = Number.MAX_SAFE_INTEGER;
    for (var i = 0; i < elementsOfInterest.length; i++) {
        const elim = elementsOfInterest[i];
        const pos = getPosOfElement(root, elim);
        // console.log(elementsOfInterest[i], pos);
        maxWidth = Math.max(...pos[0], maxWidth);
        minWidth = Math.min(...pos[0], minWidth);
        maxHeight = Math.max(...pos[1], maxHeight);
        minHeight = Math.min(...pos[1], minHeight);
    }
    // console.log(maxWidth, minWidth, maxHeight, minHeight);
    const targetWidth = maxWidth - minWidth;
    const targetHeight = maxHeight - minHeight;
    var scale = 1;
    if (targetWidth > root.clientWidth) {
        scale = (root.clientWidth / Math.max(targetWidth, 500)) * .97;
        // console.log("fit via width");
        if (targetHeight * scale > root.clientHeight) {
            scale = (root.clientHeight / Math.max(targetHeight, 500)) * .97;
            // console.log("then fit via height");
        }
    }
    else {
        scale = (root.clientHeight / Math.max(targetHeight, 500)) * .97;
        // console.log("fit via height");
        if (targetWidth * scale > root.clientWidth) {
            scale = (root.clientWidth / Math.max(targetWidth, 500)) * .97;
            // console.log("then fit via width");
        }
    }
    moveCamera((root.clientWidth - maxWidth * scale - minWidth * scale) / 2, (root.clientHeight - maxHeight * scale - minHeight * scale) / 2, scale, noAnim);
}
function getPosOfElement(root, elim) {
    return [
        [elim.offsetLeft, elim.offsetLeft + elim.clientWidth],
        [elim.offsetTop, elim.offsetTop + elim.clientHeight]
    ];
}
function moveCamera(x, y, scale, instant = false) {
    tl.to("#camera", {
        x: x,
        y: y,
        duration: instant ? 0 : 1.5,
        ease: "power2.inOut"
    })
        .to("#zoom", {
        scale: scale,
        duration: instant ? 0 : 1.5,
        ease: "power2.inOut"
    }, "<");
}
function deUpdateBracketVisability(bracket, instant = false) {
    tl.to(".bracket[data-bracket-type=losers]", {
        opacity: bracket != "winners" ? 1 : 0,
        duration: instant ? 0 : 1
    }, "<");
    tl.to(".bracket[data-bracket-type=winners]", {
        opacity: bracket != "losers" ? 1 : 0,
        duration: instant ? 0 : 1
    }, "<");
}
function sortGroups() {
    function comparator(a, b) {
        if (a.dataset.roundStatus == "in-progress" && b.dataset.roundStatus != "in-progress") {
            return 1;
        }
        if (a.dataset.roundStatus == b.dataset.roundStatus) {
            return 0;
        }
        else {
            return -1;
        }
    }
    const groups = document.querySelectorAll(".group-bracket-wrapper");
    for (var i = 0; i < groups.length; i++) {
        const rounds = groups[i].querySelectorAll("[data-round-status]");
        const roundsSorted = Array.from(rounds).sort(comparator);
        roundsSorted.forEach(e => groups[i].appendChild(e));
    }
}
function groupRoundVisibility(focus) {
    switch (focus) {
        case "all":
            gsap.to("[data-round-status]", {
                duration: .25,
                opacity: 1
            });
            break;
        case "in-progress":
            gsap.to("[data-round-status=\"in-progress\"]", {
                duration: .25,
                opacity: 1
            });
            gsap.to("[data-round-status=\"finished\"]", {
                duration: .25,
                opacity: .4
            });
            break;
        case "finished":
            gsap.to("[data-round-status=\"finished\"]", {
                duration: .25,
                opacity: 1
            });
            gsap.to("[data-round-status=\"in-progress\"]", {
                duration: .25,
                opacity: .4
            });
            break;
    }
}
function animateIn() {
    return tl.fromTo([".elim-grid-wrapper", ".group-bracket-wrapper"], {
        opacity: 0,
        scale: .85
    }, {
        opacity: 1,
        scale: 1,
        duration: .5,
        stagger: {
            from: 0,
            amount: .15
        },
        ease: "power2.out"
    });
}
function animateOut() {
    return __awaiter(this, void 0, void 0, function* () {
        return tl.to([".elim-grid-wrapper", ".group-bracket-wrapper"], {
            opacity: 0,
            duration: .5,
            scale: .85,
            stagger: {
                from: 0,
                amount: .15
            },
            ease: "power2.out",
            onComplete: function () {
                const zoom = document.getElementById("zoom");
                zoom.innerHTML = "";
                return Promise.resolve();
            }
        });
    });
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
    winnersElement.dataset.bracketType = "winners";
    const losersElement = getEliminationElement(losersMatches, "losers");
    losersElement.dataset.bracketType = "losers";
    element.appendChild(winnersElement);
    element.appendChild(losersElement);
    return element;
}
function getEliminationElement(matches, roundNaming) {
    const element = document.createElement("div");
    element.className = "elim-bracket-wrapper";
    element.classList.add("bracket");
    const roundElims = [];
    const roundsNum = Math.max(...matches.map(o => o.roundNumber));
    for (var i = 0; i < roundsNum; i++) {
        const roundElim = document.createElement("div");
        roundElim.className = "elim-grid-wrapper";
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
    element.className = "elim-round-wrapper";
    if (match.topWinner || match.bottomWinner) {
        element.dataset.roundStatus = "finished";
    }
    else if (match.topName !== undefined || match.bottomName !== undefined) {
        element.dataset.roundStatus = "in-progress";
    }
    else {
        element.dataset.roundStatus = "not-started";
    }
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
function getSwissElement(matches, round) {
    const element = document.createElement("div");
    element.className = "group-bracket-wrapper";
    element.classList.add("bracket");
    const header = document.createElement("div");
    header.className = "group-header";
    header.innerText = "Round " + round.toString();
    element.appendChild(header);
    for (var i = 0; i < matches.length; i++) {
        if (matches[i].roundNumber == round) {
            element.appendChild(getGroupStyleMatchElement(matches[i]));
        }
    }
    return element;
}
function getRoundRobinElement(matches, round) {
    const element = document.createElement("div");
    element.className = "roundrobin-bracket-wrapper";
    element.classList.add("bracket");
    // console.log(matches, matches.length);
    const groups = Array.apply(null, Array(matches[matches.length - 1].group)).map(function () { return []; });
    // console.log(groups);
    for (var i = 0; i < matches.length; i++) {
        if (matches[i].roundNumber == round) {
            groups[matches[i].group - 1].push(getGroupStyleMatchElement(matches[i]));
        }
    }
    for (var i = 0; i < groups.length; i++) {
        const groupElim = document.createElement("div");
        groupElim.className = "group-bracket-wrapper";
        groupElim.classList.add("bracket");
        const header = document.createElement("div");
        header.className = "group-header";
        header.innerText = "Group " + String.fromCharCode(65 + i);
        ;
        groupElim.appendChild(header);
        for (var j = 0; j < groups[i].length; j++) {
            groupElim.appendChild(groups[i][j]);
        }
        element.appendChild(groupElim);
    }
    return element;
}
function getGroupStyleMatchElement(match) {
    const element = document.createElement("div");
    element.className = "group-round-wrapper";
    if (match.topWinner || match.bottomWinner) {
        element.dataset.roundStatus = "finished";
    }
    else if (match.topName !== undefined || match.bottomName !== undefined) {
        element.dataset.roundStatus = "in-progress";
    }
    else {
        element.dataset.roundStatus = "not-started";
    }
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
function getRoundRobinMatches(bracket) {
    return __awaiter(this, void 0, void 0, function* () {
        var matches = [];
        return fetch(`https://api.battlefy.com/stages/${bracket.id}`)
            .then((response) => {
            return response.json();
        })
            .then((bracketResponse) => {
            var promises = [];
            for (var i = 0; i < bracketResponse.groupIDs.length; i++) {
                promises.push(fetch(`https://api.battlefy.com/groups/${bracketResponse.groupIDs[i]}/matches`));
            }
            return Promise.all(promises)
                .then((data) => Promise.all(data.map(data => {
                return data.json();
            })))
                .then((groupResponse) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                for (var i = 0; i < groupResponse.length; i++) {
                    for (var j = 0; j < groupResponse[i].length; j++) {
                        const game = groupResponse[i][j];
                        matches.push({
                            id: game._id,
                            topName: (_b = (_a = game === null || game === void 0 ? void 0 : game.top) === null || _a === void 0 ? void 0 : _a.team) === null || _b === void 0 ? void 0 : _b.name,
                            topScore: (_c = game === null || game === void 0 ? void 0 : game.top) === null || _c === void 0 ? void 0 : _c.score,
                            topWinner: (_d = game === null || game === void 0 ? void 0 : game.top) === null || _d === void 0 ? void 0 : _d.winner,
                            bottomName: (_f = (_e = game === null || game === void 0 ? void 0 : game.bottom) === null || _e === void 0 ? void 0 : _e.team) === null || _f === void 0 ? void 0 : _f.name,
                            bottomScore: (_g = game === null || game === void 0 ? void 0 : game.bottom) === null || _g === void 0 ? void 0 : _g.score,
                            bottomSeed: (_h = game === null || game === void 0 ? void 0 : game.bottom) === null || _h === void 0 ? void 0 : _h.seedNumber,
                            bottomWinner: (_j = game === null || game === void 0 ? void 0 : game.bottom) === null || _j === void 0 ? void 0 : _j.winner,
                            matchNumber: game.matchNumber,
                            roundNumber: game.roundNumber,
                            group: i + 1
                        });
                    }
                }
                return matches;
            });
        });
    });
}
//# sourceMappingURL=script.js.map