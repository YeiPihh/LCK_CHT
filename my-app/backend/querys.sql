SELECT DISTINCT 
      c.contact_id,
      c.user_id,
      m.receiver_id,
      u.username, 
      m.content as lastMessage, 
      m.timestamp, 
      m.isLast 
      FROM 
          contacts c 
      JOIN 
          users u ON (c.contact_id = u.id AND c.user_id = 1 ) OR (c.user_id = u.id AND c.contact_id = 1)
      LEFT JOIN 
          (SELECT sender_id, receiver_id, isLast
           FROM messages 
           WHERE isLast = 1
           GROUP BY sender_id, receiver_id) AS lastMsg ON (lastMsg.sender_id = c.contact_id AND lastMsg.receiver_id = c.user_id) OR (lastMsg.sender_id = c.user_id AND lastMsg.receiver_id = c.contact_id)
      LEFT JOIN 
          messages m ON m.sender_id = lastMsg.sender_id AND m.receiver_id = lastMsg.receiver_id AND m.isLast = lastMsg.isLast
      WHERE 
          (c.contact_id = 1 OR c.user_id = 1) ORDER BY m.timestamp DESC;







CREATE TABLE unread_messages (
    id INT NOT NULL AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id),
    FOREIGN KEY (message_id) REFERENCES messages (id),
    INDEX (receiver_id),
    INDEX (sender_id),
    INDEX (message_id)
);










SELECT DISTINCT
    u.username,
    CASE 
        WHEN c.user_id = 1 THEN c.contact_id 
        ELSE c.user_id 
    END as contact_id,
    m.content as lastMessage,
    m.timestamp,
    m.isLast
FROM
    contacts c
JOIN
    users u ON (c.contact_id = u.id AND c.user_id = 1 ) OR (c.user_id = u.id AND c.contact_id = 1)
LEFT JOIN
    (SELECT sender_id, receiver_id, isLast
     FROM messages
     WHERE isLast = 1
     GROUP BY sender_id, receiver_id) AS lastMsg ON (lastMsg.sender_id = c.contact_id AND lastMsg.receiver_id = c.user_id) OR (lastMsg.sender_id = c.user_id AND lastMsg.receiver_id = c.contact_id)
LEFT JOIN
    messages m ON m.sender_id = lastMsg.sender_id AND m.receiver_id = lastMsg.receiver_id AND m.isLast = lastMsg.isLast
WHERE 
    (c.contact_id = 1 OR c.user_id = 1)
AND 
    NOT (c.contact_id = 1 AND c.user_id = 1);