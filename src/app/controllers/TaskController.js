import Task from "../models/Task";
import * as Yup from "yup";

class TaskController {

    async index(req, res) {

        const tasks = await Task.findAll({
            where: { user_id: req.userId, check: false }
        })


        return res.json({ tasks })
    }


    async store(req, res) {

        const schema = Yup.object().shape({
            task: Yup.string().required()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ err: "Falha na validação dos dados." })
        }

        const { task } = req.body;

        const newTask = await Task.create({ task, user_id: req.userId });

        return res.json({ task })
    }

    async update(req, res) {

        const schema = Yup.object().shape({
            task: Yup.string(),
            check: Yup.boolean()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ err: "Falha na validação dos dados." });
        }

        const { id } = req.params;

        const taskAtual = await Task.findByPk(id);

        if (!taskAtual) {
            return res.status(400).json({ err: "Task não encontrada" });
        }

        const { task, check } = await taskAtual.update(req.body);

        return res.json({ task, check })
    }

    async delete(req, res) {

        const { id } = req.params;

        const taskAtual = await Task.findByPk(id);

        if (!taskAtual) {
            return res.status(400).json({ err: "Task não encontrada" });
        }

        if (await taskAtual.user_id !== req.userId) {
            return res.status(401).json({ err: "Você não tem permissão para alterar essa task." });
        }

        try {
            await taskAtual.destroy();
            return res.status(204).send();
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: "Erro interno do servidor." })
        }
    }

}

export default new TaskController();