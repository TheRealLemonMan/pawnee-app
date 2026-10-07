import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Diseno } from "./componentes/Diseno";
import { ListaCriaturas } from "./paginas/ListaCriaturas";
import { DetalleCriatura } from "./paginas/DetalleCriatura";
import { FormularioCriatura } from "./paginas/FormularioCriatura";
import { ListaAvistamientos } from "./paginas/ListaAvistamientos";
import { FormularioAvistamiento } from "./paginas/FormularioAvistamiento";
import { PaginaNoEncontrada } from "./paginas/PaginaNoEncontrada";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Diseno />}>
          <Route path="/" element={<ListaCriaturas />} />
          <Route path="/criaturas/nueva" element={<FormularioCriatura />} />
          <Route path="/criaturas/:id" element={<DetalleCriatura />} />
          <Route path="/criaturas/:id/editar" element={<FormularioCriatura />} />
          <Route path="/avistamientos" element={<ListaAvistamientos />} />
          <Route path="/avistamientos/nuevo" element={<FormularioAvistamiento />} />
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
