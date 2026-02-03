/**
 * CASOS DE USO Y HISTORIAS DE USUARIO PARA LIA
 *
 * Este archivo contiene ejemplos de entrenamiento para mejorar
 * la capacidad de Lia de ejecutar acciones en páginas web.
 *
 * Formato:
 * - user: Lo que dice el usuario
 * - context: Tipo de página/situación
 * - response: Respuesta de Lia con acciones
 * - actions: Lista de acciones a ejecutar
 */

export const TRAINING_CASES = [
  // =============================================
  // CATEGORÍA 1: BÚSQUEDAS (1-25)
  // =============================================
  {
    id: 1,
    category: "búsqueda",
    user: "busca zapatos deportivos",
    context: "Tienda online con barra de búsqueda",
    response: "Buscando zapatos deportivos [ACTION:type:3:zapatos deportivos][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 2,
    category: "búsqueda",
    user: "encuentra vuelos a Madrid",
    context: "Página de aerolínea o buscador de vuelos",
    response: "Buscando vuelos a Madrid [ACTION:type:5:Madrid][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 3,
    category: "búsqueda",
    user: "busca restaurantes italianos cerca",
    context: "Google Maps o buscador",
    response: "Buscando restaurantes italianos [ACTION:type:2:restaurantes italianos cerca de mí][ACTION:submit:2]",
    actions: ["type", "submit"]
  },
  {
    id: 4,
    category: "búsqueda",
    user: "quiero ver laptops gaming",
    context: "Amazon o tienda de electrónicos",
    response: "Buscando laptops gaming [ACTION:type:4:laptops gaming][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 5,
    category: "búsqueda",
    user: "busca hoteles en Cancún para 2 personas",
    context: "Booking, Expedia o buscador de hoteles",
    response: "Buscando hoteles en Cancún [ACTION:type:3:hoteles Cancún 2 personas][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 6,
    category: "búsqueda",
    user: "encuentra el iPhone 15 Pro",
    context: "Tienda Apple o marketplace",
    response: "Buscando iPhone 15 Pro [ACTION:type:2:iPhone 15 Pro][ACTION:submit:2]",
    actions: ["type", "submit"]
  },
  {
    id: 7,
    category: "búsqueda",
    user: "busca trabajos de programador",
    context: "LinkedIn, Indeed o portal de empleo",
    response: "Buscando empleos de programador [ACTION:type:4:programador][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 8,
    category: "búsqueda",
    user: "quiero encontrar cursos de Python",
    context: "Udemy, Coursera o plataforma educativa",
    response: "Buscando cursos de Python [ACTION:type:3:Python][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 9,
    category: "búsqueda",
    user: "busca recetas de pasta",
    context: "Sitio de recetas o Google",
    response: "Buscando recetas de pasta [ACTION:type:2:recetas de pasta][ACTION:submit:2]",
    actions: ["type", "submit"]
  },
  {
    id: 10,
    category: "búsqueda",
    user: "encuentra departamentos en renta en CDMX",
    context: "Inmuebles24, Vivanuncios o portal inmobiliario",
    response: "Buscando departamentos [ACTION:type:5:departamentos renta CDMX][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 11,
    category: "búsqueda",
    user: "busca películas de terror",
    context: "Netflix, Prime Video o plataforma de streaming",
    response: "Buscando películas de terror [ACTION:type:3:terror][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 12,
    category: "búsqueda",
    user: "quiero ver noticias sobre tecnología",
    context: "Portal de noticias",
    response: "Buscando noticias de tecnología [ACTION:type:2:tecnología][ACTION:submit:2]",
    actions: ["type", "submit"]
  },
  {
    id: 13,
    category: "búsqueda",
    user: "encuentra videos de yoga para principiantes",
    context: "YouTube",
    response: "Buscando videos de yoga [ACTION:type:4:yoga para principiantes][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 14,
    category: "búsqueda",
    user: "busca libros de ciencia ficción",
    context: "Amazon Books, Gandhi o librería online",
    response: "Buscando libros de ciencia ficción [ACTION:type:3:ciencia ficción][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 15,
    category: "búsqueda",
    user: "encuentra médicos cerca de mí",
    context: "Doctoralia o directorio médico",
    response: "Buscando médicos cercanos [ACTION:type:2:médicos cerca de mí][ACTION:submit:2]",
    actions: ["type", "submit"]
  },
  {
    id: 16,
    category: "búsqueda",
    user: "busca ofertas de televisores",
    context: "Mercado Libre, Amazon o tienda de electrónicos",
    response: "Buscando ofertas de televisores [ACTION:type:4:televisores oferta][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 17,
    category: "búsqueda",
    user: "quiero ver autos usados Toyota",
    context: "Seminuevos, Kavak o portal de autos",
    response: "Buscando autos Toyota usados [ACTION:type:3:Toyota usado][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 18,
    category: "búsqueda",
    user: "encuentra gimnasios cerca",
    context: "Google Maps o directorio local",
    response: "Buscando gimnasios cercanos [ACTION:type:2:gimnasios cerca de mí][ACTION:submit:2]",
    actions: ["type", "submit"]
  },
  {
    id: 19,
    category: "búsqueda",
    user: "busca tutoriales de Excel",
    context: "YouTube o plataforma educativa",
    response: "Buscando tutoriales de Excel [ACTION:type:4:tutorial Excel][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 20,
    category: "búsqueda",
    user: "encuentra ropa para niños",
    context: "Tienda de ropa o marketplace",
    response: "Buscando ropa para niños [ACTION:type:3:ropa niños][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 21,
    category: "búsqueda",
    user: "busca música de los 80s",
    context: "Spotify, YouTube Music o plataforma de música",
    response: "Buscando música de los 80s [ACTION:type:2:música años 80][ACTION:submit:2]",
    actions: ["type", "submit"]
  },
  {
    id: 22,
    category: "búsqueda",
    user: "encuentra boletos para el concierto",
    context: "Ticketmaster, StubHub o boletería",
    response: "Buscando boletos [ACTION:type:4:concierto][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 23,
    category: "búsqueda",
    user: "busca muebles de oficina",
    context: "IKEA, Office Depot o tienda de muebles",
    response: "Buscando muebles de oficina [ACTION:type:3:muebles oficina][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 24,
    category: "búsqueda",
    user: "quiero ver reseñas del Galaxy S24",
    context: "YouTube, Google o sitio de reviews",
    response: "Buscando reseñas Galaxy S24 [ACTION:type:2:Samsung Galaxy S24 review][ACTION:submit:2]",
    actions: ["type", "submit"]
  },
  {
    id: 25,
    category: "búsqueda",
    user: "encuentra seguro de auto barato",
    context: "Comparador de seguros o aseguradora",
    response: "Buscando seguros de auto [ACTION:type:5:seguro auto económico][ACTION:submit:5]",
    actions: ["type", "submit"]
  },

  // =============================================
  // CATEGORÍA 2: CORREO ELECTRÓNICO (26-55)
  // =============================================
  {
    id: 26,
    category: "correo",
    user: "crea un correo para juan@empresa.com",
    context: "Gmail con botón Redactar visible",
    response: "Creando correo nuevo [ACTION:click:2][ACTION:type:5:juan@empresa.com]",
    actions: ["click", "type"]
  },
  {
    id: 27,
    category: "correo",
    user: "redacta un email para mi jefe sobre las vacaciones",
    context: "Gmail abierto",
    response: "Redactando correo [ACTION:click:3][ACTION:type:7:jefe@empresa.com][ACTION:type:10:Solicitud de vacaciones][ACTION:type:14:Estimado, le escribo para solicitar mis días de vacaciones correspondientes. Quedo atento a su respuesta. Saludos.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 28,
    category: "correo",
    user: "envía un correo a soporte preguntando por mi pedido #12345",
    context: "Gmail o Outlook",
    response: "Creando correo de soporte [ACTION:click:2][ACTION:type:6:soporte@tienda.com][ACTION:type:9:Consulta pedido #12345][ACTION:type:13:Hola, quisiera saber el estado de mi pedido #12345. Gracias por su atención.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 29,
    category: "correo",
    user: "escribe un email de agradecimiento a recursos humanos",
    context: "Cliente de correo",
    response: "Redactando agradecimiento [ACTION:click:3][ACTION:type:7:rh@empresa.com][ACTION:type:10:Agradecimiento][ACTION:type:14:Estimado equipo de RH, quiero expresar mi agradecimiento por su apoyo durante el proceso. Saludos cordiales.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 30,
    category: "correo",
    user: "manda un mensaje a mi equipo sobre la reunión de mañana",
    context: "Gmail con ventana de redacción",
    response: "Enviando a equipo [ACTION:click:2][ACTION:type:5:equipo@empresa.com][ACTION:type:8:Recordatorio: Reunión mañana][ACTION:type:12:Hola equipo, les recuerdo que mañana tenemos reunión a las 10am. Por favor confirmen asistencia.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 31,
    category: "correo",
    user: "crea un correo formal para el cliente sobre el proyecto",
    context: "Outlook o Gmail",
    response: "Redactando correo formal [ACTION:click:3][ACTION:type:6:cliente@empresa.com][ACTION:type:9:Actualización del proyecto][ACTION:type:13:Estimado cliente, me permito informarle sobre el avance del proyecto. Quedamos a sus órdenes para cualquier consulta.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 32,
    category: "correo",
    user: "responde este correo diciendo que acepto la propuesta",
    context: "Gmail con correo abierto",
    response: "Respondiendo correo [ACTION:click:8][ACTION:type:12:Estimado, he revisado la propuesta y me complace informarle que la acepto. Procederemos según lo acordado. Saludos.]",
    actions: ["click", "type"]
  },
  {
    id: 33,
    category: "correo",
    user: "reenvía este email a mi colega carlos@empresa.com",
    context: "Correo abierto en Gmail",
    response: "Reenviando correo [ACTION:click:10][ACTION:type:6:carlos@empresa.com][ACTION:type:14:Carlos, te comparto este correo para tu conocimiento.]",
    actions: ["click", "type", "type"]
  },
  {
    id: 34,
    category: "correo",
    user: "escribe un correo de disculpa por el retraso",
    context: "Gmail",
    response: "Redactando disculpa [ACTION:click:2][ACTION:type:5:destinatario@email.com][ACTION:type:8:Disculpas por el retraso][ACTION:type:12:Estimado, le ofrezco una sincera disculpa por el retraso en la entrega. Estamos trabajando para resolver la situación lo antes posible.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 35,
    category: "correo",
    user: "manda un email de seguimiento sobre la cotización",
    context: "Outlook",
    response: "Enviando seguimiento [ACTION:click:3][ACTION:type:7:ventas@proveedor.com][ACTION:type:10:Seguimiento cotización][ACTION:type:14:Buen día, me permito dar seguimiento a la cotización solicitada la semana pasada. Agradezco su pronta respuesta.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 36,
    category: "correo",
    user: "crea un correo invitando a la fiesta del viernes",
    context: "Gmail personal",
    response: "Creando invitación [ACTION:click:2][ACTION:type:5:amigos@grupo.com][ACTION:type:8:¡Están invitados! Fiesta viernes][ACTION:type:12:¡Hola a todos! Los invito a una fiesta este viernes a las 8pm en mi casa. ¡Los espero!]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 37,
    category: "correo",
    user: "escribe un email solicitando información sobre el curso",
    context: "Cualquier cliente de correo",
    response: "Solicitando información [ACTION:click:3][ACTION:type:6:info@escuela.com][ACTION:type:9:Solicitud de información - Curso][ACTION:type:13:Buen día, me interesa obtener información sobre el curso que ofrecen. ¿Podrían enviarme los detalles de fechas, costos y requisitos?]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 38,
    category: "correo",
    user: "responde que confirmo mi asistencia",
    context: "Gmail con invitación abierta",
    response: "Confirmando asistencia [ACTION:click:7][ACTION:type:11:Confirmo mi asistencia al evento. Gracias por la invitación.]",
    actions: ["click", "type"]
  },
  {
    id: 39,
    category: "correo",
    user: "manda un correo de bienvenida al nuevo empleado",
    context: "Outlook corporativo",
    response: "Enviando bienvenida [ACTION:click:2][ACTION:type:6:nuevo.empleado@empresa.com][ACTION:type:9:¡Bienvenido al equipo!][ACTION:type:13:¡Hola! Te damos la más cordial bienvenida a nuestro equipo. Estamos muy contentos de tenerte con nosotros. No dudes en contactarme si necesitas ayuda.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 40,
    category: "correo",
    user: "crea un email de renuncia formal",
    context: "Gmail o Outlook",
    response: "Redactando renuncia [ACTION:click:3][ACTION:type:7:rh@empresa.com][ACTION:type:10:Carta de renuncia][ACTION:type:14:Estimados, por medio de la presente presento mi renuncia voluntaria a partir del día de hoy, con el preaviso correspondiente. Agradezco las oportunidades brindadas.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 41,
    category: "correo",
    user: "envía un recordatorio del pago pendiente",
    context: "Gmail de cobranza",
    response: "Enviando recordatorio [ACTION:click:2][ACTION:type:5:cliente@email.com][ACTION:type:8:Recordatorio de pago pendiente][ACTION:type:12:Estimado cliente, le recordamos que tiene un pago pendiente. Por favor realice su pago a la brevedad para evitar cargos adicionales.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 42,
    category: "correo",
    user: "escribe un correo preguntando por el estatus de mi solicitud",
    context: "Cualquier cliente de correo",
    response: "Preguntando estatus [ACTION:click:3][ACTION:type:6:tramites@institucion.com][ACTION:type:9:Consulta estatus de solicitud][ACTION:type:13:Buen día, quisiera conocer el estatus de mi solicitud con folio #XXX presentada hace dos semanas. Agradezco su atención.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 43,
    category: "correo",
    user: "manda un email de felicitación por el ascenso",
    context: "Gmail corporativo",
    response: "Enviando felicitación [ACTION:click:2][ACTION:type:5:colega@empresa.com][ACTION:type:8:¡Felicidades por tu ascenso!][ACTION:type:12:¡Muchas felicidades! Tu esfuerzo y dedicación han sido reconocidos. Te deseo mucho éxito en tu nueva posición.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 44,
    category: "correo",
    user: "crea un correo solicitando una reunión",
    context: "Outlook",
    response: "Solicitando reunión [ACTION:click:3][ACTION:type:7:director@empresa.com][ACTION:type:10:Solicitud de reunión][ACTION:type:14:Estimado Director, solicito una reunión para discutir los avances del proyecto. ¿Tendría disponibilidad esta semana? Quedo atento a su confirmación.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 45,
    category: "correo",
    user: "responde que no podré asistir por motivos personales",
    context: "Gmail con invitación",
    response: "Declinando invitación [ACTION:click:8][ACTION:type:12:Agradezco la invitación, pero lamentablemente no podré asistir por motivos personales. Espero poder estar presente en la próxima ocasión.]",
    actions: ["click", "type"]
  },
  {
    id: 46,
    category: "correo",
    user: "envía un email con el reporte adjunto",
    context: "Gmail con botón de adjuntar",
    response: "Enviando con adjunto [ACTION:click:2][ACTION:type:5:gerente@empresa.com][ACTION:type:8:Reporte mensual adjunto][ACTION:type:12:Adjunto encontrará el reporte mensual solicitado. Quedo a sus órdenes para cualquier aclaración.][ACTION:click:15]",
    actions: ["click", "type", "type", "type", "click"]
  },
  {
    id: 47,
    category: "correo",
    user: "escribe un correo de queja sobre el servicio",
    context: "Cualquier cliente de correo",
    response: "Redactando queja [ACTION:click:3][ACTION:type:6:quejas@empresa.com][ACTION:type:9:Queja por mal servicio][ACTION:type:13:Estimados, me dirijo a ustedes para expresar mi inconformidad con el servicio recibido. Espero una pronta solución a esta situación.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 48,
    category: "correo",
    user: "manda un email de networking a un contacto de LinkedIn",
    context: "Gmail personal",
    response: "Enviando networking [ACTION:click:2][ACTION:type:5:profesional@email.com][ACTION:type:8:Conexión desde LinkedIn][ACTION:type:12:Hola, fue un gusto conectar en LinkedIn. Me encantaría conocer más sobre tu trabajo y explorar posibles colaboraciones. ¿Te parece si agendamos una llamada?]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 49,
    category: "correo",
    user: "crea un correo cancelando la suscripción",
    context: "Gmail",
    response: "Cancelando suscripción [ACTION:click:3][ACTION:type:7:suscripciones@servicio.com][ACTION:type:10:Solicitud de cancelación][ACTION:type:14:Solicito la cancelación de mi suscripción con efecto inmediato. Mi número de cuenta es XXX. Agradezco confirmen la cancelación.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 50,
    category: "correo",
    user: "responde agradeciendo la oportunidad de entrevista",
    context: "Gmail con correo de RH",
    response: "Agradeciendo entrevista [ACTION:click:8][ACTION:type:12:Estimado equipo de RH, agradezco la oportunidad de entrevista. Fue un placer conocer más sobre la empresa y el puesto. Quedo atento al siguiente paso del proceso.]",
    actions: ["click", "type"]
  },
  {
    id: 51,
    category: "correo",
    user: "escribe un email informando que estoy enfermo",
    context: "Outlook corporativo",
    response: "Reportando enfermedad [ACTION:click:2][ACTION:type:5:jefe@empresa.com][ACTION:type:8:Incapacidad por enfermedad][ACTION:type:12:Buenos días, le informo que no podré presentarme hoy por motivos de salud. Estaré atento al correo y retomaré mis actividades lo antes posible.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 52,
    category: "correo",
    user: "manda una propuesta comercial al cliente potencial",
    context: "Gmail de ventas",
    response: "Enviando propuesta [ACTION:click:3][ACTION:type:6:prospecto@empresa.com][ACTION:type:9:Propuesta comercial personalizada][ACTION:type:13:Estimado cliente, me permito hacerle llegar nuestra propuesta comercial diseñada según sus necesidades. Quedo a sus órdenes para resolver cualquier duda.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 53,
    category: "correo",
    user: "crea un correo pidiendo referencias laborales",
    context: "Gmail",
    response: "Solicitando referencias [ACTION:click:2][ACTION:type:5:exjefe@empresa.com][ACTION:type:8:Solicitud de carta de recomendación][ACTION:type:12:Estimado, me encuentro en búsqueda de empleo y me preguntaba si podría proporcionarme una carta de recomendación basada en mi desempeño. Agradezco de antemano su apoyo.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 54,
    category: "correo",
    user: "envía un email de seguimiento post-reunión",
    context: "Outlook",
    response: "Enviando seguimiento [ACTION:click:3][ACTION:type:7:participantes@empresa.com][ACTION:type:10:Resumen y siguientes pasos - Reunión][ACTION:type:14:Estimados, gracias por su participación en la reunión de hoy. Adjunto el resumen de los acuerdos y próximos pasos. Quedo atento a sus comentarios.]",
    actions: ["click", "type", "type", "type"]
  },
  {
    id: 55,
    category: "correo",
    user: "escribe pidiendo extensión del plazo de entrega",
    context: "Gmail académico o laboral",
    response: "Solicitando extensión [ACTION:click:2][ACTION:type:5:profesor@universidad.com][ACTION:type:8:Solicitud de extensión de plazo][ACTION:type:12:Estimado profesor, debido a circunstancias imprevistas, solicito respetuosamente una extensión de 3 días para la entrega del trabajo. Agradezco su comprensión.]",
    actions: ["click", "type", "type", "type"]
  },

  // =============================================
  // CATEGORÍA 3: NAVEGACIÓN WEB (56-80)
  // =============================================
  {
    id: 56,
    category: "navegación",
    user: "ve a la sección de ofertas",
    context: "Tienda online con menú de navegación",
    response: "Yendo a ofertas [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 57,
    category: "navegación",
    user: "abre mi carrito de compras",
    context: "E-commerce con ícono de carrito",
    response: "Abriendo carrito [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 58,
    category: "navegación",
    user: "llévame a la página de contacto",
    context: "Sitio web con menú footer",
    response: "Navegando a contacto [ACTION:click:25]",
    actions: ["click"]
  },
  {
    id: 59,
    category: "navegación",
    user: "entra a mi cuenta",
    context: "Sitio con botón de login/cuenta",
    response: "Accediendo a tu cuenta [ACTION:click:5]",
    actions: ["click"]
  },
  {
    id: 60,
    category: "navegación",
    user: "ve a la categoría de electrónicos",
    context: "Marketplace con categorías",
    response: "Navegando a electrónicos [ACTION:click:15]",
    actions: ["click"]
  },
  {
    id: 61,
    category: "navegación",
    user: "abre el menú de configuración",
    context: "Aplicación web con settings",
    response: "Abriendo configuración [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 62,
    category: "navegación",
    user: "llévame a ver mis pedidos",
    context: "Tienda online con área de usuario",
    response: "Yendo a mis pedidos [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 63,
    category: "navegación",
    user: "abre la sección de ayuda",
    context: "Sitio con centro de ayuda",
    response: "Abriendo ayuda [ACTION:click:18]",
    actions: ["click"]
  },
  {
    id: 64,
    category: "navegación",
    user: "ve al inicio",
    context: "Cualquier sitio con logo/home",
    response: "Volviendo al inicio [ACTION:click:1]",
    actions: ["click"]
  },
  {
    id: 65,
    category: "navegación",
    user: "entra a la sección de hombre",
    context: "Tienda de ropa",
    response: "Navegando a sección hombre [ACTION:click:9]",
    actions: ["click"]
  },
  {
    id: 66,
    category: "navegación",
    user: "abre mis notificaciones",
    context: "Red social o app con campana",
    response: "Abriendo notificaciones [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 67,
    category: "navegación",
    user: "ve a ver los términos y condiciones",
    context: "Sitio con footer legal",
    response: "Navegando a términos [ACTION:click:30]",
    actions: ["click"]
  },
  {
    id: 68,
    category: "navegación",
    user: "entra al foro de la comunidad",
    context: "Sitio con sección de comunidad",
    response: "Accediendo al foro [ACTION:click:14]",
    actions: ["click"]
  },
  {
    id: 69,
    category: "navegación",
    user: "llévame a descargar la app",
    context: "Sitio con link a app store",
    response: "Yendo a descarga de app [ACTION:click:22]",
    actions: ["click"]
  },
  {
    id: 70,
    category: "navegación",
    user: "abre el blog",
    context: "Sitio corporativo",
    response: "Abriendo blog [ACTION:click:11]",
    actions: ["click"]
  },
  {
    id: 71,
    category: "navegación",
    user: "ve a la galería de fotos",
    context: "Sitio de fotografía o portafolio",
    response: "Navegando a galería [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 72,
    category: "navegación",
    user: "entra a ver las reseñas",
    context: "Página de producto",
    response: "Yendo a reseñas [ACTION:click:16]",
    actions: ["click"]
  },
  {
    id: 73,
    category: "navegación",
    user: "llévame al checkout",
    context: "E-commerce con carrito lleno",
    response: "Procediendo al checkout [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 74,
    category: "navegación",
    user: "abre el mapa del sitio",
    context: "Sitio con sitemap",
    response: "Abriendo mapa del sitio [ACTION:click:28]",
    actions: ["click"]
  },
  {
    id: 75,
    category: "navegación",
    user: "ve a la sección de preguntas frecuentes",
    context: "Sitio con FAQ",
    response: "Navegando a FAQ [ACTION:click:20]",
    actions: ["click"]
  },
  {
    id: 76,
    category: "navegación",
    user: "entra a mis favoritos",
    context: "Tienda online con wishlist",
    response: "Abriendo favoritos [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 77,
    category: "navegación",
    user: "llévame a ver los nuevos productos",
    context: "E-commerce con sección novedades",
    response: "Yendo a nuevos productos [ACTION:click:13]",
    actions: ["click"]
  },
  {
    id: 78,
    category: "navegación",
    user: "abre el menú de idiomas",
    context: "Sitio multiidioma",
    response: "Abriendo selector de idioma [ACTION:click:4]",
    actions: ["click"]
  },
  {
    id: 79,
    category: "navegación",
    user: "ve a la política de privacidad",
    context: "Sitio con footer legal",
    response: "Navegando a privacidad [ACTION:click:31]",
    actions: ["click"]
  },
  {
    id: 80,
    category: "navegación",
    user: "entra al área de socios",
    context: "Sitio B2B",
    response: "Accediendo a área de socios [ACTION:click:17]",
    actions: ["click"]
  },

  // =============================================
  // CATEGORÍA 4: FORMULARIOS (81-110)
  // =============================================
  {
    id: 81,
    category: "formulario",
    user: "llena el formulario de registro con mis datos",
    context: "Página de registro",
    response: "Llenando registro [ACTION:type:3:Juan Pérez][ACTION:type:5:juan@email.com][ACTION:type:7:contraseña123][ACTION:type:9:contraseña123][ACTION:click:12]",
    actions: ["type", "type", "type", "type", "click"]
  },
  {
    id: 82,
    category: "formulario",
    user: "completa el formulario de contacto",
    context: "Página de contacto",
    response: "Completando formulario [ACTION:type:4:María García][ACTION:type:6:maria@email.com][ACTION:type:8:Consulta general][ACTION:type:10:Me gustaría obtener más información sobre sus servicios.][ACTION:click:14]",
    actions: ["type", "type", "type", "type", "click"]
  },
  {
    id: 83,
    category: "formulario",
    user: "rellena los datos de envío",
    context: "Checkout de tienda online",
    response: "Llenando datos de envío [ACTION:type:5:Juan Pérez][ACTION:type:7:Calle Principal 123][ACTION:type:9:Ciudad][ACTION:type:11:12345][ACTION:type:13:5551234567]",
    actions: ["type", "type", "type", "type", "type"]
  },
  {
    id: 84,
    category: "formulario",
    user: "ingresa mi email en el newsletter",
    context: "Popup o footer de suscripción",
    response: "Suscribiendo al newsletter [ACTION:type:3:usuario@email.com][ACTION:click:5]",
    actions: ["type", "click"]
  },
  {
    id: 85,
    category: "formulario",
    user: "llena la solicitud de empleo",
    context: "Portal de empleo",
    response: "Completando solicitud [ACTION:type:4:Carlos Rodríguez][ACTION:type:6:carlos@email.com][ACTION:type:8:5551234567][ACTION:type:12:Desarrollador con 5 años de experiencia...][ACTION:click:18]",
    actions: ["type", "type", "type", "type", "click"]
  },
  {
    id: 86,
    category: "formulario",
    user: "completa el login con mi correo y contraseña",
    context: "Página de inicio de sesión",
    response: "Iniciando sesión [ACTION:type:3:usuario@email.com][ACTION:type:5:micontraseña][ACTION:click:8]",
    actions: ["type", "type", "click"]
  },
  {
    id: 87,
    category: "formulario",
    user: "rellena el formulario de reservación",
    context: "Sitio de hotel o restaurante",
    response: "Haciendo reservación [ACTION:type:4:Ana López][ACTION:type:6:ana@email.com][ACTION:type:8:2024-12-20][ACTION:type:10:20:00][ACTION:type:12:4 personas][ACTION:click:15]",
    actions: ["type", "type", "type", "type", "type", "click"]
  },
  {
    id: 88,
    category: "formulario",
    user: "llena los datos de facturación",
    context: "Checkout con factura",
    response: "Llenando facturación [ACTION:type:5:Empresa SA de CV][ACTION:type:7:RFC123456ABC][ACTION:type:9:Av. Reforma 100][ACTION:type:11:empresa@email.com]",
    actions: ["type", "type", "type", "type"]
  },
  {
    id: 89,
    category: "formulario",
    user: "completa la encuesta de satisfacción",
    context: "Formulario de feedback",
    response: "Completando encuesta [ACTION:click:5][ACTION:click:10][ACTION:type:15:Muy buen servicio, recomendado.][ACTION:click:18]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 90,
    category: "formulario",
    user: "ingresa el código de descuento SAVE20",
    context: "Carrito de compras",
    response: "Aplicando código [ACTION:type:8:SAVE20][ACTION:click:10]",
    actions: ["type", "click"]
  },
  {
    id: 91,
    category: "formulario",
    user: "llena el formulario de devolución",
    context: "Página de devoluciones",
    response: "Iniciando devolución [ACTION:type:4:123456789][ACTION:type:6:Producto defectuoso][ACTION:type:10:El producto llegó dañado y no funciona correctamente.][ACTION:click:14]",
    actions: ["type", "type", "type", "click"]
  },
  {
    id: 92,
    category: "formulario",
    user: "completa los datos de la tarjeta",
    context: "Formulario de pago",
    response: "Ingresando datos de pago [ACTION:type:5:4111111111111111][ACTION:type:7:12/25][ACTION:type:9:123][ACTION:type:11:Juan Pérez]",
    actions: ["type", "type", "type", "type"]
  },
  {
    id: 93,
    category: "formulario",
    user: "rellena mi dirección de entrega",
    context: "Formulario de shipping",
    response: "Llenando dirección [ACTION:type:4:Calle Principal 456, Depto 12][ACTION:type:6:Colonia Centro][ACTION:type:8:Ciudad de México][ACTION:type:10:06600][ACTION:type:12:5555551234]",
    actions: ["type", "type", "type", "type", "type"]
  },
  {
    id: 94,
    category: "formulario",
    user: "ingresa mi fecha de nacimiento",
    context: "Formulario de registro",
    response: "Ingresando fecha [ACTION:type:6:15/03/1990]",
    actions: ["type"]
  },
  {
    id: 95,
    category: "formulario",
    user: "llena el formulario de cotización",
    context: "Sitio de servicios",
    response: "Solicitando cotización [ACTION:type:4:Pedro Sánchez][ACTION:type:6:pedro@empresa.com][ACTION:type:8:5551234567][ACTION:type:12:Necesito cotización para 100 unidades del producto X.][ACTION:click:16]",
    actions: ["type", "type", "type", "type", "click"]
  },
  {
    id: 96,
    category: "formulario",
    user: "completa el formulario de queja",
    context: "Atención al cliente",
    response: "Enviando queja [ACTION:type:4:Laura Martínez][ACTION:type:6:ORD-123456][ACTION:type:10:El paquete llegó 2 semanas tarde y el contenido estaba incompleto.][ACTION:click:14]",
    actions: ["type", "type", "type", "click"]
  },
  {
    id: 97,
    category: "formulario",
    user: "rellena mis datos de perfil",
    context: "Configuración de cuenta",
    response: "Actualizando perfil [ACTION:type:5:Roberto Gómez][ACTION:type:7:@roberto_g][ACTION:type:11:Desarrollador apasionado por la tecnología.][ACTION:click:15]",
    actions: ["type", "type", "type", "click"]
  },
  {
    id: 98,
    category: "formulario",
    user: "ingresa el número de tracking",
    context: "Rastreo de paquete",
    response: "Rastreando paquete [ACTION:type:4:TRK123456789MX][ACTION:click:6]",
    actions: ["type", "click"]
  },
  {
    id: 99,
    category: "formulario",
    user: "llena el formulario de suscripción premium",
    context: "Página de upgrade",
    response: "Suscribiendo a premium [ACTION:type:5:Sofia Torres][ACTION:type:7:sofia@email.com][ACTION:click:10][ACTION:type:14:4111111111111111][ACTION:click:18]",
    actions: ["type", "type", "click", "type", "click"]
  },
  {
    id: 100,
    category: "formulario",
    user: "completa el formulario de garantía",
    context: "Registro de producto",
    response: "Registrando garantía [ACTION:type:4:SN-ABC123456][ACTION:type:6:2024-01-15][ACTION:type:8:Amazon][ACTION:type:12:Diego Hernández][ACTION:click:16]",
    actions: ["type", "type", "type", "type", "click"]
  },
  {
    id: 101,
    category: "formulario",
    user: "rellena la solicitud de crédito",
    context: "Portal bancario",
    response: "Solicitando crédito [ACTION:type:5:Miguel Ángel Flores][ACTION:type:7:FLOM850315ABC][ACTION:type:9:50000][ACTION:type:11:24][ACTION:type:15:Empleado en empresa privada con 5 años de antigüedad.][ACTION:click:20]",
    actions: ["type", "type", "type", "type", "type", "click"]
  },
  {
    id: 102,
    category: "formulario",
    user: "ingresa mis preferencias de notificación",
    context: "Configuración de app",
    response: "Configurando notificaciones [ACTION:click:5][ACTION:click:8][ACTION:click:11][ACTION:click:15]",
    actions: ["click", "click", "click", "click"]
  },
  {
    id: 103,
    category: "formulario",
    user: "llena el formulario de cita médica",
    context: "Portal de salud",
    response: "Agendando cita [ACTION:type:4:Carmen Ruiz][ACTION:type:6:1990-05-20][ACTION:type:8:Consulta general][ACTION:type:10:2024-12-15][ACTION:type:12:10:00][ACTION:click:16]",
    actions: ["type", "type", "type", "type", "type", "click"]
  },
  {
    id: 104,
    category: "formulario",
    user: "completa el registro del vehículo",
    context: "Portal de tránsito",
    response: "Registrando vehículo [ACTION:type:5:ABC-123-D][ACTION:type:7:1HGBH41JXMN109186][ACTION:type:9:Toyota][ACTION:type:11:Corolla][ACTION:type:13:2024][ACTION:click:18]",
    actions: ["type", "type", "type", "type", "type", "click"]
  },
  {
    id: 105,
    category: "formulario",
    user: "rellena la inscripción al curso",
    context: "Plataforma educativa",
    response: "Inscribiendo al curso [ACTION:type:4:Elena Castro][ACTION:type:6:elena@email.com][ACTION:type:10:Programación Web][ACTION:type:12:Nivel intermedio en desarrollo][ACTION:click:16]",
    actions: ["type", "type", "type", "type", "click"]
  },
  {
    id: 106,
    category: "formulario",
    user: "ingresa mi comentario en el producto",
    context: "Página de producto",
    response: "Dejando reseña [ACTION:click:8][ACTION:click:10][ACTION:click:12][ACTION:click:14][ACTION:click:16][ACTION:type:20:Excelente producto, cumple con lo prometido. Llegó en perfecto estado y funciona de maravilla.][ACTION:click:24]",
    actions: ["click", "click", "click", "click", "click", "type", "click"]
  },
  {
    id: 107,
    category: "formulario",
    user: "llena el formulario de reportar problema",
    context: "Soporte técnico",
    response: "Reportando problema [ACTION:type:4:La aplicación no carga][ACTION:type:8:Cada vez que intento abrir la app, se cierra sola después de la pantalla de splash.][ACTION:type:12:iPhone 14, iOS 17.1][ACTION:click:16]",
    actions: ["type", "type", "type", "click"]
  },
  {
    id: 108,
    category: "formulario",
    user: "completa el alta de beneficiario",
    context: "Portal bancario",
    response: "Agregando beneficiario [ACTION:type:5:María López][ACTION:type:7:LOPMA900101ABC][ACTION:type:9:Madre][ACTION:type:11:50][ACTION:click:15]",
    actions: ["type", "type", "type", "type", "click"]
  },
  {
    id: 109,
    category: "formulario",
    user: "rellena el formulario de sugerencias",
    context: "Buzón de sugerencias",
    response: "Enviando sugerencia [ACTION:type:4:Mejorar horarios de atención][ACTION:type:8:Sería muy útil si pudieran extender el horario de atención hasta las 8pm para quienes trabajamos.][ACTION:click:12]",
    actions: ["type", "type", "click"]
  },
  {
    id: 110,
    category: "formulario",
    user: "ingresa el código de verificación 123456",
    context: "Verificación de cuenta",
    response: "Ingresando código [ACTION:type:4:123456][ACTION:click:8]",
    actions: ["type", "click"]
  },

  // =============================================
  // CATEGORÍA 5: REDES SOCIALES (111-140)
  // =============================================
  {
    id: 111,
    category: "redes",
    user: "publica este mensaje en mi perfil",
    context: "Facebook o Twitter/X",
    response: "Publicando en perfil [ACTION:click:5][ACTION:type:8:¡Feliz de compartir este momento con ustedes!][ACTION:click:12]",
    actions: ["click", "type", "click"]
  },
  {
    id: 112,
    category: "redes",
    user: "dale like a esta publicación",
    context: "Cualquier red social",
    response: "Dando like [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 113,
    category: "redes",
    user: "comenta que está genial",
    context: "Publicación en red social",
    response: "Comentando [ACTION:click:10][ACTION:type:12:¡Está genial! 🔥][ACTION:click:15]",
    actions: ["click", "type", "click"]
  },
  {
    id: 114,
    category: "redes",
    user: "comparte esta publicación",
    context: "Facebook, LinkedIn, Twitter",
    response: "Compartiendo publicación [ACTION:click:9][ACTION:click:13]",
    actions: ["click", "click"]
  },
  {
    id: 115,
    category: "redes",
    user: "sigue a este usuario",
    context: "Instagram, Twitter, TikTok",
    response: "Siguiendo usuario [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 116,
    category: "redes",
    user: "envía un mensaje directo diciendo hola",
    context: "Instagram o Twitter DM",
    response: "Enviando mensaje [ACTION:click:8][ACTION:type:12:¡Hola! ¿Cómo estás?][ACTION:click:15]",
    actions: ["click", "type", "click"]
  },
  {
    id: 117,
    category: "redes",
    user: "guarda esta publicación",
    context: "Instagram o Facebook",
    response: "Guardando publicación [ACTION:click:11]",
    actions: ["click"]
  },
  {
    id: 118,
    category: "redes",
    user: "retuitea esto con un comentario",
    context: "Twitter/X",
    response: "Retuiteando [ACTION:click:8][ACTION:type:12:Totalmente de acuerdo con esto 👏][ACTION:click:16]",
    actions: ["click", "type", "click"]
  },
  {
    id: 119,
    category: "redes",
    user: "publica una historia",
    context: "Instagram o Facebook",
    response: "Creando historia [ACTION:click:4][ACTION:click:8][ACTION:click:14]",
    actions: ["click", "click", "click"]
  },
  {
    id: 120,
    category: "redes",
    user: "acepta la solicitud de amistad",
    context: "Facebook o LinkedIn",
    response: "Aceptando solicitud [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 121,
    category: "redes",
    user: "actualiza mi bio con esta descripción",
    context: "Perfil de red social",
    response: "Actualizando bio [ACTION:click:5][ACTION:type:10:Desarrollador | Amante del café ☕ | México 🇲🇽][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 122,
    category: "redes",
    user: "crea un nuevo tweet sobre tecnología",
    context: "Twitter/X",
    response: "Creando tweet [ACTION:click:3][ACTION:type:6:La inteligencia artificial está transformando cómo trabajamos. ¿Ya estás preparado para el futuro? #IA #Tech][ACTION:click:10]",
    actions: ["click", "type", "click"]
  },
  {
    id: 123,
    category: "redes",
    user: "publica en mi grupo de Facebook",
    context: "Grupo de Facebook",
    response: "Publicando en grupo [ACTION:click:6][ACTION:type:10:¡Hola comunidad! Quería compartir este recurso que encontré muy útil...][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 124,
    category: "redes",
    user: "silencia esta conversación",
    context: "Chat de red social",
    response: "Silenciando conversación [ACTION:click:5][ACTION:click:9]",
    actions: ["click", "click"]
  },
  {
    id: 125,
    category: "redes",
    user: "bloquea a este usuario",
    context: "Perfil de usuario",
    response: "Bloqueando usuario [ACTION:click:8][ACTION:click:12][ACTION:click:15]",
    actions: ["click", "click", "click"]
  },
  {
    id: 126,
    category: "redes",
    user: "conecta en LinkedIn con un mensaje personalizado",
    context: "Perfil de LinkedIn",
    response: "Enviando conexión [ACTION:click:6][ACTION:click:10][ACTION:type:14:Hola, me gustaría conectar contigo para compartir oportunidades profesionales. Saludos!][ACTION:click:18]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 127,
    category: "redes",
    user: "reacciona con un corazón",
    context: "Publicación de Facebook",
    response: "Reaccionando con corazón [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 128,
    category: "redes",
    user: "crea una encuesta en Twitter",
    context: "Twitter/X nuevo tweet",
    response: "Creando encuesta [ACTION:click:3][ACTION:click:8][ACTION:type:12:¿Cuál es tu lenguaje de programación favorito?][ACTION:type:16:Python][ACTION:type:18:JavaScript][ACTION:type:20:TypeScript][ACTION:type:22:Otro][ACTION:click:26]",
    actions: ["click", "click", "type", "type", "type", "type", "type", "click"]
  },
  {
    id: 129,
    category: "redes",
    user: "responde a este comentario",
    context: "Sección de comentarios",
    response: "Respondiendo comentario [ACTION:click:10][ACTION:type:14:¡Gracias por tu comentario! Totalmente de acuerdo.][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 130,
    category: "redes",
    user: "etiqueta a @usuario en mi post",
    context: "Creación de publicación",
    response: "Etiquetando usuario [ACTION:type:8:Celebrando con @usuario este logro 🎉][ACTION:click:12]",
    actions: ["type", "click"]
  },
  {
    id: 131,
    category: "redes",
    user: "deja de seguir a este usuario",
    context: "Perfil de usuario",
    response: "Dejando de seguir [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 132,
    category: "redes",
    user: "reporta esta publicación como spam",
    context: "Publicación ofensiva",
    response: "Reportando publicación [ACTION:click:9][ACTION:click:13][ACTION:click:16][ACTION:click:20]",
    actions: ["click", "click", "click", "click"]
  },
  {
    id: 133,
    category: "redes",
    user: "crea un post en LinkedIn sobre mi nuevo trabajo",
    context: "LinkedIn feed",
    response: "Publicando logro [ACTION:click:4][ACTION:type:8:¡Emocionado de compartir que he comenzado un nuevo capítulo en mi carrera! Gracias a todos por su apoyo. #NuevoTrabajo #Gratitud][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 134,
    category: "redes",
    user: "invita a mis amigos al evento",
    context: "Evento de Facebook",
    response: "Invitando amigos [ACTION:click:8][ACTION:click:12][ACTION:click:14][ACTION:click:16][ACTION:click:20]",
    actions: ["click", "click", "click", "click", "click"]
  },
  {
    id: 135,
    category: "redes",
    user: "cambia mi foto de perfil",
    context: "Configuración de perfil",
    response: "Cambiando foto [ACTION:click:5][ACTION:click:9]",
    actions: ["click", "click"]
  },
  {
    id: 136,
    category: "redes",
    user: "añade un hashtag trending a mi tweet",
    context: "Twitter/X composición",
    response: "Agregando hashtag [ACTION:type:10: #TechTwitter #Innovation][ACTION:click:14]",
    actions: ["type", "click"]
  },
  {
    id: 137,
    category: "redes",
    user: "marca esta publicación como favorita",
    context: "Twitter/X timeline",
    response: "Marcando favorito [ACTION:click:11]",
    actions: ["click"]
  },
  {
    id: 138,
    category: "redes",
    user: "únete a este grupo",
    context: "Página de grupo",
    response: "Uniéndome al grupo [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 139,
    category: "redes",
    user: "oculta esta publicación de mi feed",
    context: "Timeline de red social",
    response: "Ocultando publicación [ACTION:click:9][ACTION:click:13]",
    actions: ["click", "click"]
  },
  {
    id: 140,
    category: "redes",
    user: "agrega este video a mi lista de Ver más tarde",
    context: "YouTube",
    response: "Guardando para después [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },

  // =============================================
  // CATEGORÍA 6: COMPRAS ONLINE (141-165)
  // =============================================
  {
    id: 141,
    category: "compras",
    user: "agrega este producto al carrito",
    context: "Página de producto",
    response: "Agregando al carrito [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 142,
    category: "compras",
    user: "selecciona la talla M",
    context: "Selector de talla",
    response: "Seleccionando talla M [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 143,
    category: "compras",
    user: "cambia la cantidad a 3 unidades",
    context: "Carrito de compras",
    response: "Cambiando cantidad [ACTION:click:8][ACTION:type:10:3]",
    actions: ["click", "type"]
  },
  {
    id: 144,
    category: "compras",
    user: "aplica el cupón DESCUENTO10",
    context: "Checkout",
    response: "Aplicando cupón [ACTION:type:12:DESCUENTO10][ACTION:click:14]",
    actions: ["type", "click"]
  },
  {
    id: 145,
    category: "compras",
    user: "elige el color negro",
    context: "Selector de color",
    response: "Seleccionando negro [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 146,
    category: "compras",
    user: "procede al pago",
    context: "Carrito lleno",
    response: "Procediendo al pago [ACTION:click:15]",
    actions: ["click"]
  },
  {
    id: 147,
    category: "compras",
    user: "elimina este producto del carrito",
    context: "Carrito de compras",
    response: "Eliminando producto [ACTION:click:9]",
    actions: ["click"]
  },
  {
    id: 148,
    category: "compras",
    user: "guarda en mi lista de deseos",
    context: "Página de producto",
    response: "Guardando en wishlist [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 149,
    category: "compras",
    user: "selecciona envío express",
    context: "Opciones de envío",
    response: "Seleccionando envío express [ACTION:click:11]",
    actions: ["click"]
  },
  {
    id: 150,
    category: "compras",
    user: "compara estos dos productos",
    context: "Listado de productos",
    response: "Comparando productos [ACTION:click:7][ACTION:click:15][ACTION:click:20]",
    actions: ["click", "click", "click"]
  },
  {
    id: 151,
    category: "compras",
    user: "ordena por precio de menor a mayor",
    context: "Listado de productos",
    response: "Ordenando por precio [ACTION:click:5][ACTION:click:8]",
    actions: ["click", "click"]
  },
  {
    id: 152,
    category: "compras",
    user: "filtra por marca Apple",
    context: "Filtros de tienda",
    response: "Filtrando por Apple [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 153,
    category: "compras",
    user: "ver las especificaciones del producto",
    context: "Página de producto",
    response: "Abriendo especificaciones [ACTION:click:14]",
    actions: ["click"]
  },
  {
    id: 154,
    category: "compras",
    user: "selecciona pago con tarjeta",
    context: "Métodos de pago",
    response: "Seleccionando tarjeta [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 155,
    category: "compras",
    user: "usa mi dirección guardada",
    context: "Checkout con direcciones",
    response: "Usando dirección guardada [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 156,
    category: "compras",
    user: "añade envoltorio de regalo",
    context: "Opciones adicionales",
    response: "Añadiendo envoltorio [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 157,
    category: "compras",
    user: "compra ahora sin agregar al carrito",
    context: "Página de producto",
    response: "Comprando directamente [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 158,
    category: "compras",
    user: "ver productos similares",
    context: "Página de producto",
    response: "Viendo productos similares [ACTION:scroll:18][ACTION:click:20]",
    actions: ["scroll", "click"]
  },
  {
    id: 159,
    category: "compras",
    user: "cambia el país de envío a México",
    context: "Configuración de envío",
    response: "Cambiando país [ACTION:click:8][ACTION:click:15]",
    actions: ["click", "click"]
  },
  {
    id: 160,
    category: "compras",
    user: "suscríbete para notificación de stock",
    context: "Producto agotado",
    response: "Suscribiendo notificación [ACTION:type:8:usuario@email.com][ACTION:click:10]",
    actions: ["type", "click"]
  },
  {
    id: 161,
    category: "compras",
    user: "ver todas las imágenes del producto",
    context: "Galería de producto",
    response: "Abriendo galería [ACTION:click:5]",
    actions: ["click"]
  },
  {
    id: 162,
    category: "compras",
    user: "añade garantía extendida",
    context: "Opciones de producto",
    response: "Añadiendo garantía [ACTION:click:11]",
    actions: ["click"]
  },
  {
    id: 163,
    category: "compras",
    user: "ver opiniones de 5 estrellas",
    context: "Reseñas de producto",
    response: "Filtrando reseñas [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 164,
    category: "compras",
    user: "añade otro de diferente color al carrito",
    context: "Página de producto",
    response: "Añadiendo variante [ACTION:click:7][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 165,
    category: "compras",
    user: "confirma la compra",
    context: "Paso final de checkout",
    response: "Confirmando compra [ACTION:click:18]",
    actions: ["click"]
  },

  // =============================================
  // CATEGORÍA 7: PRODUCTIVIDAD (166-190)
  // =============================================
  {
    id: 166,
    category: "productividad",
    user: "crea un nuevo documento",
    context: "Google Docs o Word Online",
    response: "Creando documento [ACTION:click:4]",
    actions: ["click"]
  },
  {
    id: 167,
    category: "productividad",
    user: "abre el último archivo editado",
    context: "Google Drive o OneDrive",
    response: "Abriendo archivo reciente [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 168,
    category: "productividad",
    user: "comparte este documento con mi equipo",
    context: "Google Docs",
    response: "Compartiendo documento [ACTION:click:6][ACTION:type:10:equipo@empresa.com][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 169,
    category: "productividad",
    user: "descarga este archivo como PDF",
    context: "Google Docs o Sheets",
    response: "Descargando PDF [ACTION:click:5][ACTION:click:9][ACTION:click:13]",
    actions: ["click", "click", "click"]
  },
  {
    id: 170,
    category: "productividad",
    user: "agenda una reunión para mañana a las 10",
    context: "Google Calendar",
    response: "Creando evento [ACTION:click:4][ACTION:type:8:Reunión de equipo][ACTION:type:12:mañana 10:00][ACTION:click:16]",
    actions: ["click", "type", "type", "click"]
  },
  {
    id: 171,
    category: "productividad",
    user: "crea una nueva tarea",
    context: "Todoist, Asana o similar",
    response: "Creando tarea [ACTION:click:5][ACTION:type:8:Nueva tarea pendiente][ACTION:click:12]",
    actions: ["click", "type", "click"]
  },
  {
    id: 172,
    category: "productividad",
    user: "marca esta tarea como completada",
    context: "Lista de tareas",
    response: "Completando tarea [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 173,
    category: "productividad",
    user: "renombra este archivo a Reporte Final",
    context: "Google Drive",
    response: "Renombrando archivo [ACTION:click:7][ACTION:click:12][ACTION:type:15:Reporte Final][ACTION:click:18]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 174,
    category: "productividad",
    user: "mueve este archivo a la carpeta Proyectos",
    context: "Gestión de archivos",
    response: "Moviendo archivo [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 175,
    category: "productividad",
    user: "invita a Carlos a la reunión",
    context: "Evento de calendario",
    response: "Invitando participante [ACTION:click:10][ACTION:type:14:carlos@empresa.com][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 176,
    category: "productividad",
    user: "cambia la fecha límite al viernes",
    context: "Tarea en gestor",
    response: "Cambiando fecha [ACTION:click:9][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 177,
    category: "productividad",
    user: "añade un comentario al documento",
    context: "Google Docs",
    response: "Añadiendo comentario [ACTION:click:12][ACTION:type:16:Por favor revisar esta sección.][ACTION:click:20]",
    actions: ["click", "type", "click"]
  },
  {
    id: 178,
    category: "productividad",
    user: "crea una nueva carpeta llamada Q4",
    context: "Google Drive o Dropbox",
    response: "Creando carpeta [ACTION:click:5][ACTION:click:9][ACTION:type:12:Q4][ACTION:click:15]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 179,
    category: "productividad",
    user: "configura un recordatorio para las 3pm",
    context: "Google Calendar o To-do",
    response: "Configurando recordatorio [ACTION:click:6][ACTION:type:10:Recordatorio][ACTION:type:14:15:00][ACTION:click:18]",
    actions: ["click", "type", "type", "click"]
  },
  {
    id: 180,
    category: "productividad",
    user: "acepta esta invitación del calendario",
    context: "Invitación a evento",
    response: "Aceptando invitación [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 181,
    category: "productividad",
    user: "copia el link de este documento",
    context: "Google Docs o Sheet",
    response: "Copiando link [ACTION:click:6][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 182,
    category: "productividad",
    user: "inserta una tabla de 3x4",
    context: "Google Docs",
    response: "Insertando tabla [ACTION:click:8][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 183,
    category: "productividad",
    user: "cambia el formato a negrita",
    context: "Editor de texto",
    response: "Aplicando negrita [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 184,
    category: "productividad",
    user: "añade esta tarea al proyecto Marketing",
    context: "Asana o Monday",
    response: "Asignando a proyecto [ACTION:click:10][ACTION:click:15]",
    actions: ["click", "click"]
  },
  {
    id: 185,
    category: "productividad",
    user: "archiva este email",
    context: "Gmail",
    response: "Archivando correo [ACTION:click:5]",
    actions: ["click"]
  },
  {
    id: 186,
    category: "productividad",
    user: "elimina permanentemente esta nota",
    context: "Google Keep o Notion",
    response: "Eliminando nota [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 187,
    category: "productividad",
    user: "exporta esta hoja como CSV",
    context: "Google Sheets",
    response: "Exportando CSV [ACTION:click:5][ACTION:click:9][ACTION:click:13]",
    actions: ["click", "click", "click"]
  },
  {
    id: 188,
    category: "productividad",
    user: "añade un checklist a esta tarea",
    context: "Notion o Todoist",
    response: "Añadiendo checklist [ACTION:click:10][ACTION:type:14:Paso 1][ACTION:click:16][ACTION:type:18:Paso 2][ACTION:click:20]",
    actions: ["click", "type", "click", "type", "click"]
  },
  {
    id: 189,
    category: "productividad",
    user: "sincroniza con mi calendario de Google",
    context: "Configuración de app",
    response: "Sincronizando calendario [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 190,
    category: "productividad",
    user: "restaura la versión anterior del documento",
    context: "Google Docs historial",
    response: "Restaurando versión [ACTION:click:6][ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click", "click"]
  },

  // =============================================
  // CATEGORÍA 8: STREAMING Y ENTRETENIMIENTO (191-200)
  // =============================================
  {
    id: 191,
    category: "streaming",
    user: "reproduce este video",
    context: "YouTube o Netflix",
    response: "Reproduciendo video [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 192,
    category: "streaming",
    user: "pausa la reproducción",
    context: "Reproductor de video",
    response: "Pausando [ACTION:click:5]",
    actions: ["click"]
  },
  {
    id: 193,
    category: "streaming",
    user: "activa los subtítulos en español",
    context: "Netflix o YouTube",
    response: "Activando subtítulos [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 194,
    category: "streaming",
    user: "salta la intro",
    context: "Netflix con botón skip",
    response: "Saltando intro [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 195,
    category: "streaming",
    user: "añade a mi lista",
    context: "Netflix o Prime Video",
    response: "Añadiendo a mi lista [ACTION:click:9]",
    actions: ["click"]
  },
  {
    id: 196,
    category: "streaming",
    user: "reproduce el siguiente episodio",
    context: "Serie en streaming",
    response: "Reproduciendo siguiente [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 197,
    category: "streaming",
    user: "cambia la calidad a 1080p",
    context: "Configuración de video",
    response: "Cambiando calidad [ACTION:click:8][ACTION:click:13]",
    actions: ["click", "click"]
  },
  {
    id: 198,
    category: "streaming",
    user: "suscríbete a este canal",
    context: "YouTube",
    response: "Suscribiendo al canal [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 199,
    category: "streaming",
    user: "activa las notificaciones del canal",
    context: "YouTube canal",
    response: "Activando notificaciones [ACTION:click:9][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 200,
    category: "streaming",
    user: "crea una nueva playlist llamada Favoritos",
    context: "Spotify o YouTube",
    response: "Creando playlist [ACTION:click:5][ACTION:type:10:Favoritos][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },

  // =============================================
  // CATEGORÍA 9: BANCA Y FINANZAS (201-225)
  // =============================================
  {
    id: 201,
    category: "finanzas",
    user: "consulta mi saldo",
    context: "Banca en línea",
    response: "Consultando saldo [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 202,
    category: "finanzas",
    user: "transfiere 500 pesos a Juan",
    context: "App bancaria",
    response: "Iniciando transferencia [ACTION:click:6][ACTION:type:10:500][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "type", "click", "click"]
  },
  {
    id: 203,
    category: "finanzas",
    user: "paga mi tarjeta de crédito",
    context: "Portal bancario",
    response: "Pagando tarjeta [ACTION:click:10][ACTION:click:14][ACTION:type:18:5000][ACTION:click:22]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 204,
    category: "finanzas",
    user: "descarga mi estado de cuenta",
    context: "Banca digital",
    response: "Descargando estado de cuenta [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 205,
    category: "finanzas",
    user: "activa las notificaciones de movimientos",
    context: "Configuración bancaria",
    response: "Activando notificaciones [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 206,
    category: "finanzas",
    user: "registra un nuevo beneficiario",
    context: "Transferencias bancarias",
    response: "Registrando beneficiario [ACTION:click:6][ACTION:type:10:Carlos López][ACTION:type:14:1234567890][ACTION:click:18]",
    actions: ["click", "type", "type", "click"]
  },
  {
    id: 207,
    category: "finanzas",
    user: "consulta los movimientos del mes",
    context: "Banca en línea",
    response: "Viendo movimientos [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 208,
    category: "finanzas",
    user: "programa un pago recurrente de luz",
    context: "Pagos de servicios",
    response: "Programando pago [ACTION:click:8][ACTION:click:12][ACTION:type:16:CFE][ACTION:type:20:1500][ACTION:click:24]",
    actions: ["click", "click", "type", "type", "click"]
  },
  {
    id: 209,
    category: "finanzas",
    user: "solicita una nueva tarjeta de débito",
    context: "Servicios bancarios",
    response: "Solicitando tarjeta [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 210,
    category: "finanzas",
    user: "bloquea mi tarjeta temporalmente",
    context: "Seguridad bancaria",
    response: "Bloqueando tarjeta [ACTION:click:12][ACTION:click:16][ACTION:click:20]",
    actions: ["click", "click", "click"]
  },
  {
    id: 211,
    category: "finanzas",
    user: "cambia mi NIP",
    context: "Configuración de tarjeta",
    response: "Cambiando NIP [ACTION:click:8][ACTION:type:12:****][ACTION:type:16:****][ACTION:click:20]",
    actions: ["click", "type", "type", "click"]
  },
  {
    id: 212,
    category: "finanzas",
    user: "abre una cuenta de ahorro",
    context: "Productos bancarios",
    response: "Abriendo cuenta [ACTION:click:6][ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click", "click"]
  },
  {
    id: 213,
    category: "finanzas",
    user: "consulta el tipo de cambio",
    context: "Banca o finanzas",
    response: "Consultando tipo de cambio [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 214,
    category: "finanzas",
    user: "paga el recibo del agua",
    context: "Pago de servicios",
    response: "Pagando agua [ACTION:click:8][ACTION:type:12:número de cuenta][ACTION:click:16][ACTION:click:20]",
    actions: ["click", "type", "click", "click"]
  },
  {
    id: 215,
    category: "finanzas",
    user: "recarga 200 pesos a mi celular",
    context: "Recargas telefónicas",
    response: "Haciendo recarga [ACTION:click:6][ACTION:type:10:5551234567][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "type", "click", "click"]
  },
  {
    id: 216,
    category: "finanzas",
    user: "invierte en fondos de inversión",
    context: "Inversiones bancarias",
    response: "Accediendo a inversiones [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 217,
    category: "finanzas",
    user: "reporta un cargo no reconocido",
    context: "Aclaraciones bancarias",
    response: "Reportando cargo [ACTION:click:12][ACTION:click:16][ACTION:type:20:No reconozco este cargo][ACTION:click:24]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 218,
    category: "finanzas",
    user: "solicita un aumento de límite de crédito",
    context: "Tarjeta de crédito",
    response: "Solicitando aumento [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 219,
    category: "finanzas",
    user: "configura alertas de saldo bajo",
    context: "Configuración bancaria",
    response: "Configurando alertas [ACTION:click:8][ACTION:type:12:1000][ACTION:click:16]",
    actions: ["click", "type", "click"]
  },
  {
    id: 220,
    category: "finanzas",
    user: "consulta mis puntos de recompensa",
    context: "Programa de lealtad",
    response: "Viendo puntos [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 221,
    category: "finanzas",
    user: "genera mi CLABE interbancaria",
    context: "Datos de cuenta",
    response: "Generando CLABE [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 222,
    category: "finanzas",
    user: "paga mi seguro de auto",
    context: "Pagos de seguros",
    response: "Pagando seguro [ACTION:click:6][ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click", "click"]
  },
  {
    id: 223,
    category: "finanzas",
    user: "descarga el comprobante de pago",
    context: "Confirmación de transacción",
    response: "Descargando comprobante [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 224,
    category: "finanzas",
    user: "activa Apple Pay en mi tarjeta",
    context: "Métodos de pago",
    response: "Activando Apple Pay [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 225,
    category: "finanzas",
    user: "cancela el domiciliación del gimnasio",
    context: "Pagos domiciliados",
    response: "Cancelando domiciliación [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },

  // =============================================
  // CATEGORÍA 10: VIAJES Y TRANSPORTE (226-250)
  // =============================================
  {
    id: 226,
    category: "viajes",
    user: "busca vuelos a Cancún para la próxima semana",
    context: "Buscador de vuelos",
    response: "Buscando vuelos [ACTION:type:5:CDMX][ACTION:type:8:Cancún][ACTION:type:12:próxima semana][ACTION:click:16]",
    actions: ["type", "type", "type", "click"]
  },
  {
    id: 227,
    category: "viajes",
    user: "reserva un hotel de 4 estrellas",
    context: "Booking o Expedia",
    response: "Buscando hoteles [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 228,
    category: "viajes",
    user: "pide un Uber a mi ubicación",
    context: "App de Uber",
    response: "Pidiendo Uber [ACTION:click:6][ACTION:click:10]",
    actions: ["click", "click"]
  },
  {
    id: 229,
    category: "viajes",
    user: "muestra las opciones de asiento",
    context: "Selección de asiento en vuelo",
    response: "Mostrando asientos [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 230,
    category: "viajes",
    user: "agrega equipaje extra a mi reservación",
    context: "Gestión de vuelo",
    response: "Agregando equipaje [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 231,
    category: "viajes",
    user: "renta un auto compacto",
    context: "Renta de autos",
    response: "Rentando auto [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 232,
    category: "viajes",
    user: "haz check-in en línea",
    context: "Aerolínea",
    response: "Haciendo check-in [ACTION:click:6][ACTION:type:10:ABC123][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 233,
    category: "viajes",
    user: "descarga mi pase de abordar",
    context: "Confirmación de vuelo",
    response: "Descargando pase [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 234,
    category: "viajes",
    user: "busca tours en Roma",
    context: "Viator o GetYourGuide",
    response: "Buscando tours [ACTION:type:5:tours Roma][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 235,
    category: "viajes",
    user: "cancela mi reservación",
    context: "Gestión de reserva",
    response: "Cancelando reservación [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 236,
    category: "viajes",
    user: "cambia la fecha de mi vuelo",
    context: "Modificar vuelo",
    response: "Cambiando fecha [ACTION:click:8][ACTION:click:12][ACTION:type:16:2024-12-20][ACTION:click:20]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 237,
    category: "viajes",
    user: "solicita un taxi al aeropuerto",
    context: "App de taxi o Uber",
    response: "Solicitando taxi [ACTION:type:6:Aeropuerto Internacional][ACTION:click:10]",
    actions: ["type", "click"]
  },
  {
    id: 238,
    category: "viajes",
    user: "consulta el estado de mi vuelo",
    context: "Rastreo de vuelo",
    response: "Consultando estado [ACTION:type:5:AM456][ACTION:click:8]",
    actions: ["type", "click"]
  },
  {
    id: 239,
    category: "viajes",
    user: "filtra hoteles con desayuno incluido",
    context: "Booking filtros",
    response: "Filtrando por desayuno [ACTION:click:14]",
    actions: ["click"]
  },
  {
    id: 240,
    category: "viajes",
    user: "reserva un asiento de ventanilla",
    context: "Selección de asiento",
    response: "Reservando ventanilla [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 241,
    category: "viajes",
    user: "compra boleto de tren a Querétaro",
    context: "Tren o autobús",
    response: "Comprando boleto [ACTION:type:5:CDMX][ACTION:type:8:Querétaro][ACTION:type:12:mañana][ACTION:click:16]",
    actions: ["type", "type", "type", "click"]
  },
  {
    id: 242,
    category: "viajes",
    user: "añade seguro de viaje",
    context: "Checkout de viaje",
    response: "Añadiendo seguro [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 243,
    category: "viajes",
    user: "muestra el mapa del hotel",
    context: "Página de hotel",
    response: "Mostrando mapa [ACTION:click:18][ACTION:scroll:20]",
    actions: ["click", "scroll"]
  },
  {
    id: 244,
    category: "viajes",
    user: "programa recogida a las 8am",
    context: "Transfer o shuttle",
    response: "Programando recogida [ACTION:type:10:08:00][ACTION:click:14]",
    actions: ["type", "click"]
  },
  {
    id: 245,
    category: "viajes",
    user: "busca Airbnb con cocina",
    context: "Airbnb filtros",
    response: "Filtrando Airbnb [ACTION:click:10][ACTION:click:16][ACTION:click:20]",
    actions: ["click", "click", "click"]
  },
  {
    id: 246,
    category: "viajes",
    user: "solicita factura de mi viaje",
    context: "Uber o DiDi",
    response: "Solicitando factura [ACTION:click:8][ACTION:click:12][ACTION:type:16:RFC123456ABC][ACTION:click:20]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 247,
    category: "viajes",
    user: "comparte mi ubicación en tiempo real",
    context: "App de transporte",
    response: "Compartiendo ubicación [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 248,
    category: "viajes",
    user: "califica al conductor con 5 estrellas",
    context: "Final del viaje",
    response: "Calificando conductor [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 249,
    category: "viajes",
    user: "guarda esta ruta como favorita",
    context: "App de navegación",
    response: "Guardando ruta [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 250,
    category: "viajes",
    user: "contacta al anfitrión del Airbnb",
    context: "Reserva de Airbnb",
    response: "Contactando anfitrión [ACTION:click:10][ACTION:type:14:Hola, tengo una pregunta sobre el check-in.][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },

  // =============================================
  // CATEGORÍA 11: DELIVERY Y COMIDA (251-275)
  // =============================================
  {
    id: 251,
    category: "delivery",
    user: "pide una pizza grande de pepperoni",
    context: "Dominos o Pizza Hut",
    response: "Pidiendo pizza [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 252,
    category: "delivery",
    user: "busca restaurantes mexicanos cerca",
    context: "Uber Eats o Rappi",
    response: "Buscando restaurantes [ACTION:type:5:comida mexicana][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 253,
    category: "delivery",
    user: "agrega papas fritas al pedido",
    context: "Carrito de comida",
    response: "Agregando papas [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 254,
    category: "delivery",
    user: "aplica el cupón PRIMERAVEZ",
    context: "Checkout de delivery",
    response: "Aplicando cupón [ACTION:type:8:PRIMERAVEZ][ACTION:click:12]",
    actions: ["type", "click"]
  },
  {
    id: 255,
    category: "delivery",
    user: "cambia la dirección de entrega",
    context: "Configuración de pedido",
    response: "Cambiando dirección [ACTION:click:6][ACTION:type:10:Calle Nueva 456][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 256,
    category: "delivery",
    user: "pide una hamburguesa sin cebolla",
    context: "Restaurante de hamburguesas",
    response: "Personalizando pedido [ACTION:click:8][ACTION:click:12][ACTION:type:16:Sin cebolla por favor][ACTION:click:20]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 257,
    category: "delivery",
    user: "programa entrega para las 8pm",
    context: "Opciones de entrega",
    response: "Programando entrega [ACTION:click:10][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 258,
    category: "delivery",
    user: "rastrea mi pedido",
    context: "Pedido en curso",
    response: "Rastreando pedido [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 259,
    category: "delivery",
    user: "repite mi último pedido",
    context: "Historial de pedidos",
    response: "Repitiendo pedido [ACTION:click:6][ACTION:click:10]",
    actions: ["click", "click"]
  },
  {
    id: 260,
    category: "delivery",
    user: "añade propina del 15%",
    context: "Checkout",
    response: "Añadiendo propina [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 261,
    category: "delivery",
    user: "marca restaurante como favorito",
    context: "Página de restaurante",
    response: "Guardando favorito [ACTION:click:7]",
    actions: ["click"]
  },
  {
    id: 262,
    category: "delivery",
    user: "filtra por ofertas especiales",
    context: "App de delivery",
    response: "Filtrando ofertas [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 263,
    category: "delivery",
    user: "pide un café latte grande",
    context: "Starbucks o cafetería",
    response: "Pidiendo café [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 264,
    category: "delivery",
    user: "agrega una bebida al combo",
    context: "Combo de comida",
    response: "Agregando bebida [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 265,
    category: "delivery",
    user: "haz el pedido para recoger",
    context: "Tipo de entrega",
    response: "Seleccionando pickup [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 266,
    category: "delivery",
    user: "califica el restaurante",
    context: "Post-entrega",
    response: "Calificando [ACTION:click:10][ACTION:click:12][ACTION:click:14][ACTION:click:16][ACTION:click:18][ACTION:type:22:Excelente comida y rápida entrega.][ACTION:click:26]",
    actions: ["click", "click", "click", "click", "click", "type", "click"]
  },
  {
    id: 267,
    category: "delivery",
    user: "reporta un problema con mi pedido",
    context: "Soporte de pedido",
    response: "Reportando problema [ACTION:click:8][ACTION:click:12][ACTION:type:16:Faltó un artículo en mi pedido.][ACTION:click:20]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 268,
    category: "delivery",
    user: "pide super mercado con entrega hoy",
    context: "Rappi o Cornershop",
    response: "Pidiendo super [ACTION:click:6][ACTION:click:10]",
    actions: ["click", "click"]
  },
  {
    id: 269,
    category: "delivery",
    user: "añade instrucciones de entrega",
    context: "Notas del pedido",
    response: "Agregando instrucciones [ACTION:click:12][ACTION:type:16:Dejar en la puerta, edificio azul.][ACTION:click:20]",
    actions: ["click", "type", "click"]
  },
  {
    id: 270,
    category: "delivery",
    user: "selecciona pago en efectivo",
    context: "Método de pago",
    response: "Seleccionando efectivo [ACTION:click:14]",
    actions: ["click"]
  },
  {
    id: 271,
    category: "delivery",
    user: "cancela mi pedido",
    context: "Pedido activo",
    response: "Cancelando pedido [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 272,
    category: "delivery",
    user: "busca restaurantes veganos",
    context: "Filtros de comida",
    response: "Buscando vegano [ACTION:type:5:vegano][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 273,
    category: "delivery",
    user: "ordena para 4 personas",
    context: "Menú de grupo",
    response: "Ordenando para grupo [ACTION:click:8][ACTION:type:12:4][ACTION:click:16]",
    actions: ["click", "type", "click"]
  },
  {
    id: 274,
    category: "delivery",
    user: "contacta al repartidor",
    context: "Seguimiento de pedido",
    response: "Contactando repartidor [ACTION:click:10][ACTION:type:14:¿Cuánto falta para llegar?][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 275,
    category: "delivery",
    user: "ver el menú completo del restaurante",
    context: "Página de restaurante",
    response: "Viendo menú [ACTION:click:12][ACTION:scroll:16]",
    actions: ["click", "scroll"]
  },

  // =============================================
  // CATEGORÍA 12: EDUCACIÓN (276-300)
  // =============================================
  {
    id: 276,
    category: "educación",
    user: "inscríbete al curso de Python",
    context: "Udemy o Coursera",
    response: "Inscribiendo al curso [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 277,
    category: "educación",
    user: "reproduce la siguiente lección",
    context: "Plataforma educativa",
    response: "Reproduciendo lección [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 278,
    category: "educación",
    user: "descarga el material del curso",
    context: "Recursos de curso",
    response: "Descargando material [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 279,
    category: "educación",
    user: "marca la lección como completada",
    context: "Progreso del curso",
    response: "Marcando completada [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 280,
    category: "educación",
    user: "envía la tarea",
    context: "Entrega de tarea",
    response: "Enviando tarea [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 281,
    category: "educación",
    user: "haz el quiz del módulo 3",
    context: "Evaluación",
    response: "Iniciando quiz [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 282,
    category: "educación",
    user: "deja una pregunta al instructor",
    context: "Foro del curso",
    response: "Publicando pregunta [ACTION:click:10][ACTION:type:14:Tengo una duda sobre el tema de funciones.][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 283,
    category: "educación",
    user: "activa los subtítulos del video",
    context: "Video de curso",
    response: "Activando subtítulos [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 284,
    category: "educación",
    user: "cambia la velocidad a 1.5x",
    context: "Reproductor de video",
    response: "Cambiando velocidad [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 285,
    category: "educación",
    user: "obtén el certificado del curso",
    context: "Curso completado",
    response: "Obteniendo certificado [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 286,
    category: "educación",
    user: "únete a la clase en vivo",
    context: "Webinar o clase online",
    response: "Uniéndose a clase [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 287,
    category: "educación",
    user: "guarda este curso para después",
    context: "Catálogo de cursos",
    response: "Guardando curso [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 288,
    category: "educación",
    user: "filtra cursos por nivel principiante",
    context: "Búsqueda de cursos",
    response: "Filtrando por nivel [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 289,
    category: "educación",
    user: "comparte mi certificado en LinkedIn",
    context: "Certificado obtenido",
    response: "Compartiendo en LinkedIn [ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click"]
  },
  {
    id: 290,
    category: "educación",
    user: "empieza la práctica de código",
    context: "Ejercicio de programación",
    response: "Iniciando práctica [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 291,
    category: "educación",
    user: "ejecuta mi código",
    context: "Editor de código online",
    response: "Ejecutando código [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 292,
    category: "educación",
    user: "revisa las respuestas del examen",
    context: "Resultados de evaluación",
    response: "Revisando respuestas [ACTION:click:8][ACTION:scroll:12]",
    actions: ["click", "scroll"]
  },
  {
    id: 293,
    category: "educación",
    user: "solicita acceso al grupo de estudio",
    context: "Comunidad del curso",
    response: "Solicitando acceso [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 294,
    category: "educación",
    user: "descarga la app móvil del curso",
    context: "Plataforma educativa",
    response: "Descargando app [ACTION:click:6][ACTION:click:10]",
    actions: ["click", "click"]
  },
  {
    id: 295,
    category: "educación",
    user: "programa recordatorio de estudio",
    context: "Configuración de curso",
    response: "Programando recordatorio [ACTION:click:8][ACTION:type:12:18:00][ACTION:click:16]",
    actions: ["click", "type", "click"]
  },
  {
    id: 296,
    category: "educación",
    user: "lee los comentarios del curso",
    context: "Reseñas de curso",
    response: "Leyendo comentarios [ACTION:click:14][ACTION:scroll:18]",
    actions: ["click", "scroll"]
  },
  {
    id: 297,
    category: "educación",
    user: "aplica el cupón de estudiante",
    context: "Checkout de curso",
    response: "Aplicando cupón [ACTION:type:10:STUDENT50][ACTION:click:14]",
    actions: ["type", "click"]
  },
  {
    id: 298,
    category: "educación",
    user: "retoma donde me quedé",
    context: "Curso en progreso",
    response: "Retomando curso [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 299,
    category: "educación",
    user: "toma notas en este video",
    context: "Video de curso con notas",
    response: "Abriendo notas [ACTION:click:10][ACTION:type:14:Punto importante: ...][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 300,
    category: "educación",
    user: "pide reembolso del curso",
    context: "Configuración de compra",
    response: "Solicitando reembolso [ACTION:click:12][ACTION:click:16][ACTION:click:20]",
    actions: ["click", "click", "click"]
  },

  // =============================================
  // CATEGORÍA 13: MÚSICA (301-320)
  // =============================================
  {
    id: 301,
    category: "música",
    user: "reproduce música relajante",
    context: "Spotify o Apple Music",
    response: "Reproduciendo [ACTION:type:5:música relajante][ACTION:submit:5][ACTION:click:10]",
    actions: ["type", "submit", "click"]
  },
  {
    id: 302,
    category: "música",
    user: "pausa la canción",
    context: "Reproductor de música",
    response: "Pausando [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 303,
    category: "música",
    user: "salta a la siguiente canción",
    context: "Playlist activa",
    response: "Siguiente canción [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 304,
    category: "música",
    user: "guarda esta canción en mi biblioteca",
    context: "Canción reproduciéndose",
    response: "Guardando canción [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 305,
    category: "música",
    user: "activa el modo aleatorio",
    context: "Controles de playlist",
    response: "Activando shuffle [ACTION:click:14]",
    actions: ["click"]
  },
  {
    id: 306,
    category: "música",
    user: "repite esta canción",
    context: "Reproductor",
    response: "Activando repetición [ACTION:click:16]",
    actions: ["click"]
  },
  {
    id: 307,
    category: "música",
    user: "añade esta canción a mi playlist Favoritos",
    context: "Opciones de canción",
    response: "Añadiendo a playlist [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 308,
    category: "música",
    user: "sigue a este artista",
    context: "Perfil de artista",
    response: "Siguiendo artista [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 309,
    category: "música",
    user: "muestra la letra de la canción",
    context: "Reproductor con lyrics",
    response: "Mostrando letra [ACTION:click:14]",
    actions: ["click"]
  },
  {
    id: 310,
    category: "música",
    user: "descarga esta playlist para offline",
    context: "Spotify Premium",
    response: "Descargando playlist [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 311,
    category: "música",
    user: "crea una nueva playlist",
    context: "Biblioteca de música",
    response: "Creando playlist [ACTION:click:6][ACTION:type:10:Mi nueva playlist][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 312,
    category: "música",
    user: "busca canciones de los 90s",
    context: "Búsqueda de música",
    response: "Buscando música 90s [ACTION:type:5:éxitos de los 90][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 313,
    category: "música",
    user: "reproduce el álbum completo",
    context: "Página de álbum",
    response: "Reproduciendo álbum [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 314,
    category: "música",
    user: "conecta a mi bocina bluetooth",
    context: "Dispositivos de audio",
    response: "Conectando dispositivo [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 315,
    category: "música",
    user: "comparte esta canción",
    context: "Opciones de canción",
    response: "Compartiendo canción [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 316,
    category: "música",
    user: "ve a la radio basada en esta canción",
    context: "Recomendaciones",
    response: "Iniciando radio [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 317,
    category: "música",
    user: "ajusta el ecualizador a rock",
    context: "Configuración de audio",
    response: "Configurando ecualizador [ACTION:click:10][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 318,
    category: "música",
    user: "muestra las canciones más populares",
    context: "Charts de música",
    response: "Mostrando populares [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 319,
    category: "música",
    user: "elimina esta canción de la playlist",
    context: "Edición de playlist",
    response: "Eliminando canción [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 320,
    category: "música",
    user: "activa el temporizador de sueño",
    context: "Configuración de reproducción",
    response: "Activando temporizador [ACTION:click:12][ACTION:click:18]",
    actions: ["click", "click"]
  },

  // =============================================
  // CATEGORÍA 14: SALUD Y FITNESS (321-340)
  // =============================================
  {
    id: 321,
    category: "salud",
    user: "agenda una cita con el doctor",
    context: "Portal médico",
    response: "Agendando cita [ACTION:click:8][ACTION:click:12][ACTION:type:16:2024-12-15][ACTION:click:20]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 322,
    category: "salud",
    user: "registra mi peso de hoy",
    context: "App de fitness",
    response: "Registrando peso [ACTION:click:6][ACTION:type:10:75][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 323,
    category: "salud",
    user: "inicia el entrenamiento de cardio",
    context: "App de ejercicios",
    response: "Iniciando cardio [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 324,
    category: "salud",
    user: "registra 8 vasos de agua",
    context: "Tracker de hidratación",
    response: "Registrando agua [ACTION:click:8][ACTION:click:10][ACTION:click:10][ACTION:click:10][ACTION:click:10]",
    actions: ["click", "click", "click", "click", "click"]
  },
  {
    id: 325,
    category: "salud",
    user: "muestra mis estadísticas de sueño",
    context: "App de sueño",
    response: "Mostrando estadísticas [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 326,
    category: "salud",
    user: "añade el desayuno a mi registro",
    context: "Contador de calorías",
    response: "Registrando desayuno [ACTION:click:6][ACTION:type:10:huevos con pan tostado][ACTION:click:14]",
    actions: ["click", "type", "click"]
  },
  {
    id: 327,
    category: "salud",
    user: "programa recordatorio de medicamento",
    context: "App de salud",
    response: "Programando recordatorio [ACTION:click:8][ACTION:type:12:Vitaminas][ACTION:type:16:08:00][ACTION:click:20]",
    actions: ["click", "type", "type", "click"]
  },
  {
    id: 328,
    category: "salud",
    user: "inicia la meditación guiada",
    context: "Calm o Headspace",
    response: "Iniciando meditación [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 329,
    category: "salud",
    user: "marca el ejercicio como completado",
    context: "Rutina de ejercicios",
    response: "Marcando completado [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 330,
    category: "salud",
    user: "consulta mis resultados de laboratorio",
    context: "Portal de salud",
    response: "Consultando resultados [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 331,
    category: "salud",
    user: "compra mis medicamentos recetados",
    context: "Farmacia online",
    response: "Comprando medicamentos [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 332,
    category: "salud",
    user: "registra mi presión arterial",
    context: "Tracker de salud",
    response: "Registrando presión [ACTION:click:10][ACTION:type:14:120/80][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 333,
    category: "salud",
    user: "únete al reto de 30 días",
    context: "Desafío fitness",
    response: "Uniéndose al reto [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 334,
    category: "salud",
    user: "muestra el plan de comidas de hoy",
    context: "App de nutrición",
    response: "Mostrando plan [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 335,
    category: "salud",
    user: "sincroniza con mi reloj inteligente",
    context: "Configuración de app",
    response: "Sincronizando dispositivo [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 336,
    category: "salud",
    user: "exporta mis datos de salud",
    context: "Configuración de salud",
    response: "Exportando datos [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 337,
    category: "salud",
    user: "encuentra doctores cerca de mí",
    context: "Buscador de médicos",
    response: "Buscando doctores [ACTION:type:5:médicos cerca de mí][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 338,
    category: "salud",
    user: "inicia el temporizador de ejercicio",
    context: "Cronómetro de entrenamiento",
    response: "Iniciando temporizador [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 339,
    category: "salud",
    user: "comparte mis logros de fitness",
    context: "Progreso de ejercicio",
    response: "Compartiendo logros [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 340,
    category: "salud",
    user: "cancela mi membresía del gym",
    context: "Configuración de membresía",
    response: "Cancelando membresía [ACTION:click:12][ACTION:click:16][ACTION:click:20]",
    actions: ["click", "click", "click"]
  },

  // =============================================
  // CATEGORÍA 15: MAPAS Y UBICACIÓN (341-360)
  // =============================================
  {
    id: 341,
    category: "mapas",
    user: "busca gasolineras cerca",
    context: "Google Maps",
    response: "Buscando gasolineras [ACTION:type:5:gasolineras][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 342,
    category: "mapas",
    user: "inicia navegación a casa",
    context: "App de mapas",
    response: "Iniciando navegación [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 343,
    category: "mapas",
    user: "muestra el tráfico en tiempo real",
    context: "Google Maps o Waze",
    response: "Mostrando tráfico [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 344,
    category: "mapas",
    user: "añade una parada en la ruta",
    context: "Navegación activa",
    response: "Añadiendo parada [ACTION:click:12][ACTION:type:16:OXXO][ACTION:click:20]",
    actions: ["click", "type", "click"]
  },
  {
    id: 345,
    category: "mapas",
    user: "busca estacionamiento cerca del destino",
    context: "Opciones de ruta",
    response: "Buscando estacionamiento [ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click"]
  },
  {
    id: 346,
    category: "mapas",
    user: "comparte mi ubicación actual",
    context: "Opciones de ubicación",
    response: "Compartiendo ubicación [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 347,
    category: "mapas",
    user: "guarda esta ubicación como favorita",
    context: "Lugar en mapa",
    response: "Guardando favorito [ACTION:click:10][ACTION:type:14:Trabajo][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 348,
    category: "mapas",
    user: "muestra rutas alternativas",
    context: "Navegación",
    response: "Mostrando alternativas [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 349,
    category: "mapas",
    user: "evita autopistas de cuota",
    context: "Configuración de ruta",
    response: "Evitando cuotas [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 350,
    category: "mapas",
    user: "busca cajeros automáticos",
    context: "Google Maps",
    response: "Buscando cajeros [ACTION:type:5:cajeros automáticos][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 351,
    category: "mapas",
    user: "muestra el horario de este lugar",
    context: "Ficha de lugar",
    response: "Mostrando horario [ACTION:click:14][ACTION:scroll:18]",
    actions: ["click", "scroll"]
  },
  {
    id: 352,
    category: "mapas",
    user: "reporta un accidente en la vía",
    context: "Waze",
    response: "Reportando accidente [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 353,
    category: "mapas",
    user: "descarga el mapa para uso offline",
    context: "Opciones de mapa",
    response: "Descargando mapa [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 354,
    category: "mapas",
    user: "llama al restaurante",
    context: "Ficha de lugar",
    response: "Llamando [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 355,
    category: "mapas",
    user: "muestra fotos del lugar",
    context: "Información de lugar",
    response: "Mostrando fotos [ACTION:click:10][ACTION:scroll:14]",
    actions: ["click", "scroll"]
  },
  {
    id: 356,
    category: "mapas",
    user: "califica este lugar con 4 estrellas",
    context: "Reseña de lugar",
    response: "Calificando lugar [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 357,
    category: "mapas",
    user: "activa el modo Street View",
    context: "Vista de mapa",
    response: "Activando Street View [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 358,
    category: "mapas",
    user: "busca farmacias 24 horas",
    context: "Búsqueda en mapa",
    response: "Buscando farmacias [ACTION:type:5:farmacias 24 horas][ACTION:submit:5]",
    actions: ["type", "submit"]
  },
  {
    id: 359,
    category: "mapas",
    user: "mide la distancia entre dos puntos",
    context: "Herramientas de mapa",
    response: "Midiendo distancia [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 360,
    category: "mapas",
    user: "activa alertas de velocidad",
    context: "Configuración de Waze",
    response: "Activando alertas [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },

  // =============================================
  // CATEGORÍA 16: CONFIGURACIÓN Y SISTEMA (361-380)
  // =============================================
  {
    id: 361,
    category: "configuración",
    user: "cambia el idioma a inglés",
    context: "Configuración de app",
    response: "Cambiando idioma [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 362,
    category: "configuración",
    user: "activa el modo oscuro",
    context: "Configuración de tema",
    response: "Activando modo oscuro [ACTION:click:6]",
    actions: ["click"]
  },
  {
    id: 363,
    category: "configuración",
    user: "desactiva las notificaciones push",
    context: "Configuración de notificaciones",
    response: "Desactivando notificaciones [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 364,
    category: "configuración",
    user: "cambia mi contraseña",
    context: "Seguridad de cuenta",
    response: "Cambiando contraseña [ACTION:click:8][ACTION:type:12:contraseñaActual][ACTION:type:16:nuevaContraseña][ACTION:type:20:nuevaContraseña][ACTION:click:24]",
    actions: ["click", "type", "type", "type", "click"]
  },
  {
    id: 365,
    category: "configuración",
    user: "habilita la autenticación de dos factores",
    context: "Seguridad",
    response: "Habilitando 2FA [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 366,
    category: "configuración",
    user: "vincula mi cuenta de Google",
    context: "Cuentas conectadas",
    response: "Vinculando Google [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 367,
    category: "configuración",
    user: "exporta mis datos personales",
    context: "Privacidad",
    response: "Exportando datos [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 368,
    category: "configuración",
    user: "elimina mi cuenta permanentemente",
    context: "Configuración de cuenta",
    response: "Eliminando cuenta [ACTION:click:12][ACTION:click:16][ACTION:type:20:CONFIRMAR][ACTION:click:24]",
    actions: ["click", "click", "type", "click"]
  },
  {
    id: 369,
    category: "configuración",
    user: "configura el inicio automático de sesión",
    context: "Opciones de login",
    response: "Configurando auto-login [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 370,
    category: "configuración",
    user: "cambia mi zona horaria",
    context: "Configuración regional",
    response: "Cambiando zona [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 371,
    category: "configuración",
    user: "activa el modo ahorro de datos",
    context: "Configuración de red",
    response: "Activando ahorro de datos [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 372,
    category: "configuración",
    user: "limpia la caché de la aplicación",
    context: "Almacenamiento",
    response: "Limpiando caché [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 373,
    category: "configuración",
    user: "restaura la configuración predeterminada",
    context: "Opciones avanzadas",
    response: "Restaurando configuración [ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click"]
  },
  {
    id: 374,
    category: "configuración",
    user: "actualiza mi correo electrónico",
    context: "Información de cuenta",
    response: "Actualizando email [ACTION:click:8][ACTION:type:12:nuevo@email.com][ACTION:click:16]",
    actions: ["click", "type", "click"]
  },
  {
    id: 375,
    category: "configuración",
    user: "cambia mi número de teléfono",
    context: "Datos personales",
    response: "Cambiando teléfono [ACTION:click:10][ACTION:type:14:5551234567][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 376,
    category: "configuración",
    user: "configura respuestas automáticas",
    context: "Email o chat",
    response: "Configurando auto-respuesta [ACTION:click:8][ACTION:type:12:Estoy de vacaciones hasta el lunes.][ACTION:click:16]",
    actions: ["click", "type", "click"]
  },
  {
    id: 377,
    category: "configuración",
    user: "desactiva el seguimiento de ubicación",
    context: "Privacidad",
    response: "Desactivando ubicación [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 378,
    category: "configuración",
    user: "verifica mi correo electrónico",
    context: "Verificación de cuenta",
    response: "Verificando email [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 379,
    category: "configuración",
    user: "gestiona mis suscripciones",
    context: "Facturación",
    response: "Gestionando suscripciones [ACTION:click:10][ACTION:scroll:14]",
    actions: ["click", "scroll"]
  },
  {
    id: 380,
    category: "configuración",
    user: "activa las cookies esenciales solamente",
    context: "Política de cookies",
    response: "Configurando cookies [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },

  // =============================================
  // CATEGORÍA 17: GAMING Y JUEGOS (381-400)
  // =============================================
  {
    id: 381,
    category: "gaming",
    user: "inicia el juego",
    context: "Plataforma de gaming",
    response: "Iniciando juego [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 382,
    category: "gaming",
    user: "únete a la partida online",
    context: "Lobby de juego",
    response: "Uniéndose a partida [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 383,
    category: "gaming",
    user: "invita a mis amigos a jugar",
    context: "Sistema de invitaciones",
    response: "Invitando amigos [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 384,
    category: "gaming",
    user: "compra el pase de batalla",
    context: "Tienda del juego",
    response: "Comprando pase [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 385,
    category: "gaming",
    user: "reclama las recompensas diarias",
    context: "Recompensas",
    response: "Reclamando recompensas [ACTION:click:6][ACTION:click:10]",
    actions: ["click", "click"]
  },
  {
    id: 386,
    category: "gaming",
    user: "equipa la nueva skin",
    context: "Inventario",
    response: "Equipando skin [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 387,
    category: "gaming",
    user: "crea una partida privada",
    context: "Opciones de juego",
    response: "Creando partida [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 388,
    category: "gaming",
    user: "guarda la partida",
    context: "Menú de juego",
    response: "Guardando [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 389,
    category: "gaming",
    user: "ajusta la sensibilidad del mouse",
    context: "Configuración de juego",
    response: "Ajustando sensibilidad [ACTION:click:10][ACTION:type:14:50][ACTION:click:18]",
    actions: ["click", "type", "click"]
  },
  {
    id: 390,
    category: "gaming",
    user: "silencia a este jugador",
    context: "Chat de juego",
    response: "Silenciando jugador [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 391,
    category: "gaming",
    user: "reporta comportamiento tóxico",
    context: "Sistema de reportes",
    response: "Reportando jugador [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 392,
    category: "gaming",
    user: "añade a este jugador como amigo",
    context: "Perfil de jugador",
    response: "Añadiendo amigo [ACTION:click:8]",
    actions: ["click"]
  },
  {
    id: 393,
    category: "gaming",
    user: "compra monedas del juego",
    context: "Tienda",
    response: "Comprando monedas [ACTION:click:10][ACTION:click:14][ACTION:click:18]",
    actions: ["click", "click", "click"]
  },
  {
    id: 394,
    category: "gaming",
    user: "ve el ranking global",
    context: "Tabla de posiciones",
    response: "Mostrando ranking [ACTION:click:12]",
    actions: ["click"]
  },
  {
    id: 395,
    category: "gaming",
    user: "personaliza mi personaje",
    context: "Editor de personaje",
    response: "Personalizando [ACTION:click:8][ACTION:click:12][ACTION:click:16]",
    actions: ["click", "click", "click"]
  },
  {
    id: 396,
    category: "gaming",
    user: "acepta la misión del NPC",
    context: "Interacción con NPC",
    response: "Aceptando misión [ACTION:click:10]",
    actions: ["click"]
  },
  {
    id: 397,
    category: "gaming",
    user: "canjea el código promocional",
    context: "Sección de códigos",
    response: "Canjeando código [ACTION:type:8:CODIGO2024][ACTION:click:12]",
    actions: ["type", "click"]
  },
  {
    id: 398,
    category: "gaming",
    user: "únete al clan/gremio",
    context: "Sistema de clanes",
    response: "Uniéndose al clan [ACTION:click:10][ACTION:click:14]",
    actions: ["click", "click"]
  },
  {
    id: 399,
    category: "gaming",
    user: "activa el modo espectador",
    context: "Opciones de partida",
    response: "Activando espectador [ACTION:click:8][ACTION:click:12]",
    actions: ["click", "click"]
  },
  {
    id: 400,
    category: "gaming",
    user: "descarga la actualización del juego",
    context: "Launcher de juego",
    response: "Descargando actualización [ACTION:click:10]",
    actions: ["click"]
  },

  // =============================================
  // CATEGORÍA EXTRA: TIENDAS DE ZAPATOS/TENIS (401-420)
  // Específico para tiendas Shopify y similares
  // =============================================
  {
    id: 401,
    category: "búsqueda",
    user: "buscame tenis negros",
    context: "Tienda de zapatos online (Shopify)",
    response: "Buscando tenis negros [ACTION:type:3:tenis negros][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 402,
    category: "búsqueda",
    user: "busca tenis nike",
    context: "Tienda de calzado deportivo",
    response: "Buscando tenis Nike [ACTION:type:4:tenis nike][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 403,
    category: "búsqueda",
    user: "encuentra zapatos deportivos talla 27",
    context: "Tienda de zapatos",
    response: "Buscando zapatos talla 27 [ACTION:type:3:zapatos deportivos talla 27][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 404,
    category: "búsqueda",
    user: "quiero ver tenis adidas blancos",
    context: "Tienda deportiva",
    response: "Buscando Adidas blancos [ACTION:type:3:tenis adidas blancos][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 405,
    category: "búsqueda",
    user: "busca el modelo court vision",
    context: "Tienda Nike/Deportiva",
    response: "Buscando Court Vision [ACTION:type:3:court vision][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 406,
    category: "búsqueda",
    user: "encuentra botas para hombre",
    context: "Tienda de calzado",
    response: "Buscando botas de hombre [ACTION:type:4:botas hombre][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 407,
    category: "búsqueda",
    user: "busca zapatillas running",
    context: "Tienda deportiva online",
    response: "Buscando zapatillas running [ACTION:type:3:zapatillas running][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 408,
    category: "búsqueda",
    user: "quiero sandalias de mujer",
    context: "Tienda de zapatos",
    response: "Buscando sandalias mujer [ACTION:type:4:sandalias mujer][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 409,
    category: "búsqueda",
    user: "encuentra tenis para niño",
    context: "Tienda de calzado infantil",
    response: "Buscando tenis niño [ACTION:type:3:tenis niño][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 410,
    category: "búsqueda",
    user: "busca zapatos de vestir negros",
    context: "Tienda de calzado formal",
    response: "Buscando zapatos vestir negros [ACTION:type:3:zapatos vestir negros][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 411,
    category: "búsqueda",
    user: "encuentra tenis puma para correr",
    context: "Tienda deportiva",
    response: "Buscando Puma running [ACTION:type:4:tenis puma correr][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 412,
    category: "búsqueda",
    user: "quiero ver mocasines",
    context: "Tienda de calzado casual",
    response: "Buscando mocasines [ACTION:type:3:mocasines][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 413,
    category: "búsqueda",
    user: "busca converse negros",
    context: "Tienda de calzado urbano",
    response: "Buscando Converse negros [ACTION:type:3:converse negros][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 414,
    category: "búsqueda",
    user: "encuentra air force 1",
    context: "Tienda Nike/Sneakers",
    response: "Buscando Air Force 1 [ACTION:type:4:air force 1][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 415,
    category: "búsqueda",
    user: "busca jordan retro",
    context: "Tienda de sneakers",
    response: "Buscando Jordan Retro [ACTION:type:3:jordan retro][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 416,
    category: "búsqueda",
    user: "quiero ver new balance",
    context: "Tienda deportiva",
    response: "Buscando New Balance [ACTION:type:3:new balance][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 417,
    category: "búsqueda",
    user: "encuentra vans old skool",
    context: "Tienda de skate/urbano",
    response: "Buscando Vans Old Skool [ACTION:type:4:vans old skool][ACTION:submit:4]",
    actions: ["type", "submit"]
  },
  {
    id: 418,
    category: "búsqueda",
    user: "busca chanclas para playa",
    context: "Tienda de calzado verano",
    response: "Buscando chanclas playa [ACTION:type:3:chanclas playa][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 419,
    category: "búsqueda",
    user: "encuentra zapatos de fútbol",
    context: "Tienda deportiva",
    response: "Buscando zapatos fútbol [ACTION:type:3:zapatos futbol][ACTION:submit:3]",
    actions: ["type", "submit"]
  },
  {
    id: 420,
    category: "búsqueda",
    user: "quiero ver skechers memory foam",
    context: "Tienda de calzado confort",
    response: "Buscando Skechers Memory Foam [ACTION:type:4:skechers memory foam][ACTION:submit:4]",
    actions: ["type", "submit"]
  }
];

