const got = require('got');
const _ = require('underscore');
const tools = require('../tools/tools.js');

// https://opentdb.com/api_config.php
const OTDB_Categories = {
	'general': 9,
	'books': 10,
	'film': 11,
	'music': 12,
	'musicals': 13,
	'theatres': 13,
	'television': 14,
	'video games': 15,
	'board games': 16,
	'science': 17,
	'nature': 17,
	'computer': 18,
	'computers': 18,
	'math': 19,
	'mythology': 20,
	'sports': 21,
	'geography': 22,
	'history': 23,
	'politics': 24,
	'art': 25,
	'celebrities': 26,
	'animals': 27,
	'vehicles': 28,
	'comics': 29,
	'gadgets': 30,
	'anime': 31,
	'manga': 31,
	'cartoon': 32,
	'cartoons': 32
};

function genre(category) {
	if (category === undefined) {
		return undefined;
	} else {
		return OTDB_Categories[category];
	}
}

async function getTrivia(genre) {
	if (genre === undefined) {
		return await got('https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986', { timeout: 10000 }).json();
	} else {
		return await got(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986&category=${genre}`, { timeout: 10000 }).json();
	}
}

function arrayShuffle(array) {
    for (let index = array.length - 1; index > 0; index--) {
        const newIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[newIndex]] = [array[newIndex], array[index]];
    }

    return array;
}

module.exports = {
	name: 'trivia',
	ping: false,
	description: 'This command will start a new trivia in chat (To see the cooldown on this command, do: "bb check triviacooldown"). Specific category: "bb trivia sports". Categories: [ https://haste.zneix.eu/uhedagatig.txt ]',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let random = Math.floor(Math.random() * 100);
			if (random === 69 && !input[3]) {
				return ['(Trivia) [History] Question: What happened on June 4 1989 in China?', '[ Nothing | Nothing | Nothing | Nothing ]', 'Nothing'];
			}

			let a = await getTrivia(genre(input[2]));
			if (input[3]) {
				a = await getTrivia(genre(`${input[2]} ${input[3]}`));
			}
			const trivia = await a['results'];

			let question = decodeURIComponent(trivia[0].question);
			let correct_answer = trivia[0].correct_answer;
			let incorrect_answers = trivia[0].incorrect_answers;
			let allanswers = incorrect_answers;
			let category = decodeURIComponent(trivia[0].category);

			allanswers.push(correct_answer);

			let shuffled = arrayShuffle(allanswers);
			let fixedanswers = [];

			_.each(shuffled, (answer) => {
				fixedanswers.push(answer);
			});

			let answerToString = '';
			fixedanswers.forEach((a) => {
				answerToString += ` ${a} |`;
			});

			answerToString = answerToString.replace(/.$/, '');
			answerToString = decodeURIComponent(answerToString);

			correct_answer = decodeURIComponent(correct_answer);
			correct_answer = tools.removeTrailingStuff(correct_answer);

			if (question.toLowerCase().includes('which of these') || question.toLowerCase().includes('which one of these') || question.toLowerCase().includes('which of the following') || question.toLowerCase().includes('all of the following') || question.toLowerCase().includes('which one of the following')) {
				return [`(Trivia) [${category}] Question: ${question} - [${answerToString}]`, 'FeelsDankMan you already got the hint.', correct_answer];
			} else {
				return [`(Trivia) [${category}] Question: ${question}`, answerToString, correct_answer];
			}
		} catch (err) {
			console.log(err);
			if (err.name === 'TimeoutError') {
				return `FeelsDankMan api error: ${err.name}`;
			}
			return `FeelsDankMan Error, ${err}`;
		}
	}
};