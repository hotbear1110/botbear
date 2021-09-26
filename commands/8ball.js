module.exports = {
    name: "8ball",
    ping: true,
    description: "",
    permission: 100,
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