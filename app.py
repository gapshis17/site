from flask import Flask, send_from_directory, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from datetime import datetime
from crypto_utils import CryptoManager
import key_generator

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

db = SQLAlchemy(app)
migrate = Migrate(app, db)


if not os.path.exists('rsa_public.pem'):
    print("Generating RSA keys...")
    key_generator.generate_rsa_keys()
    print("RSA keys generated successfully!")


crypto_manager = CryptoManager()


class EncryptionKey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('career_application.id'), nullable=False)
    encrypted_aes_key = db.Column(db.LargeBinary, nullable=False)
    nonce = db.Column(db.LargeBinary, nullable=False)
    tag = db.Column(db.LargeBinary, nullable=False)

class CareerApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    position = db.Column(db.String(50), nullable=False)
    cv_mimetype = db.Column(db.String(50), nullable=False)
    id_mimetype = db.Column(db.String(50), nullable=False)
    cv_data = db.Column(db.LargeBinary, nullable=False)
    id_data = db.Column(db.LargeBinary, nullable=False)
    cover_letter = db.Column(db.Text)
    submission_date = db.Column(db.DateTime, default=datetime.utcnow)
    encryption_keys = db.relationship('EncryptionKey', backref='application', lazy=True)


@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/submit_application', methods=['POST'])
def submit_application():
    try:
        data = request.form
        files = request.files
        
        
        required_fields = ['full_name', 'email', 'phone', 'country', 'city', 'position']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        
        if 'cv-input' not in files or files['cv-input'].filename == '':
            return jsonify({'error': 'Missing CV file'}), 400
        if 'id-input' not in files or files['id-input'].filename == '':
            return jsonify({'error': 'Missing ID file'}), 400
        
        
        cv_file = files['cv-input']
        id_file = files['id-input']
        
        encrypted_cv = crypto_manager.encrypt_data(cv_file.read())
        encrypted_id = crypto_manager.encrypt_data(id_file.read())
        encrypted_full_name = crypto_manager.encrypt_data(data.get('full_name').encode('utf-8'))
        encrypted_email=crypto_manager.encrypt_data(data.get('email').encode('utf-8'))
        encrypted_phone= crypto_manager.encrypt_data(data.get('phone').encode('utf-8'))
        encrypted_country = crypto_manager.encrypt_data(data.get('country').encode('utf-8'))
        encrypted_city = crypto_manager.encrypt_data(data.get('city').encode('utf-8'))
        encrypted_position= crypto_manager.encrypt_data(data.get('position').encode('utf-8'))
        encrypted_mimetype_cv = crypto_manager.encrypt_data(cv_file.mimetype.encode('utf-8'))
        encrypted_mimetype_id = crypto_manager.encrypt_data(id_file.mimetype.encode('utf-8'))
        encrypted_cover_letter = crypto_manager.encrypt_data(data.get('cover_letter', '').encode('utf-8'))
        
        application = CareerApplication(
            full_name=encrypted_full_name['ciphertext'],
            email=encrypted_email['ciphertext'],
            phone=encrypted_phone['ciphertext'],
            country=encrypted_country['ciphertext'],
            city=encrypted_city['ciphertext'],
            position= encrypted_position['ciphertext'],
            cv_mimetype=encrypted_mimetype_cv['ciphertext'],
            id_mimetype=encrypted_mimetype_id['ciphertext'],
            cv_data=encrypted_cv['ciphertext'],
            id_data=encrypted_id['ciphertext'],
            cover_letter=encrypted_cover_letter['ciphertext'],
        )
        
        db.session.add(application)
        db.session.flush()  
        
               
        keys = [
        
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_full_name['encrypted_key'], nonce=encrypted_full_name['nonce'], tag=encrypted_full_name['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_email['encrypted_key'], nonce=encrypted_email['nonce'], tag=encrypted_email['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_phone['encrypted_key'], nonce=encrypted_phone['nonce'], tag=encrypted_phone['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_country['encrypted_key'], nonce=encrypted_country['nonce'], tag=encrypted_country['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_city['encrypted_key'], nonce=encrypted_city['nonce'], tag=encrypted_city['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_position['encrypted_key'], nonce=encrypted_position['nonce'], tag=encrypted_position['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_cover_letter['encrypted_key'], nonce=encrypted_cover_letter['nonce'], tag=encrypted_cover_letter['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_mimetype_cv['encrypted_key'], nonce=encrypted_mimetype_cv['nonce'], tag=encrypted_mimetype_cv['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_mimetype_id['encrypted_key'], nonce=encrypted_mimetype_id['nonce'], tag=encrypted_mimetype_id['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_cv['encrypted_key'], nonce=encrypted_cv['nonce'], tag=encrypted_cv['tag']),
            EncryptionKey(application_id=application.id, encrypted_aes_key=encrypted_id['encrypted_key'], nonce=encrypted_id['nonce'], tag=encrypted_id['tag'])
        ]
        
        db.session.add_all(keys)
        db.session.commit()
        
        return jsonify({'success': 'Application submitted successfully!'}), 200

    except Exception as e:
        app.logger.error(f"Error submitting application: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/<filename>')
def serve_root_files(filename):
    if filename.endswith(('.css', '.js', '.png', '.jpg', '.html')) and os.path.exists(filename):
        return send_from_directory('.', filename)
    return "Not found", 404

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)