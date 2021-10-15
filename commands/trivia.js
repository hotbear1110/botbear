const got = require("got");
const _ = require("underscore");

module.exports = {
    name: "trivia",
    ping: false,
    description: 'This command will start a new trivia in chat (The cooldown is 5 minute and the trivia times out after 60 seconds.)',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            function arrayShuffle(array) {
                for (let index = array.length - 1; index > 0; index--) {
                    const newIndex = Math.floor(Math.random() * (index + 1));
                    [array[index], array[newIndex]] = [array[newIndex], array[index]];
                }
            
                return array;

            }

            let trivia = await got(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986`, {timeout: 10000}).json();

            trivia = trivia["results"];

            let question = decodeURI(trivia[0].question);
            let correct_answer = trivia[0].correct_answer;
            let incorrect_answers = trivia[0].incorrect_answers;
            let allanswers = incorrect_answers;

            allanswers.push(correct_answer);

            let shuffled = arrayShuffle(allanswers);
            let fixedanswers = [];

            _.each(shuffled, function (answer) {
                fixedanswers.push(decodeURI(answer));
            })

            fixedanswers = fixedanswers.toString().replaceAll(",", ", ");
            question = question.replaceAll("%3F", "?");
            question = question.replaceAll("%2C", ",");

            console.log(shuffled)
            return [`(Trivia) ${user.username} has started a trivia :) Question: ${question} | Answers: ${fixedanswers}`, decodeURI(correct_answer)];
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}