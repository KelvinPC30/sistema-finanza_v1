<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Total accounts and balance
        $totalAccounts = $user->accounts()->count();
        $totalBalance = $user->accounts()->sum('balance');
        
        // Transactions this month
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        
        $accountsIds = $user->accounts()->pluck('id');
        
        $incomeThisMonth = \App\Models\Transaction::whereIn('account_id', $accountsIds)
            ->where('type', 'income')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('amount');
            
        $expenseThisMonth = \App\Models\Transaction::whereIn('account_id', $accountsIds)
            ->where('type', 'expense')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('amount');
            
        // Recent transactions
        $recentTransactions = \App\Models\Transaction::whereIn('account_id', $accountsIds)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'description' => $transaction->description,
                    'account_name' => $transaction->account->name,
                    'created_at' => $transaction->created_at,
                ];
            });

        return response()->json([
            'total_balance' => $totalBalance,
            'total_accounts' => $totalAccounts,
            'income_this_month' => $incomeThisMonth,
            'expense_this_month' => $expenseThisMonth,
            'recent_transactions' => $recentTransactions,
        ]);
    }
}
