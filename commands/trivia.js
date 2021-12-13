const got = require("got");
const _ = require("underscore");
const tools = require("./../tools/tools");

// https://opentdb.com/api_config.php
const OTDB_Categories = {
    "general": 9,
    "books": 10,
    "film": 11,
    "music": 12,
    "musicals": 13,
    "theatres": 13,
    "television": 14,
    "video games": 15,
    "board games": 16,
    "science": 17,
    "nature": 17,
    "computer": 18,
    "computers": 18,
    "math": 19,
    "mythology": 20,
    "sports": 21,
    "geography": 22,
    "history": 23,
    "politics": 24,
    "art": 25,
    "celebrities": 26,
    "animals": 27,
    "vehicles": 28,
    "comics": 29,
    "gadgets": 30,
    "anime": 31,
    "manga": 31,
    "cartoon": 32,
    "cartoons": 32
}

// Lol so much, uses this to filter out trivia.
const OTDB_Categories_Name = {
    9: "General Knowledge",
    10: "Entertainment: Books",
    11: "Entertainment: Film",
    12: "Entertainment: Music",
    13: "Entertainment: Musicals & Theatres",
    14: "Entertainment: Television",
    15: "Entertainment: Video Games",
    16: "Entertainment: Board Games",
    17: "Science & Nature",
    18: "Science: Computers",
    19: "Science: Mathematics",
    20: "Mythology",
    21: "Sports",
    22: "Geography",
    23: "History",
    24: "Politics",
    25: "Art",
    26: "Celebrities",
    27: "Animals",
    28: "Vehicles",
    29: "Entertainment: Comics",
    30: "Science: Gadgets",
    31: "Entertainment: Japanese Anime & Manga",
    32: "Entertainment: Cartoon & Animations"
}


function genre(category) {
    if (category === undefined) {
        return undefined;
    } else {
        return OTDB_Categories[category];
    }
}

async function getTrivia(genre) {
    if (genre === undefined) {
        return await got(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986`, { timeout: 10000 }).json();
    } else {
        return await got(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986&category=${genre}`, { timeout: 10000 }).json();
    }
}

async function CreateTrivia(_genre="") 
{
    const trivia = (await getTrivia(genre(_genre)))["results"];

    const correct_answer = trivia[0].correct_answer;
    const incorrect_answers = trivia[0].incorrect_answers;

    const allanswers = [];
    allanswers.push(incorrect_answers)
    allanswers.push(correct_answer);

    const fixedanswers = [];

    _.each(arrayShuffle(allanswers), (answer) => {
        fixedanswers.push(answer);
    })

    let answerToString = "";
    fixedanswers.forEach((a) => {
        answerToString += ` ${a} |`
    })

    correct_answer = decodeURIComponent(correct_answer);

    return (
        {
            category: category,
            question: question,
            answer: answer,
            answer_as_string: decodeURIComponent(answerToString.replace(/.$/, '')),
        }
    )
}

function arrayShuffle(array) {
    for (let index = array.length - 1; index > 0; index--) {
        const newIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[newIndex]] = [array[newIndex], array[index]];
    }

    return array;
}

module.exports = {
    name: "trivia",
    ping: false,
    description: 'This command will start a new trivia in chat (The cooldown is 5 minutes and the trivia times out after 60 seconds.). Specific category: "bb trivia sports". Categories: [ https://haste.zneix.eu/uhedagatig.txt ]',
    permission: 100,
    category: "Random command",
    params: [
        {
            name: "filter",
            description: "Filter out a trivia, using the categories."
        },
    ],
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const params = tools.parseParams(this.params, input.slice(2, index.length));
            
            // forsenJoy sex number.
            if (Math.floor(Math.random() * 100) === 69) {
                return [`(Trivia) ${user.username} has started a trivia :) [History] Question: What happened on June 4 1989 in China? | Do "bb hint" if you are nab and need a hint!`, "[ Nothing | Nothing | Nothing | Nothing ]", "Nothing"];
            }
            const filter = params.filter(param => param.name = "filter");

            let result = await CreateTrivia(string(input.slice(2, 3)));

            if (OTDB_Categories_Name[OTDB_Categories[filter.value]])
            {
                result = await CreateTrivia(string(input.slice(2, 3)));
            }

            q_lowercase = result.question.toLowerCase();
            
            if(["which of these", "which one of these", "which of the following"].includes(q_lowercase)) {
                return [`(Trivia) ${user.username} has started a trivia :) [${result.category}] Question: ${result.question} - [${result.answerToString}]`, "FeelsDankMan you already got the hint.", result.correct_answer];
            } else {
                return [`(Trivia) ${user.username} has started a trivia :) [${result.category}] Question: ${result.question} | Do "bb hint" if you are nab and need a hint!`, result.answerToString, result.correct_answer];
            }
        } catch (err) {
            console.log(err);
            if (err.name === "TimeoutError") {
                return `FeelsDankMan Banphrase api error: ${err.name}`;
            }
            return `FeelsDankMan Error, ${err}`;
        }
    }
}