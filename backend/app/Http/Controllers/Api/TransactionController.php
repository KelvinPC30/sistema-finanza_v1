<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function index(Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $transactions = $account->transactions()->orderBy('created_at', 'desc')->get();
        return response()->json($transactions);
    }

    public function store(Request $request, Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
        ]);

        // Check for insufficient funds
        if ($request->type === 'expense' && $account->balance < $request->amount) {
            throw ValidationException::withMessages([
                'amount' => ['Saldo insuficiente.'],
            ]);
        }

        $transaction = $account->transactions()->create([
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
        ]);

        // Update account balance
        if ($request->type === 'income') {
            $account->balance += $request->amount;
        } else {
            $account->balance -= $request->amount;
        }
        $account->save();

        return response()->json([
            'transaction' => $transaction,
            'account_balance' => $account->balance,
        ], 201);
    }
}
