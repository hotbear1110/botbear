module.exports = {
    name: "bot",
    ping: true,
    description: 'This command will give a short explanation of the bot',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return `nyaDnmnk bot1raeb110 is a bot taht can nfitoy you in caht wehn a stmaerer geos livnahc/eges titnahc/elges gema, by piignng you in ctah. You can eevn set spficeic gemas taht sluohd pnig yuo. The bot aslo has smoe oehtr caht imivorpng codnamms, taht gevis the chettars use/luffun inftamroion auobt the ctah, oehtr uress and the saertm :) The bot is wetirn in no.edjs and is mdae by: xx____0111raebtooooooh_xx. Lnik to my GiuHtb: httbtob/0111raebtoh/moc.buhtig//:spear`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}