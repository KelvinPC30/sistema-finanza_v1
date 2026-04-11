import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { accountService } from '../services/api';

export default function AccountForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        type: 'checking',
        initial_balance: 0
    });

    useEffect(() => {
        if (id) {
            loadAccount();
        }
    }, [id]);

    const loadAccount = async () => {
        try {
            const res = await accountService.getOne(id);
            setFormData({
                name: res.data.name,
                type: res.data.type,
                initial_balance: res.data.balance
            });
        } catch (err) {
            setError('Error al cargar la cuenta');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            if (id) {
                await accountService.update(id, formData);
            } else {
                await accountService.create(formData);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
            <h2>{id ? 'Editar Cuenta' : 'Nueva Cuenta'}</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Nombre de la Cuenta:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Tipo de Cuenta:</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="checking">Cuenta Corriente</option>
                        <option value="savings">Cuenta de Ahorros</option>
                        <option value="credit">Tarjeta de Crédito</option>
                    </select>
                </div>
                
                {!id && (
                    <div style={{ marginBottom: '15px' }}>
                        <label>Saldo Inicial:</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.initial_balance}
                            onChange={(e) => setFormData({ ...formData, initial_balance: parseFloat(e.target.value) || 0 })}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                )}
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </form>
            
            <Link to="/dashboard" style={{ display: 'block', marginTop: '15px', textAlign: 'center' }}>
                Volver al Dashboard
            </Link>
        </div>
    );
}