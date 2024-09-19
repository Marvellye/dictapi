const express = require('express');
const axios = require('axios');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express'); // Add this missing import
const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dictionary API - Marvelly',
      version: '1.0.0',
      description: "An API that provides details on words. A dictionary API as requested by Ideologist",
    },
    components: {
      schemas: {
        DictionaryData: {
          type: 'object',
          properties: {
            word: {
              type: 'string',
            },
            phonetic: {
              type: 'string',
            },
            phonetics: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Phonetic',
              },
            },
            meanings: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Meaning',
              },
            },
          },
        },
        Phonetic: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
            },
            audio: {
              type: 'string',
            },
          },
        },
        Meaning: {
          type: 'object',
          properties: {
            partOfSpeech: {
              type: 'string',
            },
            definitions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Definition',
              },
            },
          },
        },
        Definition: {
          type: 'object',
          properties: {
            definition: {
              type: 'string',
            },
            example: {
              type: 'string',
            },
            synonyms: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            antonyms: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  servers: [
      {
        url: "https://dictapi-jtjj.onrender.com",
        description: "Production server",
      },
    ],
  },
  apis: ['./app.js'], // Ensure it points to your current file or adjust accordingly
};

const swaggerSpec = swaggerJsDoc(options);
app.get('/', (req, res) => {
  res.redirect('/docs');
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Ensure '/api-docs' path for Swagger UI

/**
 * @swagger
 * /api/{word}:
 *   get:
 *     summary: Retrieve dictionary data for a word
 *     description: Returns the dictionary data for the specified word
 *     parameters:
 *       - in: path
 *         name: word
 *         required: true
 *         description: The word to retrieve data for
 *     responses:
 *       200:
 *         description: Dictionary data for the word
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DictionaryData'
 *       500:
 *         description: Failed to retrieve data
 */

app.get('/api/:word', async (req, res) => {
  const word = req.params.word;
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve data' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});