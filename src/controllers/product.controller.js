import ProductRepository from "../repositories/product.repository.js";
const productRepository = new ProductRepository();


class ProductController {
    async addProduct(req, res) {
        const newProduct = req.body; 
        try {
            const data = await productRepository.addProduct(newProduct);
            
            res.json(data);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const products = await productRepository.getProducts(limit, page, sort, query);
                    res.json(products);
        } catch (error) {
            res.status(500).json("Error al obtener los productos en controller");
        }
    }
    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const prod = await productRepository.getProductById(id);
            if (!prod) {
                return res.json({
                    error: "Producto no encontrado en controller"
                });
            }
            res.json(prod)
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productoActualizado = req.body;

            const resultado = await productRepository.updateProduct(id, productoActualizado);
            res.json(resultado);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto en controller");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let respuesta = await productRepository.deleteProduct(id);

            res.json(respuesta);
        } catch (error) {
            res.status(500).send("Error al eliminar el producto en controller");
        }
    }

}

export default ProductController;
