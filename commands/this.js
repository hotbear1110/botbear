module.exports = {
    name: "this",
    ping: true,
    description: 'This command sends a THIS in the chat. peepoPog  WoW !',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {

            return `The person, thing, or idea that is present or near in place, time, or thought or that has just been mentioned "these are my hands".
            What is stated in the following phrase, clause, or discourse
            "I can only say this: it wasn't here yesterday". 
            this time or place. 
            "expected to return before this". 
            the one nearer or more immediately under observation or discussion. 
            "this is iron and that is tin". 
            the one more recently referred to`;

        } catch (error) {
            console.log(error);
            return `Error, FeelsDonkMan ${error}`;
        }


    }
}