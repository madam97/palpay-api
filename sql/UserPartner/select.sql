SELECT up.id, up.user_id, ui.name, ba.account_number, up.nickname
FROM `{PREFIX}users` AS u 
  INNER JOIN `{PREFIX}user_partners` AS up ON u.id = up.partner_user_id AND up.user_id = ?
  INNER JOIN `{PREFIX}user_infos` ui ON u.id = ui.user_id
  INNER JOIN `{PREFIX}bank_accounts` ba ON u.id = ba.user_id