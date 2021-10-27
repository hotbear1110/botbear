const got = require("got");
const _ = require("underscore");

module.exports = {
    name: "trivia",
    ping: false,
    description: 'This command will start a new trivia in chat (The cooldown is 5 minutes and the trivia times out after 60 seconds.)',
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

            let question = decodeURIComponent(trivia[0].question);
            let correct_answer = trivia[0].correct_answer;
            let incorrect_answers = trivia[0].incorrect_answers;
            let allanswers = incorrect_answers;

            allanswers.push(correct_answer);

            let shuffled = arrayShuffle(allanswers);
            let fixedanswers = [];

            _.each(shuffled, function (answer) {
                fixedanswers.push(decodeURIComponent(answer));
            })

            fixedanswers = fixedanswers.toString().replaceAll(",", " | ");
            /*
            fixedanswers = fixedanswers.replaceAll("%2C", ",");
            fixedanswers = fixedanswers.replaceAll("%26", "&");
            fixedanswers = fixedanswers.replaceAll("%3A", ":");
            fixedanswers = fixedanswers.replaceAll("%2F", "/");
            fixedanswers = fixedanswers.replaceAll("%24", "$");

            question = question.replaceAll("%3F", "?");
            question = question.replaceAll("%2C", ",");
            question = question.replaceAll("%26", "&");
            question = question.replaceAll("%3A", ":");
            question = question.replaceAll("%2F", "/");
            question = question.replaceAll("%24", "$");
            */

            correct_answer = decodeURIComponent(correct_answer);

            /*
            correct_answer = correct_answer.replaceAll("%3F", "?");
            correct_answer = correct_answer.replaceAll("%2C", ",");
            correct_answer = correct_answer.replaceAll("%26", "&");
            correct_answer = correct_answer.replaceAll("%3A", ":");
            correct_answer = correct_answer.replaceAll("%2F", "/");
            correct_answer = correct_answer.replaceAll("%24", "$");

            */
            console.log(shuffled)
            return [`(Trivia) ${user.username} has started a trivia :) Question: ${question} | Do "bb hint" if you are nab and need a hint!`, fixedanswers , correct_answer];
        } catch (err) {
            console.log(err);
            if (err.name === "TimeoutError") {
                return `FeelsDankMan Banphrase api error: ${err.name}`;
            }
            return `FeelsDankMan Error`;
        }
    }
}