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
| GET     | /users/{$id}/user-info              | gets the user's info |
| PATCH   | /users/{$id}/user-info              | updates the user's info |
| GET     | /users/{$id}/bank-account           | gets the user's bank account data |
| GET     | /users/{$id}/partner               | gets the user's partners' data that is nessesary for sending payment |
| POST    | /users/{$id}/partner               | create a new user and partner connection |
| PATCH   | /users/{$id}/partner/{$partner_id} | updates the user and partner connection |
| DELETE  | /users/{$id}/partner/{$partner_id} | deletes the user and partner connection |
| **Bank account endpoints** |
| GET     | /bank-account/{$id}/payment        | gets the payments of the given bank account |
| POST    | /bank-account/{$id}/payment        | create a new payment of the given bank account |

## Database source for QuickDBD website

users
-----
id PK int
username UNIQUE varchar(255)
password varchar(255)
role varchar(8) default='user'
refresh_token varchar(255) default=NULL

user_infos
-----
id PK int
user_id UNIQUE int FK - users.id
name varchar(255)
address text
telephone varchar(255)
email varchar(255)

bank_accounts
-----
id PK int
user_id UNIQUE int FK - users.id
account_number UNIQUE varchar(26)
balance int=0

user_partners
-----
id PK int
user_id UNIQUE FK - users.id
partner_user_id UNIQUE FK - users.id
nickname varchar(32) default=NULL


payments
-----
id PK int
from_bank_account_id FK - bank_accounts.id
to_bank_account_id FK - bank_accounts.id
amount int
notice varchar(255)
created_at datetime default=NOW()