import express from 'express';
const router = express.Router();
import passport from 'passport';
import UserController from '../controllers/usuario.controller.js';
import authMiddleware from "../middleware/authmiddleware.js";
import CustomError from "../services/errores/custom-error.js";
import { generarInfoError } from "../services/errores/info.js";
import { EErrors } from "../services/errores/enums.js";
//import { generateFakeProducts } from "../utils/util.js";

const userController = new UserController();
const arrayProductos = [];

router.post("/", async (req, res, next) => { 
    const { producto, carrito, stock, ticket } = req.body;

    try {
        if (!producto || !carrito || !stock || !ticket) {
            throw CustomError.crearError({
                nombre: "Producto Error",
                causa: generarInfoError({ producto, carrito, stock, ticket }),
                mensaje: "Error al intentar crear producto",
                codigo: EErrors.INVALID_PRODUCT_DATA.code
            });
        }

        const nuevoProducto = {
            producto,
            carrito,
            stock,
            ticket
        }

        arrayProductos.push(nuevoProducto);
        console.log(arrayProductos);
        res.send({ status: "success", payload: nuevoProducto });

    } catch (error) {
        next(error);
    }
});

router.post('/register', passport.authenticate('register', { 
    successRedirect: '/api/users/profile',
    failureRedirect: '/register',
    failureFlash: true 
}));

router.post('/login', passport.authenticate('login', { 
    successRedirect: '/api/users/profile',
    failureRedirect: '/login',
    failureFlash: true 
}));

router.get('/profile', authMiddleware, userController.profile);
router.post('/logout', userController.logout);
router.get('/admin', authMiddleware, userController.admin);

export default router;
