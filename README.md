
# Projeto Valex 

responsável pela criação, recarga, ativação, assim como o processamento das compras.



## Documentação da API

#### Cria cartão (resultado da cvc no console)

```http
  POST /cardcreation
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `x-api-key` | `string` | **Obrigatório**. A chave da sua API |
| `id`       | `number`|  **Obrigatório**. Id do funcionário|
|`typeOfCards`|`string`| groceries, transport, health, restaurants|

#### Ativa cartão (senha é apresentada no console)

```http
  POST /unlockCard
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do cartão |
|`cvc `     |`number`| valor pode ser visto no console|


#### Visualização de saldo e transações

```http
  POST /getTransactions
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do cartão |

#### Bloqueio de cartão

```http
  POST /blockCard
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do cartão |
|`password `     |`string`| valor da senha deve ser digitada com string|

#### Desbloqueio de cartão

```http
  POST /unblockCard
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do cartão |
|`password `     |`string`| valor da senha deve ser digitada com string|

#### Recarga de cartão

```http
  POST /recharge
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do cartão |
|`rechargeValue `     |`number`| valor da recarga maior que zero|

#### Recarga de cartão

```http
  POST /recharge
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `x-api-key` | `string` | **Obrigatório**. A chave da sua API |
| `id`      | `number` | **Obrigatório**. O ID do cartão |
|`rechargeValue `     |`number`| valor da recarga maior que zero|

#### Compra em POS 

```http
  POST /pay
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `cardId` | `number` | **Obrigatório**.Id do cartão |
| `companyId`      | `number` | **Obrigatório**. O ID da empresa |
|`password `     |`string`| senha do cartão|
|`amount `     |`number`| montante|
