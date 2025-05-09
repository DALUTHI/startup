import QRCode from "react-qr-code";

const QrCodeGenerator = ({ numeroMesa }) => {
  const url = `http://localhost:3000/?mesa=${numeroMesa}`;

  return (
    <div>
      <h3>Mesa {numeroMesa}</h3>
      <QRCode value={url} size={150} />
    </div>
  );
};

export default QrCodeGenerator;
