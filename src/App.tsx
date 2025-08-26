// src/App.tsx
import NewContract from "./pages/contracts/NewContract";
import capa from "./assets/capa.png";

export default function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${capa})` }}
    >
      {/* overlay opcional p/ contraste (ajuste/remoção à vontade) */}
      <div className="min-h-screen">
        <NewContract />
      </div>
    </div>
  );
}
