module.exports = {
    name: "this",
    ping: true,
    description: 'This command sends a THIS in the chat. peepoPog  WoW !',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {

            return "THIS";

        } catch (error) {
            console.log(error);
            return `Error, FeelsDonkMan ${error}`;
        }


    }
}