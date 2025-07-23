import mysql.connector as mysq
from mysql.connector import pooling
import json

class backFunc:
    def __init__(self):
        # Configura pool de conexões para suportar múltiplos usuários
        self.pool = pooling.MySQLConnectionPool(
            pool_name="pool_pedidos",
            pool_size=10,
            host="localhost",
            user="root",
            password="casadapizza",
            database="teste_db"
        )
        # Cria tabela 'pedidos' apenas uma vez
        self._assegurar_tabela_pedidos()

    def _get_conn_cursor(self):
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        return conn, cursor

    def _assegurar_tabela_pedidos(self):
        conn, cursor = self._get_conn_cursor()
        try:
            tabela_sql = """
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) UNIQUE,
                pendentes JSON,
                feitas JSON,
                finalizadas JSON,
                cancelar JSON
            )
            """
            cursor.execute(tabela_sql)
            conn.commit()
        except Exception as e:
            print(f"Erro ao criar tabela 'pedidos': {e}")
        finally:
            cursor.close()
            conn.close()

    def criar_tabela(self, nome):
        """
        Insere um registro inicial em 'pedidos' para o usuário.
        """
        conn, cursor = self._get_conn_cursor()
        try:
            sql = "INSERT INTO pedidos (nome, pendentes, finalizadas, cancelar) VALUES (%s, %s, %s, %s, %s)"
            valores = (nome, json.dumps([]), json.dumps([]), json.dumps([]))
            cursor.execute(sql, valores)
            conn.commit()
        except mysq.errors.IntegrityError:
            # Caso o usuário já tenha um registro em 'pedidos', apenas ignoramos
            pass
        except Exception as e:
            print(f"Erro ao inserir tabela de pedidos para {nome}: {e}")
        finally:
            cursor.close()
            conn.close()

    def apagar_tabela(self, nome):
        conn, cursor = self._get_conn_cursor()
        try:
            sql = "DELETE FROM pedidos WHERE nome = %s"
            cursor.execute(sql, (nome,))
            conn.commit()
            print(f"Linhas afetadas: {cursor.rowcount}")
        except Exception as e:
            print(f"Erro ao apagar pedidos de {nome}: {e}")
        finally:
            cursor.close()
            conn.close()

    def adicionar_pedido(self, pedidos, nome):
        conn, cursor = self._get_conn_cursor()
        try:
            sql = "UPDATE pedidos SET pendentes = %s WHERE nome = %s"
            cursor.execute(sql, (json.dumps(pedidos), nome))
            conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar pedido para {nome}: {e}")
        finally:
            cursor.close()
            conn.close()

    def ver_pedidos(self, nome):
        conn, cursor = self._get_conn_cursor()
        try:
            sql = "SELECT * FROM pedidos WHERE nome = %s"
            cursor.execute(sql, (nome,))
            return cursor.fetchall()
        except Exception as e:
            print(f"Erro ao obter pedidos de {nome}: {e}")
            return []
        finally:
            cursor.close()
            conn.close()
    
    def ver_todos_pedidos(self):
        conn, cursor = self._get_conn_cursor()
        try:
            cursor.execute("SELECT * FROM pedidos")
            return cursor.fetchall()
        except Exception as e:
            print(f"Erro ao obter pedidos de: {e}")
            return []
        finally:
            cursor.close()
            conn.close()


    def drop_tabela_pedidos(self):
        conn, cursor = self._get_conn_cursor()
        try:
            cursor.execute("DROP TABLE IF EXISTS pedidos")
            conn.commit()
            print("Tabela 'pedidos' removida com sucesso.")
        except Exception as e:
            print(f"Erro ao apagar a tabela 'pedidos': {e}")
        finally:
            cursor.close()
            conn.close()

    def encerrar(self):
        # Não há conexão fixa aqui, encerra apenas limpeza se necessário
        pass

if __name__ == "__main__":
    back = backFunc()
    #back.criar_tabela("na")
    #back.apagar_tabela("na")
    #back.drop_tabela_pedidos()
    print(back.ver_pedidos("na"))
    back.encerrar()
