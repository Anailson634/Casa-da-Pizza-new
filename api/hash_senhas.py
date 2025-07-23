from pwdlib import PasswordHash

pwd=PasswordHash.recommended()

def pegar_senha_hash(senha):
    return pwd.hash(senha)

def verificar_hash(senha_limpa, hash_senha):
    return pwd.verify(senha_limpa, hash_senha)

if __name__=="__main__":
    senha_hash=pegar_senha_hash("Naah")
    print(senha_hash)
    print(verificar_hash("Naah", senha_hash))
