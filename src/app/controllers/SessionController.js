import jwt from 'jsonwebtoken';
import User from "../models/User";
import authConfig from "../../config/auth"

class SessionControler {

    async store(req, res) {

        const { email, password } = req.body;

        //verificando se email existe
        const user = await User.findOne({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({ err: "Usuário não encontrado" });
        }

        if (await user.checkPassword(password)) {

            const { id, name } = user;

            return res.json({
                user: {
                    id,
                    name
                },
                token: jwt.sign({ id }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn
                })
            })
        }

        return res.status(403).json({ err: "Senha inválida" })
    }




}
export default new SessionControler();