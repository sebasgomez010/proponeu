const nodemailer = require('nodemailer');

// si no hay datos de smtp el correo solo se muestra en consola
function haySmtp() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function enviarCorreo(para, asunto, mensaje) {
  if (!haySmtp()) {
    console.log('--- correo (modo consola) ---');
    console.log(`Para: ${para}\nAsunto: ${asunto}\n${mensaje}`);
    return { enviado: true, modo: 'consola' };
  }

  const transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporte.sendMail({
    from: `ProponeU <${process.env.SMTP_USER}>`,
    to: para,
    subject: asunto,
    text: mensaje,
  });
  return { enviado: true, modo: 'smtp' };
}

module.exports = { enviarCorreo };
