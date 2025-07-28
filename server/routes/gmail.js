const gmailRouter = require('express').Router();
const { google } = require('googleapis');
require('dotenv').config();

const credentials = {
    client_id: process.env.GMAIL_CLIENT_ID,
    client_secret: process.env.GMAIL_CLIENT_SECRET,
    redirect_uris: [process.env.GMAIL_REDIRECT_URI],
};

const oAuth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris
);

google.options({ auth: oAuth2Client });

function makeEmail(email, subject, message) {
    const content = [
        `To: ${email}`,
        'Content-Type: text/html; charset="UTF-8"',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        message,
    ].join('\n');

    return Buffer.from(content)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

gmailRouter.post('/send/:toSend/:subject', async (req, res) => {
    try {
        console.log("[POST] /gmail/send/" + req.params.toSend + "/" + req.params.subject + " called from " + req.ip);
        const token = {
            access_token: process.env.GMAIL_ACCESS_TOKEN,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
            scope: process.env.GMAIL_SCOPE,
            token_type: process.env.GMAIL_TOKEN_TYPE,
            expiry_date: process.env.GMAIL_EXPIRY_DATE,
        };
        oAuth2Client.setCredentials(token);
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const email = req.params.toSend;
        const subject = req.params.subject;
        const message = req.body.message;
        const rawEmail = makeEmail(email, subject, message);
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: rawEmail,
            },
        }).then((res) => {
            console.log('Message sent !');
        }).catch((err) => {
            console.error(err);
            res.status(201).json({ message: 'Erreur lors de l\'envoi du mail' });
        });
        res.status(200).json({ message: 'Email envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Erreur interne' });
    }
});

module.exports = gmailRouter;
