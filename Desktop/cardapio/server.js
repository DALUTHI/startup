const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3001 });

server.on("connection", (ws) => {
  console.log("Novo cliente conectado");

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      
      // Validação básica dos dados
      if (!parsedMessage.itens || parsedMessage.itens.length === 0) {
        console.error("Pedido sem itens recebido");
        return;
      }
      
      if (!parsedMessage.cliente || !parsedMessage.cliente.nome || !parsedMessage.cliente.telefone) {
        console.error("Dados do cliente incompletos");
        return;
      }

      console.log("Pedido recebido:", {
        mesa: parsedMessage.mesa,
        cliente: parsedMessage.cliente.nome,
        itens: parsedMessage.itens.length,
        total: parsedMessage.valorTotal
      });

      // Enviar para todos os clientes conectados
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
    }
  });

  ws.on("close", () => console.log("Cliente desconectado"));
});

console.log("Servidor WebSocket rodando na porta 3001");
