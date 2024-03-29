import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import TopHeader from './components/TopHeader';
import { useLocation, useParams, Link } from 'react-router-dom';

function TaskForm() {
    const location = useLocation();
    const { id } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
    });

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${id}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const taskData = response.data;
                setFormData(taskData); // Define os dados da tarefa no estado do formulário
            } catch (error) {
                // Handle error
            }
        };

        if (id) {
            fetchTask(); // Se taskId estiver definido, busca os detalhes da tarefa
        }
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (id) {
                // Se taskId estiver definido, significa que estamos editando uma tarefa existente
                const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${id}`, formData, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.status === 200) {
                    setSuccessMessage('Tarefa atualizada com sucesso!');
                    // Redirecione para a página de tarefas ou faça outra ação de redirecionamento
                } else {
                    alert('Ocorreu um erro ao atualizar a tarefa. Por favor, tente novamente.');
                }
            } else {
                // Se taskId não estiver definido, significa que estamos cadastrando uma nova tarefa
                const response = await axios.post('http://127.0.0.1:8000/api/tasks', formData, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.status === 201) {
                    setSuccessMessage('Tarefa cadastrada com sucesso!');
                    setFormData({
                        title: '',
                        description: '',
                        status: '',
                    });
                }
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error) => {
        if (error.response && error.response.data) {
            const { data } = error.response;
            let errorMessage = '';

            // Verifica se há uma mensagem de erro principal
            if (data.errors) {

                // Se não houver mensagem principal, verifica se há erros detalhados
                const errorDetails = [];

                // Itera sobre os detalhes de erro e os adiciona à lista de erros
                for (const key in data.errors) {
                    if (Array.isArray(data.errors[key])) {
                        errorDetails.push(...data.errors[key]);
                    } else {
                        errorDetails.push(data.errors[key]);
                    }
                }

                // Constrói a mensagem de erro final combinando a mensagem principal e os detalhes de erro
                errorMessage = `${errorMessage} (${errorDetails.join(' ')})`;


            } else {
                errorMessage = data.message;
            }

            setErrorMessage(errorMessage);
        } else {
            setErrorMessage('Erro desconhecido');
        }
    };

    return (
        <div>
            <TopHeader />
            <div className="container mt-5">

                <div className="row mb-4">
                    <div className="col-md-6">
                        <h3>{location.pathname.includes('edit') ? 'Editar Tarefa' : 'Cadastrar Tarefa'}</h3>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <Link to="/tasks" className="btn btn-secondary"><i className='fas fa-arrow-left'></i> Voltar</Link>
                    </div>
                </div>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="title">Título:</label>
                        <input type="text" id="title" name="title" className='form-control' value={formData.title} onChange={handleChange} required/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="description">Descrição:</label>
                        <textarea id="description" name="description" className='form-control' value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="status">Status:</label>
                        <select id="status" name="status" className='form-control form-select' value={formData.status} onChange={handleChange} required>
                            <option value="">Selecione</option>
                            <option value="pendente">Pendente</option>
                            <option value="concluída">Concluída</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>
                    <button type="submit" className='btn btn-success'><i className='fas fa-check'></i> Salvar</button>
                </form>
            </div>
        </div>
    );
}

export default TaskForm;
