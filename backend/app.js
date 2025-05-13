// Importo todo lo de la libreria de Express
import express from "express";
import employeeRoutes from "./src/routes/employees.js"
import loginRoutes from "./src/routes/login.js"
import cookieParser from "cookie-parser"
import logoutRoutes from "./src/routes/logout.js"
import registerEmployeesRoutes from "./src/routes/registerEmployees.js"
import cors from 'cors'

// Creo una constante que es igual a la libreria que importé
const app = express();

app.use(
    cors({
      origin: "http://localhost:5173", // Dominio del cliente
      credentials: true, // Permitir envío de cookies y credenciales
    })
  );

// Que acepte datos en json
app.use(express.json());
// Que acepte cookies
app.use(cookieParser());

// Definir las rutas de las funciones que tendrá la página web
app.use("/api/employee", employeeRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/logout", logoutRoutes)
app.use("/api/registerEmployees", registerEmployeesRoutes);

// Exporto la constante para poder usar express en otros archivos
export default app;