import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopHeader from './components/TopHeader';
import { useNavigate } from 'react-router-dom';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/tasks', {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Adicione o token de autenticação
                    },
                });
                setTasks(response.data);

            } catch (error) {
                handleError(error);
            }
        };
        
        fetchTasks();

    }, []);

    const handleCadastroClick = () => {
        navigate('/tasks/new');
    };

    const handleError = (error) => {
        if (error.response && error.response.data) {
            const { data } = error.response;
            const errorMessage = data.message || 'Erro desconhecido';
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage('Erro desconhecido');
        }
    };

    const handleEditTask = (taskId) => {
        navigate(`/tasks/${taskId}/edit`);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Atualize a lista de tarefas após a exclusão
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
            closeConfirmationModal(); // Fechar o modal após a exclusão
            setSuccessMessage('Tarefa excluída com sucesso.');
        } catch (error) {
            handleError(error);
        }
    };

    const openConfirmationModal = (taskId) => {
        setIsModalOpen(true);
        setTaskIdToDelete(taskId);
    };

    const closeConfirmationModal = () => {
        setIsModalOpen(false);
        setTaskIdToDelete(null);
    };

    const confirmDeleteTask = () => {
        if (taskIdToDelete) {
            handleDeleteTask(taskIdToDelete);
        }
    };

    return (
        <div>
            <TopHeader />

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <h3>Lista de tarefas</h3>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <button className="btn btn-success" onClick={handleCadastroClick}><i className='fas fa-plus'></i> Cadastrar</button>
                    </div>
                </div>

                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                
                <table className="table table-striped mt-5" id='datatables'>
                    <thead>
                        <tr>
                            <th scope="col">Título</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Status</th>
                            <th scope="col" width="15%">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.status}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary" onClick={() => handleEditTask(task.id)}><i className='fas fa-pen-to-square'></i> Editar</button>&nbsp;
                                    <button className="btn btn-sm btn-danger" onClick={() => openConfirmationModal(task.id)}><i className='fas fa-times'></i> Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title">Confirmação de Exclusão</h5>
                        <button type="button" className="close" onClick={closeConfirmationModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div className="modal-body">
                        Tem certeza de que deseja excluir esta tarefa?
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-secondary" onClick={closeConfirmationModal}>Cancelar</button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={confirmDeleteTask}>Confirmar</button>
                        </div>
                    </div>
                    </div>
                </div>
                )}
                {isModalOpen && <div className="modal-backdrop fade show"></div>}

            </div>
        </div>
    );
}

export default Tasks;
