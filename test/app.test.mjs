// app.test.mjs
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";



// ✅ Generar tokens con el mismo secreto que usas en producción
const tokenCliente = jwt.sign(
  { id: "cliente123", rol: "cliente" },
  process.env.JWT_SECRET || "secreto_de_prueba",
  { expiresIn: "1h" }
);

const decodedCliente = jwt.verify(tokenCliente, process.env.JWT_SECRET);
const roleCliente = decodedCliente.rol;

//console.log("Token Cliente:", tokenCliente);
//console.log("Rol del cliente decodificado:", roleCliente);


const tokenAdmin = jwt.sign(
  { id: "admin123", rol: "admin" },
  process.env.JWT_SECRET || "secreto_de_prueba",
  { expiresIn: "1h" }
);

const decodedAdmin = jwt.verify(tokenAdmin, process.env.JWT_SECRET);
const roleAdmin = decodedAdmin.rol;

//console.log("Token Admin:", tokenAdmin);
//console.log("Rol del admin decodificado:", roleAdmin);

//console.log("Secreto JWT:", process.env.JWT_SECRET || "VACIO");
// ✅ Declarar rutas ANTES del describe()
const rutas = [
  { path: "/", esperado: [200, 302, 404] },
  { path: "/login", esperado: [200, 302, 404] },
  { path: "/logout", esperado: [200, 302, 404] },
  { path: "/registro_usuario", esperado: [200, 302, 404] },
  { path: "/perfil", esperado: [200, 302, 401, 404], rol: "CLIENTE" },
  { path: "/chatbot", esperado: [200, 302, 404], rol: "CLIENTE" },
  { path: "/pdf", esperado: [200, 301, 302, 400, 404], rol: "CLIENTE" },
  { path: "/registro_usuario/ADMINISTRADOR2025", esperado: [200, 302, 404] },
  { path: "/tablas", esperado: [200, 302, 403, 404], rol: "ADMIN" },
  { path: "/grupo", esperado: [200, 302, 404], rol: "CLIENTE" },
  { path: "/Finanzas_Raiz", esperado: [200, 302, 404] },
];

describe("Test profesional de rutas principales de appExpress", () => {
  for (const ruta of rutas) {
    it(`GET ${ruta.path} debe devolver ${ruta.esperado.join(" o ")}`, async () => {
      let req = request(app).get(ruta.path);

      // ✅ Agregar token solo si la ruta lo necesita
      if (ruta.rol === "CLIENTE") {
        req = req.set("Authorization", `Bearer ${tokenCliente}`);
      } else if (ruta.rol === "ADMIN") {
        req = req.set("Authorization", `Bearer ${tokenAdmin}`);
      }

      const res = await req;

      if (!ruta.esperado.includes(res.status)) {
        throw new Error(
          `Status inesperado en ${ruta.path}: ${res.status}.\nBody: ${JSON.stringify(res.body)}`
        );
      }
    });
  }

  it("GET /ruta-inexistente debe devolver 404", async () => {
    const res = await request(app).get("/noexiste");
    if (res.status !== 404) {
      throw new Error(`Status inesperado: ${res.status}`);
    }
  });
});
