const got = require("got");
const { isInteger } = require("tmi.js/lib/utils");

module.exports = {
    name: "harrypotter",
    ping: true,
    description: 'Can give info about Harry Potter characters as well as search for charaters by name, hair color, eye color etc.',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            switch (input[2]) {
                case "random": {

                    const characters = await got(`http://hp-api.herokuapp.com/api/characters`, { timeout: 10000 }).json();
                    let number = Math.floor(Math.random() * (characters.length - 0) + 0);

                    characters[number].wand = `[ ${Object.entries(characters[number].wand).filter(filterByEmpty).join(" | ").replaceAll(",", ": ")} ]`;
                    characters[number].alternate_names = `[ ${characters[number].alternate_names.filter(filterByEmpty).join(" | ")} ]`;

                    const asArray = Object.entries(characters[number]);

                    function filterByEmpty(item) {
                        if (item[1].length || typeof item[1] === "boolean" || typeof item[1] === "number") {
                            if ((item[0] === "hogwartsStudent" || item[0] === "hogwartsStaff") && item[1] === false) {
                                return false
                            }
                            if (item[1] === "[  ]") {
                                return false
                            }
                            return true
                        }
                        return false
                    }
                    let filtered = asArray.filter(filterByEmpty)
                    console.log(characters[number])
                    console.log(filtered)
                    let reply = [];
                    for (let x = 0; x < filtered.length; x++) {
                        reply.push(filtered[x].join(": "));
                    }
                    reply = reply.join(", ")
                    return reply;
                }
                    break;
                default: return "Available harrypotter commands: random";
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}