!!!!!!!!!!
    SELECT DISTINCT
    u.username,
    CASE 
        WHEN c.user_id = 1 THEN c.contact_id 
        ELSE c.user_id 
    END as contact_id,
    m.content as lastMessage,
    m.timestamp
FROM
    contacts c
JOIN
    users u ON (c.contact_id = u.id AND c.user_id = 1 ) OR (c.user_id = u.id AND c.contact_id = 1)
LEFT JOIN
    (SELECT sender_id, receiver_id, MAX(id) AS max_timestamp
     FROM messages
     GROUP BY sender_id, receiver_id) AS lastMsg ON (lastMsg.sender_id = c.contact_id AND lastMsg.receiver_id = c.user_id) OR (lastMsg.sender_id = c.user_id AND lastMsg.receiver_id = c.contact_id)
LEFT JOIN
    messages m ON m.sender_id = lastMsg.sender_id AND m.receiver_id = lastMsg.receiver_id AND m.timestamp = lastMsg.max_timestamp
WHERE 
    (c.contact_id = 1 OR c.user_id = 1)
AND 
    NOT (c.contact_id = 1 AND c.user_id = 1);


    SELECT DISTINCT
    u.username,
    CASE 
        WHEN c.user_id = 1 THEN c.contact_id 
        ELSE c.user_id 
    END as contact_id,
    m.content as lastMessage,
    m.timestamp
FROM
    contacts c
JOIN
    users u ON (c.contact_id = u.id AND c.user_id = 1 ) OR (c.user_id = u.id AND c.contact_id = 1)
LEFT JOIN
    (SELECT sender_id, receiver_id, MAX(timestamp) AS max_timestamp, MAX(id) AS max_id
     FROM messages
     GROUP BY sender_id, receiver_id) AS lastMsg ON (lastMsg.sender_id = c.contact_id AND lastMsg.receiver_id = c.user_id) OR (lastMsg.sender_id = c.user_id AND lastMsg.receiver_id = c.contact_id)
LEFT JOIN
    messages m ON m.sender_id = lastMsg.sender_id AND m.receiver_id = lastMsg.receiver_id AND m.timestamp = lastMsg.max_timestamp AND m.id=lastMsg.max_id
WHERE 
    (c.contact_id = 1 OR c.user_id = 1)
AND 
    NOT (c.contact_id = 1 AND c.user_id = 1);

















SELECT c.*, u.username FROM contacts c JOIN users u ON u.id=c.contact_id LEFT JOIN messages m ON  WHERE user_id=1 and contact_id=13;

SELECT u.username, c.contact_id, m.content as lastMessage, m.timestamp FROM contacts c JOIN users u ON u.id=c.contact_id LEFT JOIN messages m ON m.sender_id=c.user_id WHERE user_id=1 and contact_id=13;

UPDATE messages SET showSender = CASE WHEN sender_id=1 AND receiver_id=6 THEN 0 ELSE 1 END, showReceiver = CASE WHEN sender_id=6 AND receiver_id=1 THEN 0 ELSE 1