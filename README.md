# Payment Gateway Library

### Challenge
Create a Javascript/TypeScript library with Node.js that will manage virtual bank accounts. The library should support making a deposit to an account, making a withdrawal from an account and transferring money between accounts. Use Postgres database and a library that you are comfortable with for persistence.

Use Case: Customer pays for a haircut by cash and leaves a tip, haircut money should go to the shop's cash account and the tip should go into the barber's cash account. Barber and shop could see their cash balances. When a customer requests a refund then the balance is taken out from the accounts.

The library should allow:

* Making a deposit to an account
* Making a withdrawal from an account
* Making a transfer between two accounts
* Making a refund of a previous transaction
* Getting the account balance
* Showing a history of transactions for an account

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Tests](#tests)
- [Usage](#usage)

## Installation

1. Install dependencies:

   ```sh
   npm install
   ```

2. Generate Prisma client

    ```sh
    npx prisma generate
    ```

## Tests
This library uses the Vitest framework and the ```vitest-mock-extended``` package to mock the Prisma client.
1. Run the tests and the code coverage reporter.
    ```sh
    npm test
    ```
## Configuration

If you want to run this library against a local database you will need to follow these instructions:

1. Connect to your PostgreSQL Server.

2. Create a new database.

3. Create a new user with password.

4. Grant the new user super user privileges or the equivilent.

5. Create a .env file in the root of the project and set the database connection string with the following format:

    ```sh
    DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase?schema=public
    ```

Ensure your PostgreSQL database is running and accessible.

6. Use prisma migrate to configure the initial database schema
    ```sh
    npx prisma migrate dev --name init
    ```
7. Seed the database
    ```sh
    npm run seed
    ```

With the configuration complete, you can now execute the library functions against your local PostgreSQL server if you wish.
## Usage
### Functions

- ```deposit(accountId: string, amount: number): Promise<number>```

- ```withdraw(accountId: string, amount: number): Promise<number>```

- ```transfer(fromAccountId: string, toAccountId: string, amount: number): Promise<{ fromBalance: number, toBalance: number }>```

- ```refund(transactionId: string): Promise<number>```

- ```getBalance(accountId: string): Promise<number>```

- ```getTransactionHistory(accountId: string): Promise<Array<{ id: string, type: string, amount: number, accountId: string, createdAt: Date }>>```

### Example

```typescript
    import {
        deposit,
        withdraw,
        transfer,
        refund,
        getBalance,
        getTransactionHistory,
    } from "./index.ts";

    async function main() {
        try {
            const newBalance = await deposit("account1", 100);
            console.log(`New balance after deposit: ${newBalance}`);

            const balance = await getBalance("account1");
            console.log(`Current balance: ${balance}`);

            const transactions = await getTransactionHistory("account1");
            console.log("Transaction history:", transactions);
        } catch (error) {
            console.error(error);
        }
    }

    main();
```