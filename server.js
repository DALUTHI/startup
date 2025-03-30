const WebSocket = require("ws");


const server = new WebSocket.Server({ port: 3001 });

server.on("connection", (ws) => {
  console.log("Novo cliente conectado");

  ws.on("message", (message) => {
    try {
      // Tente parsear a mensagem como JSON
      const parsedMessage = JSON.parse(message.toString());
      console.log("Pedido recebido:", parsedMessage);

      // Enviar o pedido para todos os clientes conectados (cozinha)
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Converte o objeto de volta para JSON antes de enviar
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error("Erro ao analisar a mensagem:", error);
    }
  });

  ws.on("close", () => console.log("Cliente desconectado"));
});

console.log("Servidor WebSocket rodando na porta 3001");