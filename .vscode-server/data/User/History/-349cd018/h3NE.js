const transporter = require("../config/nodemailer");

/**
 * Send email to ADMIN (Spanish) - Compatible with existing code
 */
async function enviarSolicitudEmail(data) {
  try {
    console.log("📧 [ADMIN] Data received:", { 
      nombre: data.nombre, 
      service: data.service,
      timestamp: new Date().toISOString() 
    });
    
    // Validación mínima (no rompe flujo existente)
    if (!data || !data.nombre || !data.telefono) {
      console.warn("⚠️  Incomplete data for admin email");
      return { ok: false, message: "Datos incompletos" };
    }

    const htmlContent = generateAdminHTML(data);
    
    console.log("📤 [ADMIN] Sending to:", process.env.EMAIL_USER);

    const info = await transporter.sendMail({
      from: `"Web Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📋 Nueva solicitud: ${data.nombre} - ${data.service || "Sin servicio"}`,
      html: htmlContent,
      text: generateAdminPlainText(data)
    });

    console.log("✅ [ADMIN] Email sent. ID:", info.messageId);
    return { ok: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ [ADMIN] Error:", error.message);
    // No throw - maintain backward compatibility
    return { 
      ok: false, 
      error: error.message,
      code: error.code 
    };
  }
}

/**
 * Send confirmation to CLIENT (English)
 */
async function sendClientConfirmation(data) {
  try {
    if (!data.email) {
      console.log("⚠️  No client email, skipping confirmation");
      return { ok: false, message: "No email provided" };
    }

    const serviceFormatted = data.service 
      ? data.service.charAt(0).toUpperCase() + data.service.slice(1).toLowerCase()
      : "our services";

    const info = await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || 'Construction Pro'}" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `✅ We've received your ${serviceFormatted} request`,
      html: generateClientHTML(data),
      text: generateClientPlainText(data)
    });

    console.log("✅ [CLIENT] Confirmation sent to:", data.email);
    return { ok: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ [CLIENT] Error:", error.message);
    return { ok: false, error: error.message };
  }
}

// ========== HTML GENERATORS ==========

