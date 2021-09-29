module.exports = {
    name: "8ball",
    ping: true,
    description: 'This command will answer whatever yes/no question you have. Example: "bb 8ball Is NymN soy"',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
              }

            let responses = ["You could say that", "NOIDONTTHINKSO", "YES!", "NO!", "maybe", "Why not", "You shouldn't count on it", "Hmm idk", "How about no", "YES PagMan", "Why"]
            

            return responses[getRandomInt(responses.length - 1)];

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}