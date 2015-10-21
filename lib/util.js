ListActions = [
	"CARTE-ACTIVE",
	"CARTE-DEL", 
	"CARTE-NEW", 
	"CARTE-UPD",
	"DECK-ADD",
	"DECK-REM",
	"EVENT-ACTIVE",
	"EVENT-DEL", 
	"EVENT-NEW",
	"EVENT-PUT", 
	"EVENT-UPD",
	"EXPERT-CALL",
	"EXPERT-NOCALL-BUDGET",
	"EXPERT-NOMORECALL",
	"PARTIE-DEL",
	"PEER-CALL",
	"PEER-NOCALL-BUDGET",
	"PEER-NOMORECALL",
	"PEER-STILLCALL",
	"PEER-TOOLATE",
	"SCENAR-NEW",
	"SCENAR-UPD",
	"USER-CALL",
	"USER-MSG",
	"USER-NOCALL-BUDGET"
];
ListTokens = [
];

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}