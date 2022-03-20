UPDATE `{PREFIX}users` 
SET username = ?, password = ?, role = ?, refresh_token = ?
WHERE id = ?;
