const transporter = require("../config/nodemailer");

async function enviarSolicitudEmail(data) {
  try {
    console.log(">>> Enviando email...");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Nueva solicitud desde el formulario",
      html: `
        <h2>Nueva solicitud recibida</h2>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Servicio:</strong> ${data.servicio}</p>
        <p><strong>Mensaje:</strong> ${data.mensaje || "(sin mensaje)"}</p>
      `
    });

    console.log(">>> Email enviado correctamente");
  } catch (error) {
    console.log(">>> ERROR en sendMail:", error);
  }
}

module.exports = { enviarSolicitudEmail };