# PalPay API

## Testing

| User login            | Bank account number        |
| --------------------- | -------------------------- |
| sergio / testsergio   | 38127351-43287452-98643132 |
| renee / testrenee     | 87943463-32137645-32132148 |
| lauren / testlauren   | 76321313-43853213-32183652 |

## API endpoints

| method  | path                                | description |
| ------- | ----------------------------------- | ----------- |
| **Auth endpoints** |
| POST    | /auth/login                         | logins the user |
| POST    | /auth/logout                        | logouts the user |
| POST    | /auth/refresh                       | refresh the logged user's token |
| **User endpoints** |
| GET     | /users/{$id}                        | gets the user's info and bank account data |
| GET     | /users/{$id}/partners               | gets the user's partners' data that is nessesary for sending payment |
| PATCH   | /users/{$id}/user_info              | updates user's info data |
| **Bank account endpoints** |
| GET     | /bank_account/{$id}/payments        | gets the payments of the given bank account |
| POST    | /bank_account/{$id}/payments        | create a new payment of the given bank account |

## Database source for QuickDBD website

users
-----
id PK int
user_info_id FK - user_info.id
bank_account_id FK - bank_accounts.id
username UNIQUE varchar(255)
password varchar(255)

user_info
-----
id PK int
name varchar(255)
address text
telephone varchar(255)
email varchar(255)

bank_accounts
-----
id PK int
account_number UNIQUE varchar(26)
balance int=0

user_partners
-----
user1_id FK - users.id
user2_id FK - users.id


payments
-----
id PK int
from_bank_account_id FK - bank_accounts.id
to_bank_account_id FK - bank_accounts.id
amount int
notice varchar(255)
created_at datetime default=NOW()