export const intentResponses = {
    saludo: "¡Hola! ¿En qué puedo ayudarte hoy?",
    despedida: "¡Hasta luego! Si necesitas algo más, aquí estaré.",
    consulta_prestamo: "Ofrecemos préstamos personales con tasas competitivas. ¿Te gustaría saber los requisitos?",
    consulta_tarjeta: "Tenemos tarjetas de crédito con diferentes beneficios. ¿Te interesa la Clásica, Oro o Black? (Solo escribe :'CLASICA' , 'ORO' o 'BLACK')",
    consulta_seguro: "Brindamos seguros de vida, salud y auto. ¿Cuál te interesa?",
    requisitos: "Puedo proporcionarte los requisitos para Tarjetas o Seguros. ¿Te gustaría conocerlos antes de contratar,  escribe 'tarjetas' o 'seguros'?",
    unknown: "Lo siento, no entiendo tu consulta. ¿Podrías reformularla?"
};


export const intentFollowUp = {
    consulta_prestamo: { si: `Requisitos para Solicitar un Préstamo Financiero... LOS TENGO QUE CREAR AUN JAAJAJ`, no: "Bueno, ¿en qué más te puedo ayudar?" },
    consulta_tarjeta: {
        clasica: "La tarjeta Clásica tiene un límite de crédito estándar y pocos requisitos. ¿Te gustaría solicitarla o conocer sus requisitos?",
        oro: "La tarjeta Oro requiere ingresos comprobables de al menos $50,000 mensuales. ¿Te interesa solicitarla o conocer sus requisitos?",
        black: "La tarjeta Black ofrece beneficios premium y altos límites de crédito. ¿Te gustaría solicitarla o conocer sus requisitos?"
    },
    consulta_seguro: {
        vida: "El seguro de vida ofrece cobertura total en caso de fallecimiento o invalidez. ¿Te interesa conocer sus requisitos?",
        salud: "El seguro de salud cubre emergencias y consultas médicas. ¿Te interesa conocer sus requisitos?",
        auto: "El seguro de auto protege contra daños y robos. ¿Te interesa conocer sus requisitos?"
    }
};


export const requisitosDetails = {
    clasica: `
        Requisitos de la Tarjeta Clásica: 
        \n - Ingreso mínimo de $20,000 
        \n - Identificación oficial vigente 
        \n - Comprobante de domicilio 
        \n - Aquí tienes el enlace para firmar el contrato de la Tarjeta Clásica: <a>"/pdf"</a> 
    `,
    oro: `
        Requisitos de la Tarjeta Oro:
        - Ingreso mínimo de $50,000
        - Identificación oficial vigente
        - Comprobante de domicilio
        - Buen historial crediticio
        - Aquí tienes el enlace para firmar el contrato de la Tarjeta Oro: ENLACE
    `,
    black: `
        Requisitos de la Tarjeta Black:
        - Ingreso mínimo de $100,000
        - Identificación oficial vigente
        - Comprobante de domicilio
        - Excelente historial crediticio
        - Antigüedad laboral de 2 años
        - Aquí tienes el enlace para firmar el contrato de la Tarjeta Black: ENLACE
    `,
    vida: `
        Requisitos del Seguro de Vida:
        - Identificación oficial vigente
        - Cuestionario médico
        - Comprobante de domicilio
        - Aquí tienes el enlace para contratar el Seguro de Vida: ENLACE
    `,
    salud: `
        Requisitos del Seguro de Salud:
        - Identificación oficial vigente
        - Cuestionario médico
        - Comprobante de domicilio
        - Aquí tienes el enlace para contratar el Seguro de Salud: ENLACE
    `,
    auto: `
        Requisitos del Seguro de Auto:
        - Identificación oficial vigente
        - Documentos del vehículo
        - Comprobante de domicilio
        - Aquí tienes el enlace para contratar el Seguro de Auto: ENLACE
    `
};


export const intentFinalSteps = {
    tarjeta_clasica: { si: "Perfecto, aquí tienes el enlace para firmar el contrato de la Tarjeta Clásica", no: "Entendido, ¿en qué más puedo ayudarte?" },
    tarjeta_oro: { si: "Perfecto, aquí tienes el enlace para firmar el contrato de la Tarjeta Oro", no: "Entendido, ¿en qué más puedo ayudarte?" },
    tarjeta_black: { si: "Perfecto, aquí tienes el enlace para firmar el contrato de la Tarjeta Black", no: "Entendido, ¿en qué más puedo ayudarte?" },
    seguro_vida: { si: "Perfecto, aquí tienes el enlace para contratar el Seguro de Vida", no: "Entendido, ¿en qué más puedo ayudarte?" },
    seguro_salud: { si: "Perfecto, aquí tienes el enlace para contratar el Seguro de Salud", no: "Entendido, ¿en qué más puedo ayudarte?" },
    seguro_auto: { si: "Perfecto, aquí tienes el enlace para contratar el Seguro de Auto", no: "Entendido, ¿en qué más puedo ayudarte?" }
};