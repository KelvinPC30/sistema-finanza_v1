import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService, accountService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [dashRes, accountsRes] = await Promise.all([
                dashboardService.getData(),
                accountService.getAll()
            ]);
            setDashboardData(dashRes.data);
            setAccounts(accountsRes.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Dashboard - FinVisor</h1>
                <div>
                    <span>Hola, {user?.name} ({user?.role}) </span>
                    <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                    <h3>Saldo Total</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${dashboardData?.total_balance?.toFixed(2) || '0.00'}</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                    <h3>Cuentas</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardData?.total_accounts || 0}</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                    <h3>Ingresos del Mes</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>+${dashboardData?.income_this_month?.toFixed(2) || '0.00'}</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
                    <h3>Gastos del Mes</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>-${dashboardData?.expense_this_month?.toFixed(2) || '0.00'}</p>
                </div>
            </div>

            {/* Accounts Section */}
            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Mis Cuentas</h2>
                    <Link to="/accounts/new" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                        Nueva Cuenta
                    </Link>
                </div>
                {accounts.length === 0 ? (
                    <p>No tienes cuentas aún. Crea una para empezar.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                        {accounts.map(account => (
                            <div key={account.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                                <h3>{account.name}</h3>
                                <p>Tipo: {account.type}</p>
                                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>${account.balance.toFixed(2)}</p>
                                <Link to={`/accounts/${account.id}`}>Ver detalles</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Transactions */}
            <div>
                <h2>Transacciones Recientes</h2>
                {dashboardData?.recent_transactions?.length === 0 ? (
                    <p>No hay transacciones aún.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Cuenta</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Tipo</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Descripción</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData?.recent_transactions?.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{new Date(tx.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>{tx.account_name}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ color: tx.type === 'income' ? 'green' : 'red' }}>
                                            {tx.type === 'income' ? 'Ingreso' : 'Gasto'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{tx.description || '-'}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: tx.type === 'income' ? 'green' : 'red' }}>
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