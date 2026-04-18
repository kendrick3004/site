import requests
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///loja_final.db'
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    description = db.Column(db.Text)
    price = db.Column(db.Float)
    old_price = db.Column(db.Float)
    image = db.Column(db.String(500))
    category = db.Column(db.String(100))

def sync_products():
    with app.app_context():
        db.create_all()
        if not Product.query.first():
            # Consumindo a API de produtos reais
            response = requests.get('https://fakestoreapi.com/products')
            data = response.json()
            
            products_list = []
            for item in data:
                # Lógica de promoção: 30% de chance de ter desconto
                price = float(item['price'])
                has_promo = (item['id'] % 3 == 0)
                old_price = round(price * 1.4, 2) if has_promo else None

                products_list.append(Product(
                    name=item['title'],
                    description=item['description'],
                    price=price,
                    old_price=old_price,
                    image=item['image'],
                    category=item['category']
                ))
            
            db.session.bulk_save_objects(products_list)
            db.session.commit()
            print(f"Sucesso: {len(products_list)} produtos importados!")

@app.route('/')
def index():
    cat = request.args.get('category')
    search = request.args.get('search')
    
    query = Product.query
    if cat: query = query.filter_by(category=cat)
    if search: query = query.filter(Product.name.contains(search))
    
    return render_template('index.html', products=query.all())

if __name__ == '__main__':
    sync_products()
    app.run(host="0.0.0.0", port=5000, debug=True)