// Función para obtener casos por categoría
export const getCasesByCategory = (category: string) => {
  return TRAINING_CASES.filter(c => c.category === category);
};

// Función para obtener ejemplos aleatorios para el prompt
export const getRandomExamples = (count: number = 5) => {
  const shuffled = [...TRAINING_CASES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generar texto de ejemplos para incluir en el prompt
export const generateExamplesForPrompt = (categories?: string[], count: number = 10) => {
  const casesToUse = categories
    ? TRAINING_CASES.filter(c => categories.includes(c.category))
    : TRAINING_CASES;

  // Seleccionar ejemplos variados de las categorías filtradas
  const shuffled = [...casesToUse].sort(() => 0.5 - Math.random());
  const examples = shuffled.slice(0, count);

  return examples.map(c =>
    `Usuario: "${c.user}"\nRespuesta: "${c.response}"`
  ).join('\n\n');
};

// Categorías disponibles
export const CATEGORIES = [
  'búsqueda',
  'correo',
  'navegación',
  'formulario',
  'redes',
  'compras',
  'productividad',
  'streaming',
  'finanzas',
  'viajes',
  'delivery',
  'educación',
  'música',
  'salud',
  'mapas',
  'configuración',
  'gaming'
];

// Estadísticas
export const getStats = () => ({
  total: TRAINING_CASES.length,
  byCategory: CATEGORIES.reduce((acc, cat) => {
    acc[cat] = getCasesByCategory(cat).length;
    return acc;
  }, {} as Record<string, number>)
});
