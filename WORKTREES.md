# WorkTrees - FinVisor

## Descripción

Este proyecto usa Git WorkTrees para permitir que múltiples agentes trabajen de forma aislada en carpetas físicas independientes, cada uno con su propia rama.

## Estructura de WorkTrees

```
Sistema/
├── worktrees/
│   ├── dashboard/      → Rama: agent-dashboard
│   ├── accounts/       → Rama: agent-accounts
│   └── transactions/   → Rama: agent-transactions
├── backend/            → Rama: master (principal)
└── frontend/          → Rama: master (principal)
```

## Comandos para agentes

### Dashboard Agent
```bash
cd D:\Escritorio\Prueba de Flujo\Sistema\worktrees\dashboard
git checkout agent-dashboard
# Trabajar en features del dashboard
git push origin agent-dashboard
```

### Accounts Agent
```bash
cd D:\Escritorio\Prueba de Flujo\Sistema\worktrees\accounts
git checkout agent-accounts
# Trabajar en features de cuentas
git push origin agent-accounts
```

### Transactions Agent
```bash
cd D:\Escritorio\Prueba de Flujo\Sistema\worktrees\transactions
git checkout agent-transactions
# Trabajar en features de transacciones
git push origin agent-transactions
```

## Flujo de trabajo

1. Cada agente trabaja en su worktree independiente
2. Push de cambios a su rama remota (agent-*)
3. Crear PR hacia develop o master
4. CodeRabbit revisa automáticamente
5. CI/CD ejecuta tests y seguridad
6. Merge después de aprobación

## Sincronización

Para actualizar un worktree con los últimos cambios de master:
```bash
git fetch origin
git pull origin master
```

## Listar worktrees

```bash
git worktree list
```