function generateAdminHTML(data) {
  const fields = [
    { label: "Nombre", value: data.nombre, required: true },
    { label: "Email", value: data.email, type: "email" },
    { label: "Teléfono", value: data.telefono, required: true },
    { label: "Servicio", value: data.service },
    { label: "Ubicación", value: data.ubicacion },
    { label: "Presupuesto", value: data.presupuesto, type: "currency" },
    { label: "Mensaje", value: data.mensaje || data.descripcion, type: "longtext" }
  ];

  const fieldsHTML = fields.map(field => {
    if (!field.value && !field.required) return '';
    
    let value = field.value || "(no especificado)";
    
    if (field.type === "email" && field.value) {
      value = `<a href="mailto:${field.value}">${field.value}</a>`;
    } else if (field.type === "currency" && field.value) {
      const num = parseFloat(field.value);
      value = !isNaN(num) ? `$${num.toLocaleString('es-ES')}` : field.value;
    }
    
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px; vertical-align: top;">
          ${field.label}:
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; vertical-align: top;">
          ${value}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <div style="background: #2c3e50; color: white; padding: 20px; border-radius: 5px 5px 0 0;">
        <h2 style="margin: 0;">📋 Nueva Solicitud desde la Web</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">
          ${new Date().toLocaleString('es-ES', { 
            dateStyle: 'full', 
            timeStyle: 'short' 
          })}
        </p>
      </div>
      
      <div style="background: white; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${fieldsHTML}
        </table>
        
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>ID de solicitud: REQ-${Date.now().toString().slice(-8)}</p>
          <p><em>Email generado automáticamente desde el formulario web.</em></p>
        </div>
      </div>
    </div>
  `;
}

function generateClientHTML(data) {
  const service = data.service ? data.service.charAt(0).toUpperCase() + data.service.slice(1).toLowerCase() : "service";
  const hasLocation = data.ubicacion && data.ubicacion.trim();
  const hasBudget = data.presupuesto && data.presupuesto.trim();
  
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-weight: 300;">Request Confirmed</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing us!</p>
      </div>
      
      <!-- Content -->
      <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Dear <strong>${data.nombre}</strong>,</p>
        
        <p>We have successfully received your request for <strong style="color: #764ba2;">${service}</strong>.</p>
        
        <!-- Highlight Box -->
        <div style="background: #e8f4ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
          <p style="margin: 0;">
            <strong style="color: #0056b3;">📞 Our team will contact you within 24-48 hours</strong><br>
            at <strong>${data.telefono}</strong> to discuss your project.
          </p>
        </div>
        
        <!-- Summary -->
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 25px 0; border: 1px solid #eaeaea;">
          <h3 style="color: #555; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Your Request Summary</h3>
          
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 10px 15px;">
            <div style="font-weight: 600; color: #666;">Service:</div>
            <div>${service}</div>
            
            <div style="font-weight: 600; color: #666;">Reference:</div>
            <div>#${Date.now().toString().slice(-6)}</div>
            
            <div style="font-weight: 600; color: #666;">Phone:</div>
            <div>${data.telefono}</div>
            
            ${hasLocation ? `
            <div style="font-weight: 600; color: #666;">Location:</div>
            <div>${data.ubicacion}</div>
            ` : ''}
            
            ${hasBudget ? `
            <div style="font-weight: 600; color: #666;">Budget Reference:</div>
            <div>$${parseFloat(data.presupuesto).toLocaleString('en-US')}</div>
            ` : ''}
            
            <div style="font-weight: 600; color: #666;">Submitted:</div>
            <div>${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
        </div>
        
        <p>If you need to update any information or have additional questions, simply reply to this email.</p>
        
        <p>
          Best regards,<br>
          <strong>The ${process.env.COMPANY_NAME || 'Construction Pro'} Team</strong>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #888; text-align: center;">
        <p>This is an automated message. Please do not reply to this email address.</p>
        <p>Request ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9)}</p>
      </div>
    </div>
  `;
}

// ========== PLAIN TEXT GENERATORS ==========

function generateAdminPlainText(data) {
  return `
NUEVA SOLICITUD - FORMULARIO WEB
================================
Nombre: ${data.nombre}
Email: ${data.email || 'No especificado'}
Teléfono: ${data.telefono}
Servicio: ${data.service || 'No especificado'}
Ubicación: ${data.ubicacion || 'No especificada'}
Presupuesto: ${data.presupuesto || 'No especificado'}
Mensaje: ${data.mensaje || data.descripcion || 'Sin mensaje'}
--------------------------------
Fecha: ${new Date().toLocaleString('es-ES')}
ID: REQ-${Date.now().toString().slice(-8)}
  `;
}

function generateClientPlainText(data) {
  return `
CONFIRMATION: Your ${data.service || 'service'} request

Dear ${data.nombre},

Thank you for contacting us! We have received your request for ${data.service || 'our services'}.

Our team will contact you within 24-48 hours at ${data.telefono} to discuss your project.

REQUEST SUMMARY:
---------------
Service: ${data.service || 'Not specified'}
Reference: #${Date.now().toString().slice(-6)}
Phone: ${data.telefono}
${data.ubicacion ? `Location: ${data.ubicacion}\n` : ''}${data.presupuesto ? `Budget Ref.: $${data.presupuesto}\n` : ''}
Submitted: ${new Date().toLocaleDateString('en-US')}

If you need to update any information, reply to this email.

Best regards,
${process.env.COMPANY_NAME || 'Construction Pro'} Team

---------------
This is an automated message. Request ID: ${Date.now()}
  `;
}

// ========== EXPORTS ==========
module.exports = { 
  enviarSolicitudEmail,    // For admin (existing function - Spanish)
  sendClientConfirmation   // For client (new function - English)
};