
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta
import usuario_db
import backend_sql
import hash_senhas
import json

app = Flask(__name__)
CORS(app)
usuarios=usuario_db.meu_db()
back_gerenc=backend_sql.backFunc()

app.config["JWT_SECRET_KEY"]="Casa01DaPizza@759965$07N"
app.config["JWT_ACCESS_TOKEN_EXPIRES"]=timedelta(hours=7)

jwt=JWTManager(app)

def criar_token(username):
    dados_usuario=usuarios.ver_unico_usuario(username)
    role=dados_usuario[0][1]
    token=create_access_token(
        identity=username,
        additional_claims={"role": role}
    )
    return token

def carregar_pizzas(url_path):
    with open(url_path,  "r", encoding="utf8") as arq:
        return json.load(arq)
dados_dic=carregar_pizzas("pizzas.json")
 
@app.route("/", methods=["GET", "PUT"])
@jwt_required()
def get_dados():

    #current_user=get_jwt_identity()
    claims=get_jwt()
    if claims['role'] !="usuario":
        return jsonify({"Mensagem": "Voce nao tem permissao para isto!"})

    #if request.method=="PUT":
        #date=request.get_json()

        #for key, value in date.items():
            #dados_dic[key]=value
    return dados_dic

@app.route("/carrinho", methods=["POST", "GET"])
@jwt_required()
def get_pizzas_carrinho():
    current_user = get_jwt_identity()
    claims=get_jwt()
    if claims['role'] =="usuario":
        if request.method=="POST":
            date=request.get_json()
            lista_atual=usuarios.carregar_carrinho(current_user)

            _dados=[x["Pizza"] for x in lista_atual if date["Pizza"] in x["Pizza"]]
            if _dados:

                lista_refatorada=[]
                for value in lista_atual:
                    if date["Pizza"]==value["Pizza"] and date['Outro sabor'] == value['Outro sabor'] and date['Tamanho']==value['Tamanho'] and date['Borda']==value['Borda']:
                        value["Quantidade"]+=1
                        lista_refatorada.append(value)
                        continue
                    else:
                        lista_refatorada.append(value)

                usuarios.modificar_quantidade_pizza(lista_refatorada, current_user)     
                return jsonify({"Erro":"Esta pizza ja existe"})
            
            usuarios.editar_carrinho(nome=current_user, valor=date, _Exc=1)
            return jsonify({"Sucesso": date})
        elif request.method=="GET":
            return jsonify({"Dados": usuarios.carregar_carrinho(current_user)})

@app.route("/prepararpedido", methods=["POST", "GET"])
@jwt_required()
def pedido_andamento():
    user=get_jwt_identity()
    dados=request.get_json()
    print(user, dados)
    back_gerenc.adicionar_pedido(dados, user)
    usuarios.editar_carrinho(user, _Exc=0)

    return jsonify({"Sucesso": "Seu pedido esta em andamento!"})

@app.route("/progrsso", methods=["POST", "GET"])
@jwt_required()
def acompanhar_progresso():
    pegar_nome=get_jwt_identity()
    validar_autorizacao=get_jwt()
    if validar_autorizacao["role"]=="chefe":
        return back_gerenc.ver_todos_pedidos()
    return jsonify({"Sucesso": back_gerenc.ver_pedidos(pegar_nome)}) 


@app.route("/cadastro", methods=["POST"])
def response_front():
    data = request.get_json()
    # Ajuste de keys conforme seu front envia; aqui exemplo usando "Nome" e "Senha"
    role = data.get("role")
    nome = data.get("Nome")
    telefone = data.get("Telefone")
    senha = data.get("Senha")

    if not all([role, nome, telefone, senha]):
        return jsonify({"sucesso": False, "mensagem": "Campos insuficientes"}), 400

    senha_hash = hash_senhas.pegar_senha_hash(senha)
    status, mensagem = usuarios.criar_usuario(role, nome, telefone, senha_hash)

    if status == 1:
        # Criado com sucesso
        resp = {"sucesso": True, "mensagem": mensagem}
        print(resp)
        return jsonify(resp), 201
    else:
        # Falha: verificar se é conflito de nome existente
        if "já existe" in mensagem.lower():
            resp = {"sucesso": False, "mensagem": mensagem}
            print(resp)
            return jsonify(resp), 409
        else:
            resp = {"sucesso": False, "mensagem": mensagem}
            print(resp)
            return jsonify(resp), 500

@app.route("/login", methods=["PUT"])
def login():
    dados = request.get_json()
    username=dados["Nome"].lower()
    senha=dados["Senha"]
    dados_usuario=usuarios.ver_unico_usuario(username)
    if dados_usuario:
        if hash_senhas.verificar_hash(senha, dados_usuario[0][4]):
            return jsonify({"Mensagem": criar_token(dados_usuario[0][2]), "Operacao":0})
    return jsonify({"Mensagem": "Usuario não encontrado!", "Operacao":1})

@app.route("/fotos/<nome_imagem>")
def foto(nome_imagem):
    return send_from_directory("fotos", nome_imagem)     

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000)
