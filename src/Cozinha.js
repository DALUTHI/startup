import React, { useEffect, useState } from "react";

const Cozinha = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001"); // Substitua pelo seu servidor WebSocket

    socket.onmessage = (event) => {
      const novoPedido = JSON.parse(event.data);
      setPedidos((prevPedidos) => [...prevPedidos, novoPedido]);
    };

    return () => socket.close();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", background: "#222", color: "white", minHeight: "100vh" }}>
      <h2>📦 Pedidos na Cozinha</h2>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido no momento</p>
      ) : (
        <ul>
          {pedidos.map((pedido, index) => (
            <li key={index} style={{ background: "#333", padding: "10px", margin: "10px 0", borderRadius: "8px" }}>
              <strong>🍽 Mesa:</strong> {pedido.mesa} <br />
              <strong>📜 Itens:</strong>
              <ul>
                {pedido.itens.map((item, i) => (
                  <li key={i}>
                    {item.nome} - {item.quantidade} - {item.ingrediente}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cozinha;
