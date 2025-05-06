-- Conceder privilégios adicionais ao usuário petuser
GRANT ALL PRIVILEGES ON *.* TO 'petuser'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Mensagem para indicar que o script foi executado
SELECT 'Privilégios concedidos ao usuário petuser' as message; 