import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

export const auth = (req, res, next) => {
    try {
        // 1. Verificar cookie "authToken"
        const token = req.cookies.authToken;
        
        if (!token) {
            return res.status(401).json({ 
                status: "error", 
                message: "No autorizado - Cookie faltante" 
            });
        }

        // 2. Verificar y decodificar el JWT
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        
        // 3. Adjuntar datos del usuario al request
        req.user = {
            id: decoded.id,
            userType: decoded.userType
        };

        next();
    } catch (error) {
        // 4. Manejar errores (token inválido/expirado)
        res.clearCookie("authToken");
        res.clearCookie("userData");
        
        return res.status(401).json({ 
            status: "error", 
            message: "Sesión inválida o expirada",
            error: error.message 
        });
    }
};