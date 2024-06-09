const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// URL da API do Bitrix24
const API_URL = process.env.API_URL || "https://b24-3lnvx7.bitrix24.com.br/rest/1/up280kmevpvj7wto/task.item.update.json";

// ID da próxima etapa da tarefa principal
const NEXT_STAGE_ID = process.env.NEXT_STAGE_ID || "next_stage_id";

// Função para atualizar a tarefa principal
async function atualizarTarefaPrincipal(taskId) {
  try {
    const updateResponse = await axios.post(API_URL + "tasks.task.update", {
      taskId: taskId,
      fields: {
        STAGE_ID: NEXT_STAGE_ID
      }
    });

    console.log("Tarefa principal atualizada com sucesso:", updateResponse.data);
  } catch (error) {
    console.error("Erro ao atualizar a tarefa principal:", error.response.data);
  }
}

// Função para obter a tarefa principal a partir de uma subtarefa
async function obterTarefaPrincipal(subtaskId) {
  try {
    const response = await axios.get(API_URL + "tasks.task.get", {
      params: {
        taskId: subtaskId
      }
    });

    const taskData = response.data.result.task;
    return taskData.parentId;
  } catch (error) {
    console.error("Erro ao obter a tarefa principal:", error.response.data);
    return null;
  }
}

// Simulação de evento de conclusão de subtarefa
async function onSubtaskCompleted(subtaskId) {
  const taskId = await obterTarefaPrincipal(subtaskId);

  if (taskId) {
    await atualizarTarefaPrincipal(taskId);
  } else {
    console.error("Tarefa principal não encontrada para a subtarefa:", subtaskId);
  }
}

app.post('/webhook', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'ONTASKUPDATE' && data && data.fields && data.fields.STATUS === '5') {
    const subtaskId = data.fields.ID;
    await onSubtaskCompleted(subtaskId);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
