class Beyond20Helper {
    static handleBeyond20Request(action, request) {
        if (action !== "roll") return;
        if (!game.settings.get("beyond20", "nativeRolls")) return;
        switch (request.type) {
            case 'feature':
            case 'trait':
            case 'item':
            case 'attack':
            case 'action':
            case 'spell-attack':
            case 'spell-card':
                this.rollItems(request);
                return false;
            default:
				Beyond20.handleBeyond20Request(action, request)
                break;
        }
    }
	
	static async rollItems(request) {		
		const actor = game.actors.find(x => (x.data.name == request.character.name));
		
		let actorItem;
		
		let found =true;
		
		if (actor == undefined){
			found =false;
		}else{		
			actorItem = actor.items.find(x => (x.name == request.name))
			if (actorItem == undefined) {
				found=false;
			}
		}

		if (found){
			const template = game.dnd5e.canvas.AbilityTemplate.fromItem(actorItem);
			if ( template ) template.drawPreview();
			const rollMode = request.whisper === 0 ? "roll" : "gmroll";
			
			const roll = ['attack', 'spell-attack'].includes(request.type);
			actorItem[roll ? 'roll' : 'displayCard']({configureDialog: false, rollMode, createMessage: true});
		}else{
			Beyond20.handleBeyond20Request(action, request)
		}
    }
}

Hooks.on('beyond20Request', (action, request) => Beyond20Helper.handleBeyond20Request(action, request));
