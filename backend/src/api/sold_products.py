from flask import Blueprint, request, jsonify
from datetime import datetime
from src.extensions.database import db
from src.models.sold_products import SoldProducts

sold_products_bp = Blueprint('sold_products', __name__)

@sold_products_bp.route('/get_products', methods=['GET'])
def get_all_products():
    try:
        products = SoldProducts.query.all()
        return jsonify([p.to_dict() for p in products]), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba a termékek lekérdezésekor.',
            'error': str(e)
        }), 400

@sold_products_bp.route('/add_product', methods=['POST'])
def create_product():
    data = request.get_json()
    try:
        new_product = SoldProducts(
            name=data['name'],
            type=data['type'],
            quantity=data['quantity'],
            manufacturer=data['manufacturer'],
            purchase_price=data['purchase_price']
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({
            'message': 'Termék sikeresen hozzáadva.',
            'product': new_product.to_dict()
        }), 201
    except Exception as e:
        return jsonify({
            'message': 'Hiba a termék hozzáadásakor.',
            'error': str(e)
        }), 400
    

@sold_products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = SoldProducts.query.get_or_404(product_id)
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba a termék lekérdezésekor.',
            'error': str(e)
        }), 400

@sold_products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = SoldProducts.query.get_or_404(product_id)
    data = request.get_json()
    try:
        if 'purchase_date' in data:
            try:
                purchase_date = datetime.strptime(data['purchase_date'], '%Y-%m-%d').date()
                product.purchase_date = purchase_date
            except ValueError:
                return jsonify({
                    'message': 'Helytelen dátum formátum. Használja az éééé-hh-nn formátumot.'
                }), 400

        product.name = data.get('name', product.name)
        product.type = data.get('type', product.type)
        product.quantity = data.get('quantity', product.quantity)
        product.manufacturer = data.get('manufacturer', product.manufacturer)
        product.purchase_price = data.get('purchase_price', product.purchase_price)
        
        db.session.commit() 
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba a termék frissítésekor.',
            'error': str(e)
        }), 400

@sold_products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = SoldProducts.query.get_or_404(product_id)
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({
            'message': 'Termék sikeresen törölve.'
        }), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba a termék törlésekor.',
            'error': str(e)
        }), 400