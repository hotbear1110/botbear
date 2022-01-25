require('dotenv').config();
const got = require('got');

module.exports = {
    name: "ask",
    ping: true,
    description: 'Ask botbear any question and it will tell you the answer! - The cooldown on this is 2 min.',
    permission: 100,
    cooldown: 120,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            input = input.splice(2);
            let msg = input.toString().replaceAll(',', ' ');
            const prompt = `Q: ${msg}\nA:`;

            const url = 'https://api.openai.com/v1/engines/text-davinci-001/completions';
            const params = {
                "prompt": prompt,
                "max_tokens": 160,
                "temperature": 0.7,
                "frequency_penalty": 0.5
            };
            const headers = {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            };

            try {
                const response = await got.post(url, { json: params, headers: headers }).json();
                output = `${prompt}${response.choices[0].text}`;
                console.log(output);
                output = output.substring(prompt.length);

                function linkify(inputText) {
                    var replacedText, replacePattern1, replacePattern2, replacePattern3;

                    //URLs starting with http://, https://, or ftp://
                    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
                    replacedText = inputText.replace(replacePattern1, '*LINK*');

                    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
                    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
                    replacedText = replacedText.replace(replacePattern2, '*LINK*');

                    replacePattern3 = /[a-z|0-9|A-Z]{1,}\.([a-z|A-Z])([a-z|A-Z|0-9]{1,})/g;
                    replacedText = replacedText.replace(replacePattern3, '*LINK*');

                    return replacedText;
                }
                output = linkify(output);
                return output;
            } catch (err) {
                console.log(err);
            }

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}
