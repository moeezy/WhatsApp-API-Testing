import qrcode from 'qrcode-terminal';
import {Client as WhatsAppClient} from 'whatsapp-web.js';
import { MainClient as PokeClient } from 'pokenode-ts';

// const qrcode = require('qrcode-terminal');
// const { Client } = require('whatsapp-web.js');
// Use ctrl+shift+b and use tsc:watch to make any changes automatically compile to javascript
const client = new WhatsAppClient({});
const api = new PokeClient();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});


client.on('message', async (message) => {
    if(message.body == "!everyone"){
        return;
    }
    const pokemon = await api.pokemon
        .getPokemonByName(message.body)
        .then((response) => message.reply(JSON.stringify(response)))
        .catch((error) => message.reply("Error, please send pokemon name alone in all lowercasee"));
});
client.on('message', async (msg) => {
    if(msg.body === '!everyone') {
        const chat = await msg.getChat();
        
        let text = "";
        let mentions = [];

        // @ts-ignore
        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
});

client.initialize();