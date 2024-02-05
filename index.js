const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client = new Client({authStrategy: new LocalAuth()});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.initialize();

client.on('ready', async () => {
    
    let data = JSON.parse(fs.readFileSync('data.json', { encoding : 'utf-8' }))
    const recipients = data.map(el => {
        el.celular = `${el.celular}@c.us`
        return el
    })
    
    const pdfPath = path.join('C:', 'Users', 'larreadi', 'Downloads', 'Boda Natalia & Miguel.pdf');
    const pdfData = fs.readFileSync(pdfPath);
    const base64Pdf = pdfData.toString('base64');

    const media = new MessageMedia('application/pdf', base64Pdf, 'Boda Natalia & Miguel.pdf');

    for(let i = 0; i < recipients.length; i++) {
        const message = `Hola ${recipients[i].nombre}!\n\nCon mucha alegría queremos invitarte a nuestra boda. Queremos compartir este día tan especial para nosotros rodeados de amigos y familiares.\n\nAccediendo al siguiente link vas a poder ver la invitación completa y confirmar tu asistencia: https://natalia-miguel.love/\n\n¡Esperamos contar con su presencia para celebrar juntos! 💕\n\nVálido ${recipients[i].valido} persona(s) Confirmar asistencia hasta el 11 de febrero por el enlace\n\nSi te gustaría hacernos un regalo te dejamos algunas opciones en el siguiente enlace: https://www.tupi.com.py/regalos_en_lista/6836/Boda-de-Natalia-Cardozo-y-Miguel-Gonzalez-el-24-02-2024`;
        await client.sendMessage(recipients[i].celular, media, { caption: message });
        console.log(`Mensaje enviado a ${recipients[i].nombre}`);
        await esperar2m();
    }
});

const esperar2m = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Han pasado 2 minutos');
        }, 2 * 60 * 1000); // Espera 2 minutos
    });
}