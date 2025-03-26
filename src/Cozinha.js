import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled, keyframes } from "@mui/system";

// Animação para novos pedidos
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedListItem = styled(ListItem)(({ theme }) => ({
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const Cozinha = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001"); // Substitua pelo seu servidor WebSocket

    socket.onmessage = (event) => {
      const novoPedido = JSON.parse(event.data);
      setPedidos((prevPedidos) => [...prevPedidos, { ...novoPedido, status: "Em preparo" }]);
    };

    return () => socket.close();
  }, []);

  const marcarComoPronto = (index) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido, i) =>
        i === index ? { ...pedido, status: "Pronto" } : pedido
      )
    );
  };

  return (
    <Box
      sx={{
        padding: "20px",
        background: "#1e1e1e",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#ffb74d" }}>
        <RestaurantIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        Pedidos na Cozinha
      </Typography>
      {pedidos.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Nenhum pedido no momento.
        </Typography>
      ) : (
        <List>
          {pedidos.map((pedido, index) => (
            <AnimatedListItem key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: "16px",
                  width: "100%",
                  background: "#333",
                  borderRadius: "12px",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ color: "#ffb74d" }}>
                    <LocalDiningIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                    Mesa {pedido.mesa}
                  </Typography>
                  <Chip
                    label={pedido.status}
                    color={pedido.status === "Em preparo" ? "warning" : "success"}
                    icon={pedido.status === "Em preparo" ? null : <CheckCircleIcon />}
                  />
                </Box>
                <List>
                  {pedido.itens.map((item, i) => (
                    <ListItem key={i} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <RestaurantIcon sx={{ color: "#ffb74d" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${item.nome} - ${item.quantidade}`}
                        primaryTypographyProps={{ sx: { color: "white" } }}
                        secondaryTypographyProps={{ sx: { color: "white" } }}
                      />
                    </ListItem>
                  ))}
                </List>
                {/* Seção de Observações */}
                {pedido.observacoes && (
                  <Box sx={{ mt: 1, borderTop: '1px solid #555', pt: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ color: '#ffb74d', fontStyle: 'italic', fontSize: '0.9rem' }}
                    >
                      <strong>Observações:</strong> {pedido.observacoes}
                    </Typography>
                  </Box>
                )}
                {pedido.status === "Em preparo" && (
                  <Box sx={{ textAlign: "right", mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => marcarComoPronto(index)}
                    >
                      Marcar como Pronto
                    </Button>
                  </Box>
                )}
              </Paper>
            </AnimatedListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Cozinha;
