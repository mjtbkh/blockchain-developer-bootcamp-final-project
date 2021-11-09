# Avoiding common attacks

- Using specific compiler pragma
> EthRadio uses `pragma solidity ^0.8.2`.

- Proper use of require and revert
> require is used inside the functions to make sure if the function call meets specific requirements, such as checking `Balances` or `msg.value`.
> revert is used inside fallback function to revert a failed transaction.

- Use modifiers only for validation
> modifiers are used to check if msg.sender has required roll to call a specific function.

- Re-entrancy
> `withdraw` function is designed in a way to avoid re-entrancy attacks.