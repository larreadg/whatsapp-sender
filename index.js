const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client = new Client({authStrategy: new LocalAuth()});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.initialize();



client.on('ready', async () => {
    console.log('Client is ready!');
    
    const recipients = ['595984345259@c.us', '595972413798@c.us'];
    const url = 'https://natalia-miguel.love';
    const previewData = await fetch(`https://api.linkpreview.net/?key=f6c04bcd02c17b05e311b2e094649db8&q=${url}`);
    const previewJson = await previewData.json();

    const response = await fetch(previewJson.image);
    const buffer = await response.buffer();
    const base64Image = buffer.toString('base64');

    const media = new MessageMedia('image/webp', base64Image, previewJson.title);

    for(let i = 0; i < recipients.length; i++) {
        await client.sendMessage(recipients[i], media, { caption: previewJson.description });
        console.log(`Mensaje enviado a ${recipients[i]}`)
    }
});