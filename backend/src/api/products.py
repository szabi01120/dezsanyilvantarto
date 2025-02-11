from flask import Blueprint, request, jsonify
from src.extensions.database import db
from src.models.products import Products

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_all_products():
    products = Products.query.all()
    return jsonify([p.to_dict() for p in products]), 200

@products_bp.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    new_product = Products(
        name=data['name'],
        type=data['type'],
        quantity=data['quantity'],
        manufacturer=data['manufacturer'],
        purchase_price=data['purchase_price']
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Products.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Products.query.get_or_404(product_id)
    data = request.get_json()
    product.name = data.get('name', product.name)
    product.type = data.get('type', product.type)
    product.quantity = data.get('quantity', product.quantity)
    product.manufacturer = data.get('manufacturer', product.manufacturer)
    product.purchase_price = data.get('purchase_price', product.purchase_price)
    db.session.commit()
    return jsonify(product.to_dict()), 200

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Products.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return '', 204
