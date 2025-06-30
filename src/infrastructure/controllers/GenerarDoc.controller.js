import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import os from 'os';
import { logger } from '../../config/logger.js';

const nameGenerarDocController = "GENERADOR DOCUMENTO: ";

// Generar Firma Validadora
export function Firma_Validadora() {
    const uuid = uuidv4();
    //logger.info("FIRMA VALIDADORA UUID Generado:", uuid);
    return uuid;
}

// Generar Firma del Cliente
export function generarFirmaCliente(user) {
    return `FIRMANTE: ${user.nombre1} ${user.nombre2 || ''} ${user.apellido1} ${user.apellido2 || ''}\nRUT: ${user.rut}\nROL: ${user.role}\nFECHA Y HORA DE FIRMA: ${new Date().toLocaleString()}`;
}

// Generar Firma de Raiz Financiera
export function generarFirmaBanco() {
    return `FIRMANTE: Raiz Financiera - Representante Autorizado\nFECHA Y HORA DE FIRMA: ${new Date().toLocaleString()}`;
}

// Generar contrato bancario profesional con logo como fondo y formato elegante
export function generarContratoPDF(user, logoPath) {
    const firma_oficial = Firma_Validadora();
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const rutaArchivo = `./public/PDF/contrato_${user.numero_documento}.pdf`;
    const nombre_contrato = `contrato_${user.numero_documento}.pdf`;
    doc.pipe(fs.createWriteStream(rutaArchivo));

    // Insertar logo como fondo
    if (logoPath) {
        doc.image(logoPath, { fit: [500, 700], align: 'center', valign: 'center', opacity: 0 });
    }

    // Encabezado profesional
    doc.fontSize(22).font('Helvetica-Bold').text("Banco Raiz Finaciera - Contrato de Servicios Bancarios y Seguros", { align: "center" });
    doc.moveDown();

    // Sección de datos personales
    doc.fontSize(14).text("DATOS DEL CLIENTE", { underline: true, align: "center" }).moveDown(0.5);
    doc.fontSize(12).list([
        `ID: ${user._id}`,
        `Email: ${user.email}`,
        `Nombre Completo: ${user.nombre1} ${user.nombre2 || ''} ${user.apellido1} ${user.apellido2 || ''}`,
        `RUT: ${user.rut}`,
        `Rol: ${user.role}`,
        `Teléfono: ${user.telefono}`,
        `Número de Documento: ${user.numero_documento}`
    ], { bulletRadius: 2, align: "left" });
    doc.moveDown();

    // Términos y condiciones
    doc.fontSize(14).text("TÉRMINOS Y CONDICIONES", { underline: true, align: "center" }).moveDown(0.5);
    doc.fontSize(12).list([
        "El cliente es responsable de todas las transacciones realizadas.",
        "La tarjeta tiene un límite según evaluación crediticia y revisión periódica.",
        "La notificación de pérdida o robo debe realizarse inmediatamente.",
        "El incumplimiento de pagos afectará la cobertura del seguro.",
        "El banco y aseguradora se reservan el derecho a modificar condiciones."
    ], { bulletRadius: 2 });
    doc.moveDown();

    // Validaciones adicionales
    doc.fontSize(14).text("REQUISITOS ADICIONALES", { underline: true, align: "center" }).moveDown(0.5);
    doc.fontSize(12).list([
        "Presentar identificación válida y vigente.",
        "Certificado de ingresos y antecedentes financieros.",
        "Comprobante de domicilio actualizado."
    ], { bulletRadius: 2 });
    doc.moveDown();

    // Firmas y fecha
    doc.moveDown();
    doc.text("FIRMA DOC: " + firma_oficial, { align: "right" });
    doc.fontSize(12).text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, { align: "right" });
    doc.moveDown();
    doc.moveDown();
    doc.text(generarFirmaCliente(user), { align: "left" }).moveDown();
    doc.moveDown();
    doc.text(generarFirmaBanco(), { align: "left" }).moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.end();

    logger.info(nameGenerarDocController + "Contrato bancario y de seguros generado en:", rutaArchivo);
    logger.info(nameGenerarDocController + `FIRMA: ${firma_oficial}`);
    return {
        codigo_verificador: firma_oficial,
        nombre_contrato: nombre_contrato,
        rutaPDF:rutaArchivo
    }
}


export const generarDatosTarjeta = () => {
    const generarNumeroTarjeta = () => {
        const bloques = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000));
        return bloques.join("-");
    };

    const generarFechaExpiracion = () => {
        const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
        const anio = String(new Date().getFullYear() % 100 + Math.floor(Math.random() * 5) + 1).slice(-2);
        return `${mes}/${anio}`;
    };

    const generarCVV = () => String(Math.floor(100 + Math.random() * 900));

    return {
        numero_tarjeta: generarNumeroTarjeta(),
        fecha_expiracion: generarFechaExpiracion(),
        cvv: generarCVV(),
        limite_credito: Math.floor(Math.random() * 5000000) + 100000,
        saldo_disponible: Math.floor(Math.random() * 5000000),
        estado: "activa",
        fecha_emision: new Date()
    };
};
/*const usuarioEjemplo = {
    _id: "12345",
    email: "maximiliano@correo.com",
    nombre1: "Maximiliano",
    nombre2: "Andrés",
    apellido1: "Caniullan",
    apellido2: "Lefiñir",
    rut: "19174477-2",
    role: "Cliente",
    telefono: "+56953799966",
    numero_documento: "123.123.123"
};
*/
// Ejemplo de uso
//Firma_Validadora();
//generarContratoPDF(usuarioEjemplo, "./public/img/Logo_Cuadro.png");

