import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { accountService, transactionService } from '../services/api';

export default function AccountDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [txForm, setTxForm] = useState({ type: 'income', amount: '', description: '' });
    const [txError, setTxError] = useState('');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [accountRes, txRes] = await Promise.all([
                accountService.getOne(id),
                transactionService.getAll(id)
            ]);
            setAccount(accountRes.data);
            setTransactions(txRes.data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
            try {
                await accountService.delete(id);
                navigate('/dashboard');
            } catch (err) {
                alert('Error al eliminar la cuenta');
            }
        }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();
        setTxError('');
        try {
            await transactionService.create(id, txForm);
            setShowTransactionForm(false);
            setTxForm({ type: 'income', amount: '', description: '' });
            loadData(); // Refresh data
        } catch (err) {
            setTxError(err.response?.data?.message || err.response?.data?.errors?.amount?.[0] || 'Error al registrar transacción');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>← Volver al Dashboard</Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <div>
                    <h1>{account?.name}</h1>
                    <p>Tipo: {account?.type}</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold' }}>${account?.balance?.toFixed(2)}</p>
                </div>
                <div>
                    <Link to={`/accounts/${id}/edit`} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '5px' }}>
                        Editar
                    </Link>
                    <button onClick={handleDelete} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Eliminar
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Transacciones</h2>
                    <button 
                        onClick={() => setShowTransactionForm(!showTransactionForm)}
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Nueva Transacción
                    </button>
                </div>

                {showTransactionForm && (
                    <div style={{ marginTop: '15px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <h3>Nueva Transacción</h3>
                        {txError && <div style={{ color: 'red', marginBottom: '10px' }}>{txError}</div>}
                        <form onSubmit={handleTransaction}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Tipo:</label>
                                <select
                                    value={txForm.type}
                                    onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                >
                                    <option value="income">Ingreso</option>
                                    <option value="expense">Gasto</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Monto:</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={txForm.amount}
                                    onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Descripción:</label>
                                <input
                                    type="text"
                                    value={txForm.description}
                                    onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                Registrar
                            </button>
                        </form>
                    </div>
                )}

                {transactions.length === 0 ? (
                    <p style={{ marginTop: '20px' }}>No hay transacciones aún.</p>
                ) : (
                    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Tipo</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Descripción</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{new Date(tx.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ color: tx.type === 'income' ? 'green' : 'red' }}>
                                            {tx.type === 'income' ? 'Ingreso' : 'Gasto'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{tx.description || '-'}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: tx.type === 'income' ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}