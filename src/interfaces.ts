interface BracketInfo {
    id: string;
    name: string;
    type: string;
    totalRounds: number;
    currentRound: number;
    style?: string;
}

interface BracketMatch {
    id: string;
    topName?: string;
    topScore?: number;
    topSeed?: number;
    topWinner?: boolean;
    bottomName: string;
    bottomScore: number;
    bottomSeed: number;
    bottomWinner: boolean;
    matchNumber: number;
    roundNumber: number;
    type?: string;
}