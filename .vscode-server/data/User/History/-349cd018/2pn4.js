const transporter = require("../config/nodemailer");

async function enviarSolicitudEmail({ nombre, email, telefono, servicio, mensaje }) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
to: process.env.EMAIL_USER,
    subject: "Nueva solicitud desde el formulario",
    html: `
      <h2>Nueva solicitud recibida</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Servicio:</strong> ${servicio}</p>
      <p><strong>Mensaje:</strong> ${mensaje || "(sin mensaje)"}</p>
    `
  });
}

module.exports = { enviarSolicitudEmail };