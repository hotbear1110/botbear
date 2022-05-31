const got = require("got");
const _ = require("underscore");
const tools = require("../tools/tools.js");

module.exports = {
    name: "trivia2",
    ping: false,
    description: 'This command will start a new trivia in chat (To see the cooldown on this command, do: "bb check triviacooldown") - Api used: https://gazatu.xyz/',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            let questions = await got(`https://api.gazatu.xyz/trivia/questions?count=1&exclude=[Anime,Hentai,Weeb]`, { timeout: 10000 }).json();

            let question = decodeURIComponent(questions[0].question);
            let correct_answer = decodeURIComponent(questions[0].answer);
            let hint1 = questions[0].hint1;
            let hint2 = questions[0].hint2;
            let category = decodeURIComponent(questions[0].category);
            let submitter = decodeURIComponent(questions[0].submitter);
            correct_answer = tools.removeTrailingSpaces(correct_answer)

            return [`(Trivia) [${category}] Question: ${question}`, correct_answer, hint1, hint2];

        } catch (err) {
            console.log(err);
            if (err.name === "TimeoutError") {
                return `FeelsDankMan api error: ${err.name}`;
            }
            return `FeelsDankMan Error, ${err}`;
        }
    }
}