export const criarAgendamento = async (req, res) => {
    try {
        const { nome_pet, raca, data_agendamento, observacoes } = req.body;
        const usuario_id = req.user.id;
        const imagem_path = req.file ? `/uploads/${req.file.filename}` : null;
        
        // Validação básica
        if (!nome_pet || !raca || !data_agendamento) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }
        
        // Verifica se já existe agendamento no mesmo horário
        const [existing] = await req.db.execute(
            'SELECT * FROM agendamentos WHERE usuario_id = ? AND data_agendamento = ?',
            [usuario_id, data_agendamento]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Já existe um agendamento para este horário' });
        }
        
        // Insere o novo agendamento
        const [result] = await req.db.execute(
            'INSERT INTO agendamentos (usuario_id, nome_pet, raca, data_agendamento, observacoes) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, nome_pet, raca, data_agendamento, observacoes]
        );
        
        res.status(201).json({ 
            message: 'Agendamento criado com sucesso',
            id: result.insertId
        });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
};

export const listarAgendamentos = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        
        const [agendamentos] = await req.db.execute(
            'SELECT * FROM agendamentos WHERE usuario_id = ? ORDER BY data_agendamento ASC',
            [usuario_id]
        );
        
        res.json(agendamentos);
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        res.status(500).json({ error: 'Erro ao listar agendamentos' });
    }
};

export const atualizarAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.user.id;
        const imagem_path = req.file ? `/uploads/${req.file.filename}` : null;
        const { nome_pet, raca, data_agendamento, observacoes } = req.body;
        
        // Verifica se o agendamento pertence ao usuário
        const [agendamento] = await req.db.execute(
            'SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?',
            [id, usuario_id]
        );
        
        if (agendamento.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }
        
        // Atualiza o agendamento
        await req.db.execute(
            'UPDATE agendamentos SET nome_pet = ?, raca = ?, data_agendamento = ?, observacoes = ? WHERE id = ?',
            [nome_pet, raca, data_agendamento, observacoes, id]
        );
        
        res.json({ message: 'Agendamento atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
};

export const excluirAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.user.id;
        
        // Verifica se o agendamento pertence ao usuário
        const [agendamento] = await req.db.execute(
            'SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?',
            [id, usuario_id]
        );
        
        if (agendamento.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }
        
        // Exclui o agendamento
        await req.db.execute(
            'DELETE FROM agendamentos WHERE id = ?',
            [id]
        );
        
        res.json({ message: 'Agendamento excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        res.status(500).json({ error: 'Erro ao excluir agendamento' });
    }
};