import UsuarioModel from "../models/usuario.model.js";
import CartModel from "../models/cart.model.js";

import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import UserDTO from "../dto/user.dto.js";

class UsuarioController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await UsuarioModel.findOne({ email });
            if (existeUsuario) {
                return res.status(400).send("El usuario ya existe");
            }

            //Creo un nuevo carrito: 
            const newCart = new CartModel();
            await newCart.save();

            const newUser = await UsuarioModel.create({
                first_name,
                last_name,
                email,
                cart: newCart._id, 
                password: createHash(password),
                age
            });

            await newUser.save();

            req.session.login = true;
            req.session.user = {...newUser._doc}//metodo para subir el obj newUser



            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UsuarioModel.findOne({ email });

            if (!usuarioEncontrado) {
                return res.status(401).send("Usuario no válido");
            }

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                return res.status(401).send("Contraseña incorrecta");
            }

            req.session.login = true;
            req.session.user = {...usuarioEncontrado._doc};
                
            // res.cookie("coderCookieToken", {
            //     maxAge: 3600000,
            //     httpOnly: true
            // });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async profile(req, res) {
        //Con DTO: 
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        req.session.destroy();
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }
}

export default UsuarioController;