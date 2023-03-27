require('dotenv').config();
const querystring = require('querystring');
const sql = require('./../../../sql/index.js');

module.exports = (function () {
    const router = require('express').Router();

    const client_id = process.env.TWITCH_CLIENTID;
    const redirect_uri = 'https://hotbear.org/bot/callback';

    /* /Login */
    router.get('/', async (req, res) => {

      let cookies = req.cookies || '';

      let cookieToken = cookies.token;


      if (cookieToken) {
        const hasToken = await sql.Query('SELECT * FROM bot_config WHERE cookieToken = ?', [cookieToken]);

        if (hasToken.length) {
          res.redirect('./config');
          return router;
        }
      }
      
        let state = generateRandomString(16);
        let scope = (req.query.extend) ? `bits:read analytics:read:games 
                                        chat:read chat:edit channel:moderate 
                                        channel:read:subscriptions 
                                        moderation:read 
                                        channel:read:redemptions 
                                        channel:edit:commercial 
                                        channel:read:hype_train 
                                        channel:manage:redemptions 
                                        channel:read:editors 
                                        user:read:subscriptions 
                                        channel:manage:polls 
                                        channel:manage:predictions 
                                        channel:read:polls 
                                        channel:read:predictions 
                                        moderator:manage:automod 
                                        moderator:read:automod_settings 
                                        moderator:manage:automod_settings 
                                        moderator:manage:banned_users 
                                        moderator:read:blocked_terms 
                                        moderator:manage:blocked_terms 
                                        moderator:read:chat_settings 
                                        moderator:manage:chat_settings 
                                        channel:manage:raids 
                                        moderator:manage:announcements 
                                        moderator:manage:chat_messages 
                                        channel:manage:moderators 
                                        channel:read:vips 
                                        channel:manage:vips 
                                        moderator:read:chatters 
                                        moderator:read:shield_mode 
                                        moderator:manage:shield_mode 
                                        moderator:read:shoutout s 
                                        moderator:manage:shoutouts 
                                        moderator:read:followers`
                                         :
                                        '';
      
        res.redirect('https://id.twitch.tv/oauth2/authorize?' +
          querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
          }));
    });

    return router;
})();

const generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };