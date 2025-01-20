# Commands

- account:
    `/account create <account_name>`: create an account
    `@<account_uid>`: set the context to be the account, required before other commands, otherwise commands will fail due to no account context
- avatar: Set the properties of the characters player owned
    `/avatar level <avatar_id> <avatar_level>`: set the level of the character
    `/avatar talent <avatar_id> <talent_level>`: set all skills level of the character
    `/avatar rank <avatar_id> <rank>`: set the eidolon rank of the character
- give: Give player items, item id can be avatar id, but cant set level, talent, rank
    `/give <item_id> [x<count>] [l<level>] [r<rank>]`: give item or character to player, number of count, and of level or rank when applies
- hero: Switch the gender/type of the main character
    `/hero gender <gender_id>`: switch the gender of the main character, 1 means male, 2 means female. Notice: Switch gender will clear all the paths and talents of main character, this operation is irreversible!
    `/hero type <type_id>`: switch the type of the main character, 8001 means Destruction, 8003 means Preservation, 8005 means Harmony.
- mission: Manage player's missions
    `/mission running`: get the running mission and possible stuck missions
    `/mission finish <sub_mission_id>`: finish the sub mission
    `/mission finishmain <main_mission_id>`: finish the main mission
    `/mission reaccept <main_mission_id>`: re-accept given main mission
- raid: Manage player's temporary scene
    `/raid leave`: leave temporary scene
- relic: Manage player's relics
    `/relic <relic_id> <main_affix_id> <sub_affix_id1:sub_affix_level> <sub_affix_id2:sub_affix_level> <sub_affix_id3:sub_affix_level> <sub_affix_id4:sub_affix_level> l<level> x<amount>`: craft a specified relic.
- build: build relics for a character
    `/build cur`: build the currently controlling character's relics using recommended set and affixes
    `/build all`: build all characters' relics using recommended set and affixes
    `/build <avatar_id>`: build the specified character's relics using recommended set and affixes
- remove: remove unwanted items from inventory to avoid clutter
    `/remove relics`: remove all relics currently not equipped by any character
    `/remove <avatar_id>`: unequip everything from that character, and remove the specified avatar
- reload: Reload specified configuration
    `/reload banner`: reload gacha pool
    `/reload activity`: reload events
- scene: Manage player scenes
    `/scene prop <prop_id> <prop_state>`: set the state of a prop. For a list of states, refer to Common/Enums/Scene/PropStateEnum.cs
    `/scene unlockall`: unlock all props in the scene (i.e., set all props that can be opened to the 'open' state). This command may cause the game to load to about 90%. Use '/scene reset <floorId>' to resolve this issue.
    `/scene change <entry_id>`: enter a specified scene. For EntryId, refer to Resources/MapEntrance.json
    `/scene reload`: reload the current scene and return to the initial position.
    `/scene reset <floor_id>`: reset the state of all props in the specified scene. For the current FloorId, use '/scene cur'.
- setlevel: Set player level
    `/setlevel <level>`: set the level of the player
- unlockall: Unlock the objects in given category
    `/unlockall mission`: finish all missions, and the target player will be kicked, after re-login, the player may be stuck in tutorial, please use with caution
    `/unlockall tutorial`: unlock all tutorials, and the target player will be kicked, used for being stuck in some pages
    `/unlockall rogue`: unlock all types of rogue, and the target player will be kicked, used with `/unlockall tutorial` to get better performance


# Note

The language used in the command is from the game engine, but they are not how those concepts are called in the game. Here is a translation of the jargons:
- avatar means character, players often call it character
- equipment means light cone, those two are interchangeable, but Console UI prefers equipment
- relic can also be called artifact, but both UI and players often use relic
- mission can also be called quest, but players often use mission. There are main missions and sub missions.

More commands will be added as needed.
