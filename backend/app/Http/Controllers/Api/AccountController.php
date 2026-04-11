<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Auth::user()->accounts()->get();
        return response()->json($accounts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:checking,savings,credit',
            'initial_balance' => 'nullable|numeric|min:0',
        ]);

        $account = Auth::user()->accounts()->create([
            'name' => $request->name,
            'type' => $request->type,
            'balance' => $request->initial_balance ?? 0,
        ]);

        return response()->json($account, 201);
    }

    public function show(Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($account);
    }

    public function update(Request $request, Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:checking,savings,credit',
        ]);

        $account->update($request->only(['name', 'type']));

        return response()->json($account);
    }

    public function destroy(Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $account->delete();

        return response()->json(null, 204);
    }
}
