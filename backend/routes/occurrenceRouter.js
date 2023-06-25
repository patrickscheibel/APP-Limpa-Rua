const express = require('express');
const router = express.Router();
const occurrence = require('../services/occurrenceService');
const user = require('../services/userService');
const { validationResult } = require('express-validator');
const { createOccurrenceValidationRules, updateOccurrenceValidationRules } = require('../services/validator');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const imageFolder = './files';

/* Verificar se a pasta de imagens existe, caso contrário, criar */
if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder);
}

/* Função para salvar a imagem em uma pasta */
function saveImage(userId, base64Image) {
  const matches = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
  const extension = base64Image.match(/data:image\/(\w+);base64,/)[1];

  if (!matches || matches.length !== 3) {
    throw new Error('Formato de base64 inválido. Esperado "data:image/...;base64,..."');
  }

  const fileName = `${uuidv4()}.${extension}`;
  const userFolder = path.join(imageFolder, userId.toString());

  /* Verificar se a pasta do usuário existe, caso contrário, criar */
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }

  const imagePath = path.join(userFolder, fileName);
  const imageBuffer = Buffer.from(matches[2], 'base64');

  fs.writeFileSync(imagePath, imageBuffer);

  return imagePath.replace('public', '');
}

/* Função para remover a imagem da pasta */
function deleteImage(imagePath) {
  const fullPath = path.join(__dirname, '..', imagePath);
  fs.unlinkSync(fullPath);
}

/* GET occurrences */
router.get("/", async function (req, res, next) {
  try {
    return res.json(await occurrence.index(req.query.page));
  } catch (err) {
    return res.status(400).json({ errors: err.message});
  }
});

/* CREATE occurrence */
router.post("/create", createOccurrenceValidationRules(), async function (req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user_id = req.body.user_id;
    const userData = await user.findUserById(user_id);
    if (userData == null) {
      return res.status(400).json({'message': "User not exist" });
    }

    const base64Image = req.body.photo_url;
    const imagePath = saveImage(userData.id, base64Image);

    /* Atualizar o parâmetro photo_url com o caminho da imagem */
    req.body.photo_url = imagePath;

    return res.json(await occurrence.create(req.body, res));
  } catch (err) {
    console.error(`Error while creating occurrence`, err.message);
    next(err);
  }
});

/* UPDATE occurrence */
router.post("/update", updateOccurrenceValidationRules(), async function (req, res, next) {
  try {
    const errors = validationResult(req);
    const occurrenceId = req.body.id;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    if (!occurrenceId) {
      return res.status(400).json({ errors: 'Not found id' });
    }

    const user_id = req.body.user_id;
    const userData = await user.findUserById(user_id);
    if (userData == null) {
      return res.status(400).json({'message': "User not exist" });
    }

    /* Buscar a ocorrência para obter o caminho da imagem salva atualmente */
    const occurrenceData = await occurrence.findOccurrenceById(occurrenceId, res);
    if(occurrenceData == null) {
      return res.status(400).json({'message': "Occurrence id not found" });
    }

    const base64Image = req.body.photo_url;
    if (base64Image != null) {
        if (base64Image.length > 200) {
          /* Salva a imagem nova da pasta */
          const imagePath = saveImage(userData.id, base64Image);

          /* Remover a imagem antiga da pasta */
          deleteImage(occurrenceData.photo_url);

          /* Atualizar o parâmetro photo_url com o caminho da imagem nova */
          req.body.photo_url = imagePath;  
        } else {        
          req.body.photo_url = occurrenceData.photo_url;
        }
    }
    
    res.json(await occurrence.update(req.body, res));
  } catch (err) {
    console.error(`Error while updating occurrence`, err.message);
    next(err);
  }
});

/* DELETE occurrence */
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const occurrenceId = req.params.id;

    if (!occurrenceId) {
      return res.status(400).json({'mensage': "Parameter id not found" });
    }

    /* Buscar a ocorrência para obter o caminho da imagem */
    const occurrenceData = await occurrence.findOccurrenceById(occurrenceId, res);
    if(occurrenceData == null) {
      return res.status(400).json({'message': "Occurrence id not found" });
    }

    /* Remover a imagem da pasta */
    deleteImage(occurrenceData.photo_url);

    res.json(await occurrence.remove(occurrenceId, res));
  } catch (err) {
    console.error(`Error while deleting occurrence`, err.message);
    next(err);
  }
});

module.exports = router;