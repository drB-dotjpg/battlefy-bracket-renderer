# Bracket Scene Design Doc

## Control Panel UI
|Item|UI component|Description|
|-|-|-|
|Bracket Select|Dropdown Menu|Selects what bracket will be shown on stream|
|Match Type|Radio Buttons|Streamer can choose if the stream should focus on all matchs, matches in progress, or finished matches.|
|(Double elim only) Bracket Select|Radio Buttons|Streamer can choose if a double elim bracket only shows winners or losers.|
|(Swiss/Groups only) Round|Dropdown menu|Selects what round is shown|
|Update|Button|Updates the replicant|

## How to get data from Battlefy
#### To get all the brackets from a battlefy tourney, use the following URL:
```
https://api.battlefy.com/tournaments/ {Tourney ID} ?extend%5Bcampaign%5D%5Bsponsor%5D=true&extend%5Bstages%5D%5B%24query%5D%5BdeletedAt%5D%5B%24exists%5D=false&extend%5Bstages%5D%5B%24opts%5D%5Bname%5D=1&extend%5Bstages%5D%5B%24opts%5D%5Bbracket%5D=1
```
You can get bracket data by accessing the `stages` key

#### To get specific bracket data for elim, double elim, and swiss:
```
https://api.battlefy.com/stages/ {Bracket ID} /matches
```

#### To get specific bracket data for groups:
First you need an ID for each group in the bracket, use the following to get it:
```
https://api.battlefy.com/stages/ {Bracket ID}
```
Then use the following url for each group to get info on them:
```
https://api.battlefy.com/groups/ {Group ID} /matches
```

**See [getBattlefy.ts](src/getBattlefy.ts) for code examples for getting data off battlefy**

## Replicant Concept
This is the data needed to put bracket data graphics on a stream
```js
{
    "bracketType": "elim / double-elim / swiss / groups",
    "bracketId": "id",
    "bracketMatches":
    [
        {
            "id": "",
            "matchNumber": 0,
            "roundNumber": 0,
            "type": "winners/losers", //only on double-elim
            "group": 0    //only on groups, 0 representing group A, 1 is B, etc.
            "topTeam":
            {
                "name": "",
                "score": 0,
                "winner": false,
                "seed": 0
            },
            "bottomTeam":
            {
                "name": "",
                "score": 0,
                "winner": false,
                "seed": 0
            }
        }
    ],
    "camera":
    {
        "focus": "all / in-progress / finished",
        "round": 0,   //only on swiss or groups
        "focusBracket": "winners / losers / both",    //only on double elim
        "showSeed": false
    }
}
```
