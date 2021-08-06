module.exports = {
    name: "name",
    execute: async (data, input) => {
        try {
            return `List of commands: https://botbear.github.io/`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}