const { analyzeWithOpenAI } = require("../services/openaiService");

exports.analyzeCustomerFeedback = async (req, res, next) => {
  try {
    const { productName, productDescription, customerFeedback } = req.body;

    let prompt = `De acuerdo a esta informacion de un prodcuto:
    Nombre del producto: ${productName}
    Descripcion del producto: ${productDescription}

    y de acuerdo a los comentarios de los consumidores:`;
    // Agrega los comentarios de los clientes al prompt
    Object.keys(customerFeedback).forEach((customer) => {
      prompt += `\n${customer} ha dado una calificación de ${customerFeedback[customer].Calificacion} y ha comentado: "${customerFeedback[customer].Comentario}"\n`;
      console.log(prompt);
    });
    prompt += `Como plataforma avanzada de análisis de opiniones de clientes, 
    tu tarea es evaluar las opiniones y reseñas de los clientes sobre productos, 
    utilizando herramientas de análisis de sentimientos basadas en IA. 
    Tu objetivo es proporcionar insights valiosos para mejorar la calidad de los 
    productos y la experiencia del cliente.
    Al analizar las opiniones, ten en cuenta las calificaciones del 1 al 5 y los comentarios 
    detallados de los clientes. No te limites solo a las puntuaciones numéricas; analiza el 
    texto de las reseñas para comprender el sentimiento general detrás de cada opinión. 
    Identifica patrones, tendencias y aspectos destacados mencionados por los clientes, 
    como la calidad del producto, la atención al cliente y la entrega.
    Es crucial que tu análisis sea preciso y contextual. 
    Reconoce la importancia del contexto, como el tipo de producto y el 
    mercado al que se dirige, al interpretar las opiniones de los clientes. 
    Categoriza las opiniones en diferentes aspectos del producto (por ejemplo, 
    características, precio, usabilidad) para proporcionar una visión detallada y organizada.
    Utiliza un lenguaje persuasivo y motivador para ofrecer 
    recomendaciones claras y útiles para mejorar la calidad de los productos y la experiencia del cliente.
    Super importante, recuerda que esta retroalimentacion se hace en base a los comentarios, asi que si no hay comentario
    no haces ningun feedback pero si hay almenos 1 lo hace de acuerdo a ese comentario, asi el comentario
    no sea tan detallado, lo importante es que no inventes datos que no se han comentado.`;
    const response = await analyzeWithOpenAI(prompt);

    if (response && response.choices && response.choices.length > 0) {
      const analyzedFeedback = response.choices[0].message.content;
      res.status(200).json({ analyzedFeedback });
    } else {
      console.error("Unexpected response from OpenAI API:", response);
      res.status(500).json({
        message: "Error processing the request",
        error: "Unexpected response from the API",
      });
    }
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Error processing the request",
      error: error.message,
    });
  }
};
