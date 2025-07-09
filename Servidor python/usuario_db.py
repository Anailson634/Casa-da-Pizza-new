import mysql.connector as mysq
import backend_sql
import json

class meu_db():
    def __init__(self):
        self.backEnd = backend_sql.backFunc()
        self.conexao = mysq.connect(
            host="localhost",
            user="root",
            password="casadapizza",
            database="teste_db"
        )
        # Assegura tabela de usuários (só uma vez)
        self._assegurar_tabela_usuarios()

    def _assegurar_tabela_usuarios(self):
        tabela_sql = """
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role VARCHAR(100),
            nome VARCHAR(100) UNIQUE,
            telefone VARCHAR(100),
            senha VARCHAR(100),
            vale_pizzas INT DEFAULT 0,
            creditos INT DEFAULT 0,
            carrinho JSON
        )
        """
        cursor = self.conexao.cursor()
        try:
            cursor.execute(tabela_sql)
            self.conexao.commit()
        except Exception as e:
            print(f"Erro ao garantir criação da tabela usuarios: {e}")
            # Dependendo do caso, poderia propagar ou encerrar a aplicação
        finally:
            cursor.close()

    def criar_usuario(self, role, nome, telefone, senha):
        """
        Pega informações do usuário e insere no banco de dados.
        Retorna uma tupla (status, mensagem), onde status 1 = sucesso, 0 = falha.
        """
        nome_normalizado = nome.strip().lower()
        # Verifica unicidade
        if self.ver_unico_usuario(nome_normalizado):
            return (0, "Este nome já existe em nosso banco de dados")

        sql_parametros = """
            INSERT INTO usuarios (role, nome, telefone, senha, vale_pizzas, creditos, carrinho)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        valores = (role, nome_normalizado, telefone, senha, 0, 0, json.dumps([]))
        cursor = self.conexao.cursor()
        try:
            cursor.execute(sql_parametros, valores)
            self.conexao.commit()
        except mysq.errors.IntegrityError as ie:
            # Em caso de unique constraint violada (nome duplicado)
            # Embora já tenhamos checado antes, em condições de concorrência pode ocorrer.
            print(f"IntegrityError ao inserir usuário: {ie}")
            return (0, "Este nome já existe em nosso banco de dados")
        except Exception as e:
            print(f"Erro inesperado ao inserir usuário: {e}")
            return (0, "Erro interno ao criar usuário")
        finally:
            cursor.close()

        # Se inseriu com sucesso, criar tabela/recursos adicionais
        try:
            self.backEnd.criar_tabela(nome_normalizado)
        except Exception as e:
            # Caso falhe neste passo, o usuário já está no banco.
            print(f"Erro ao criar recursos adicionais para {nome_normalizado}: {e}")
            # Dependendo do critério, poderíamos fazer rollback ou apenas notificar.
            return (1, "Perfil criado, mas houve problema na criação de recursos adicionais")
        
        return (1, "Perfil criado com sucesso!")

    def editar_usuario(self, key_edit, valor, nome):
        """
        Aqui é onde ocorre a efetivação de mudanças do usuário
        """
        sql_comand = f"UPDATE usuarios SET {key_edit} = %s WHERE nome = %s"
        valores = (valor, nome)
        cursor = self.conexao.cursor()
        try:
            cursor.execute(sql_comand, valores)
            self.conexao.commit()
        except Exception as e:
            print(f"Erro ao editar usuário {nome}: {e}")
        finally:
            cursor.close()

    def carregar_carrinho(self, nome):
        cursor = self.conexao.cursor()
        try:
            cursor.execute("SELECT carrinho FROM usuarios WHERE nome = %s", (nome,))
            row = cursor.fetchone()
            return json.loads(row[0]) if row and row[0] else []
        except Exception as e:
            print(f"Erro ao carregar carrinho de {nome}: {e}")
            return []
        finally:
            cursor.close()
    
    def modificar_quantidade_pizza(self, dados, nome):
        sql_comand = "UPDATE usuarios SET carrinho = %s WHERE nome = %s"
        valores = (json.dumps(dados), nome)
        cursor = self.conexao.cursor()
        try:
            cursor.execute(sql_comand, valores)
            self.conexao.commit()
        except Exception as e:
            print(f"Erro ao modificar carrinho de {nome}: {e}")
        finally:
            cursor.close()

    def editar_carrinho(self, nome, valor=None, _Exc=1):
        if _Exc:
            dic_get_sql = self.carregar_carrinho(nome)
            dic_get_sql.append(valor)
        else:
            dic_get_sql = []
        sql_comand = "UPDATE usuarios SET carrinho = %s WHERE nome = %s"
        valores = (json.dumps(dic_get_sql), nome)
        cursor = self.conexao.cursor()
        try:
            cursor.execute(sql_comand, valores)
            self.conexao.commit()
        except Exception as e:
            print(f"Erro ao editar carrinho de {nome}: {e}")
        finally:
            cursor.close()

    def ver_todos_usuarios(self):
        """
        Mostra informações de todos os usuários
        """
        cursor = self.conexao.cursor()
        try:
            cursor.execute("SELECT * FROM usuarios")
            return cursor.fetchall()
        except Exception as e:
            print(f"Erro ao buscar todos usuários: {e}")
            return []
        finally:
            cursor.close()
        
    def ver_unico_usuario(self, nome):
        """
        Verifica unicamente o usuário especificado. Retorna lista de tuplas.
        """
        cursor = self.conexao.cursor()
        try:
            cursor.execute("SELECT * FROM usuarios WHERE nome = %s", (nome,))
            return cursor.fetchall()
        except Exception as e:
            print(f"Erro ao verificar usuário {nome}: {e}")
            return []
        finally:
            cursor.close()
    
    def apagar_usuario(self, nome):
        """
        Deleta o usuário de tabelas relacionadas
        """
        for table in ["usuarios", "pedidos"]:
            sql_comand = f"DELETE FROM {table} WHERE nome = %s"
            cursor = self.conexao.cursor()
            try:
                cursor.execute(sql_comand, (nome,))
                self.conexao.commit()
                print(f"Tabela {table}: linhas afetadas {cursor.rowcount}")
            except Exception as e:
                print(f"Erro ao apagar usuário {nome} em {table}: {e}")
            finally:
                cursor.close()
        
    def encerrar(self):
        """
        Encerra o banco de dados
        """
        try:
            self.conexao.close()
        except Exception as e:
            print(f"Erro ao fechar conexão: {e}")
        self.backEnd.encerrar()

if __name__=="__main__":
    db = meu_db()
    # Exemplos de uso:
    # print(db.criar_usuario("usuario", "na", "75999747065", "123"))
    # db.editar_usuario("nome", "na", "naah")
    # print(db.ver_todos_usuarios())
    # db.editar_carrinho(nome="na", valor={"pizza": "Flango"}, _Exc=1)
    # print(db.ver_unico_usuario("na"))
    db.apagar_usuario("na")
    db.encerrar()
