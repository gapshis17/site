from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import os

class CryptoManager:
    def __init__(self):
        self.public_key = None
        self.load_public_key()

    def load_public_key(self):
       
        if os.path.exists('rsa_public.pem'):
            with open('rsa_public.pem', 'rb') as f:
                self.public_key = serialization.load_pem_public_key(
                    f.read(),
                    backend=default_backend()
                )
    
    def encrypt_data(self, data):
        
        if not self.public_key:
            raise ValueError("Public key not loaded")
        
        
        aes_key = os.urandom(32)
        nonce = os.urandom(16)
        
       
        cipher = Cipher(algorithms.AES(aes_key), modes.GCM(nonce), backend=default_backend())
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(data) + encryptor.finalize()
        tag = encryptor.tag
        
        
        encrypted_key = self.public_key.encrypt(
            aes_key,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        return {
            'ciphertext': ciphertext,
            'encrypted_key': encrypted_key,
            'nonce': nonce,
            'tag': tag
        }