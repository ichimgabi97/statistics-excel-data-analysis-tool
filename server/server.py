from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import re

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"]) 

UPLOAD_FOLDER = 'uploads'
REMINDERS_FOLDER = 'reminders'
CSV_FILE_PATH = os.path.join(UPLOAD_FOLDER, 'payments.csv')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REMINDERS_FOLDER, exist_ok=True)

@app.route('/')
def home():
    """
    Endpoint-ul principal care indică faptul că serverul rulează.
    """
    return "Serverul rulează cu succes! Încearcă /upload, /payment-stats și /send-reminders"

@app.route('/test')
def test():
    """
    Un endpoint simplu de test pentru a verifica conectivitatea.
    """
    return jsonify({"message": "Mesaj de funcționare de la endpoint-ul /test!"})

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Gestionează încărcarea fișierelor CSV.
    Salvează fișierul primit și confirmă încărcarea.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'Niciun fișier selectat'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Niciun fișier selectat'}), 400
    
    if file and file.filename.lower().endswith('.csv'):
        try:
            file.save(CSV_FILE_PATH)
            return jsonify({'message': 'Fișierul a fost încărcat cu succes!', 'filepath': CSV_FILE_PATH}), 200
        except Exception as e:
            return jsonify({'error': f'Eroare la salvarea fișierului: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Format de fișier nepermis. Vă rugăm să încărcați un fișier CSV.'}), 400

@app.route('/payment-stats', methods=['GET'])
def get_payment_stats():
    """
    Calculează și returnează statisticile de plată din fișierul CSV.
    """
    if not os.path.exists(CSV_FILE_PATH):
        return jsonify({
            'error': 'Fișierul CSV nu a fost găsit. Vă rugăm să încărcați unul.',
            'total_people': 0, 'paid_full': 0, 'paid_partial': 0, 'not_paid': 0
        }), 404

    try:
        df = pd.read_csv(CSV_FILE_PATH)

        required_columns = ['suma platita', 'suma de plata']
        if not all(col in df.columns for col in required_columns):
            missing_cols = [col for col in required_columns if col not in df.columns]
            return jsonify({
                'error': f'Fișierul CSV trebuie să conțină coloanele: {", ".join(required_columns)}. Lipsesc: {", ".join(missing_cols)}.',
                'total_people': 0, 'paid_full': 0, 'paid_partial': 0, 'not_paid': 0
            }), 400

        df['suma platita'] = pd.to_numeric(df['suma platita'], errors='coerce').fillna(0)
        df['suma de plata'] = pd.to_numeric(df['suma de plata'], errors='coerce').fillna(0)

        df = df[df['suma de plata'] > 0]
        
        total_people = len(df)
        
        paid_full = df[df['suma platita'] >= df['suma de plata']].shape[0]
        paid_partial = df[(df['suma platita'] > 0) & (df['suma platita'] < df['suma de plata'])].shape[0]
        not_paid = df[df['suma platita'] <= 0].shape[0]

        return jsonify({
            'total_people': total_people,
            'paid_full': paid_full,
            'paid_partial': paid_partial,
            'not_paid': not_paid
        }), 200
    except pd.errors.EmptyDataError:
        return jsonify({'error': 'Fișierul CSV este gol.', 'total_people': 0, 'paid_full': 0, 'paid_partial': 0, 'not_paid': 0}), 400
    except Exception as e:
        return jsonify({'error': f'Eroare la procesarea fișierului CSV: {str(e)}', 'total_people': 0, 'paid_full': 0, 'paid_partial': 0, 'not_paid': 0}), 500

