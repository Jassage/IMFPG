"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const auth_Controllers_1 = require("../controllers/auth.Controllers");
// 🔥 SUPPRIMER AuthenticatedRequest et utiliser Request standard
const authenticateToken = async (req, // 🔥 Utiliser Request standard
res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Token d'accès requis" });
        }
        const user = await (0, auth_Controllers_1.verifyToken)(token);
        // Ajouter l'utilisateur à la requête
        req.user = user; // 🔥 Maintenant compatible avec l'interface étendue
        req.userId = user.id; // Pour compatibilité
        next();
    }
    catch (error) {
        console.error("❌ Erreur authentification:", error.message);
        return res.status(401).json({ message: error.message });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: "Accès non autorisé" });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.middleware.js.map