const tools = require("./../tools/tools");

module.exports = {
    name: "NAME",
    ping: true,
    description: 'DESCRIPTION',
    permission: 100,
    category: "CATEGORY [ ./command.category.default.js ]",
    params: [{name: "", description: ""}],
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const params = tools.parseParams(this.params, input.slice(2, index.length));


            return "THIS";
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}