@app.route('/send-reminders', methods=['POST'])
def send_reminders():
    """
    Simulează trimiterea de emailuri de reamintire pentru plățile restante.
    Generează fișiere text personalizate pentru fiecare reminder.
    """
    if not os.path.exists(CSV_FILE_PATH):
        return jsonify({'error': 'Fișierul CSV nu a fost găsit pentru a trimite remindere. Vă rugăm să încărcați unul.'}), 404

    try:
        df = pd.read_csv(CSV_FILE_PATH)

        required_cols_reminders = ['suma platita', 'suma de plata', 'nume', 'prenume', 'email'] 
        
        if not all(col in df.columns for col in required_cols_reminders):
            missing_cols = [col for col in required_cols_reminders if col not in df.columns]
            return jsonify({'error': f'Fișierul CSV trebuie să conțină coloanele: {", ".join(required_cols_reminders)} pentru a trimite remindere. Lipsesc: {", ".join(missing_cols)}.'}), 400

        df['suma platita'] = pd.to_numeric(df['suma platita'], errors='coerce').fillna(0)
        df['suma de plata'] = pd.to_numeric(df['suma de plata'], errors='coerce').fillna(0)

        reminders_generated_count = 0
        reminders_details = []

        for filename in os.listdir(REMINDERS_FOLDER):
            file_path = os.path.join(REMINDERS_FOLDER, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Eroare la ștergerea fișierului {file_path}: {e}")

        for index, row in df.iterrows():
            nume = str(row['nume']).strip() if pd.notna(row['nume']) else ''
            prenume = str(row['prenume']).strip() if pd.notna(row['prenume']) else ''
            full_name = f"{nume} {prenume}".strip() if nume or prenume else 'Utilizator necunoscut'
            
            email = str(row['email']).strip() if pd.notna(row['email']) else ''
            
            paid_amount = row['suma platita']
            total_amount = row['suma de plata']

            if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                reminders_details.append({'name': full_name, 'email': email, 'status': 'Adresă email invalidă/lipsă, reminder sărit.'})
                continue

            remaining_amount = total_amount - paid_amount
            message = ""

            if remaining_amount > 0.01:
                if paid_amount > 0:
                    message = (
                        f"Bună ziua, {full_name},\n\n"
                        f"Dorim să vă reamintim că mai aveți de achitat suma de {remaining_amount:.2f} RON din totalul de {total_amount:.2f} RON.\n"
                        "Vă rugăm să efectuați plata cât mai curând posibil pentru a evita penalizările.\n\n"
                        "Vă mulțumim pentru promptitudine!\n"
                        "Cu stimă,\n"
                        "Echipa de Administrare"
                    )
                else:
                    message = (
                        f"Stimate/Stimată {full_name},\n\n"
                        f"Dorim să vă informăm că nu am înregistrat nicio plată din partea dumneavoastră pentru suma de {total_amount:.2f} RON.\n"
                        "Vă rugăm să efectuați plata integrală sau o plată parțială cât mai curând posibil pentru a evita sistarea serviciilor.\n\n"
                        "Vă mulțumim pentru înțelegere!\n"
                        "Cu respect,\n"
                        "Echipa de Administrare"
                    )
            
            if message:
                file_name_safe = re.sub(r'[^a-zA-Z0-9_]', '', full_name.replace(" ", "_"))
                file_name_safe = file_name_safe[:50] 
                timestamp = pd.Timestamp.now().strftime("%Y%m%d%H%M%S")
                
                email_safe = email.split('@')[0]
                reminder_filepath = os.path.join(REMINDERS_FOLDER, f"reminder_{file_name_safe}_{email_safe}_{timestamp}.txt")

                with open(reminder_filepath, 'w', encoding='utf-8') as f:
                    f.write(f"Către: {email}\n")
                    f.write(f"Subiect: Reamintire plată\n\n")
                    f.write(message)
                
                reminders_generated_count += 1
                reminders_details.append({'name': full_name, 'email': email, 'status': 'Generat'})
            else:
                reminders_details.append({'name': full_name, 'email': email, 'status': 'Plată integrală sau suma de plată prea mică (nu necesită reamintire)'})

        return jsonify({'message': f'{reminders_generated_count} remindere generate (simulare de emailuri). Verificați folderul "{REMINDERS_FOLDER}".', 'details': reminders_details}), 200

    except pd.errors.EmptyDataError:
        return jsonify({'error': 'Fișierul CSV este gol, nu se pot genera remindere.'}), 400
    except Exception as e:
        return jsonify({'error': f'Eroare la generarea reminderelor: {str(e)}'}), 500

if __name__ == '__main__':

    app.run(debug=True, port=5000)
