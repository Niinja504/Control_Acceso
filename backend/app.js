// Importo todo lo de la libreria de Express
import express from "express";
import employeeRoutes from "./src/routes/employees.js"
import loginRoutes from "./src/routes/login.js"
import cookieParser from "cookie-parser"
import logoutRoutes from "./src/routes/logout.js"
import registerEmployeesRoutes from "./src/routes/registerEmployees.js";
import cors from 'cors';
import authRoutes from "./src/routes/authRoutes.js";
import coordinatorsRoutes from "./src/routes/coordinatorsRoutes.js";


const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173', // Permitir solicitudes desde el frontend
  credentials: true // Si necesitas enviar cookies o encabezados de autenticación
}));

// Que acepte datos en json
app.use(express.json());
// Que acepte cookies
app.use(cookieParser());

// Definir las rutas de las funciones que tendrá la página web
app.use("/api/employee", employeeRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/logout", logoutRoutes)
app.use("/api/registerEmployees", registerEmployeesRoutes)
app.use("/api", authRoutes); // Agregar las rutas de autenticación
app.use("/api/coordinators", coordinatorsRoutes); // Ruta para coordinadores

// Exporto la constante para poder usar express en otros archivos
export default app;