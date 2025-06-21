from flask import Blueprint, request, jsonify
from src.extensions.database import db
from src.models.inventory import Inventory, InventoryMovement

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/get_inventory', methods=['GET'])
def get_all_inventory():
    try:
        inventory_items = Inventory.query.all()
        return jsonify([item.to_dict() for item in inventory_items]), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba a készlet lekérdezésekor.',
            'error': str(e)
        }), 400

@inventory_bp.route('/<int:inventory_id>/movements', methods=['GET'])
def get_inventory_movements(inventory_id):
    try:
        movements = InventoryMovement.query.filter_by(
            inventory_id=inventory_id
        ).order_by(InventoryMovement.created_at.desc()).all()
        
        return jsonify([movement.to_dict() for movement in movements]), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba a készletmozgások lekérdezésekor.',
            'error': str(e)
        }), 400

@inventory_bp.route('/low_stock', methods=['GET'])
def get_low_stock_items():
    try:
        threshold = request.args.get('threshold', 5, type=int)
        low_stock_items = Inventory.query.filter(
            Inventory.available_quantity <= threshold
        ).all()
        
        return jsonify([item.to_dict() for item in low_stock_items]), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba az alacsony készletű termékek lekérdezésekor.',
            'error': str(e)
        }), 400

@inventory_bp.route('/<int:inventory_id>', methods=['DELETE'])
def delete_inventory_item(inventory_id):    
    """ Inventory item törlés """
    try:
        # Inventory tétel keresése
        inventory_item = Inventory.query.get(inventory_id)
        if not inventory_item:
            return jsonify({
                'message': 'A termék nem található.'
            }), 404
        
        # Termék mentése
        product_name = inventory_item.product_name
        
        # Összes inventory movement törlés
        movements = InventoryMovement.query.filter_by(inventory_id=inventory_id).all()
        movements_count = len(movements)
        
        for movement in movements:
            print(f"Deleting movement: {movement}")
            db.session.delete(movement)
        
        # Inventory tétel törlése
        db.session.delete(inventory_item)
        db.session.commit()
        
        response_data = {
            'message': f'Termék sikeresen törölve: {product_name}',
            'deleted_movements': movements_count
        }
        print(f"Response data: {response_data}")
        return jsonify(response_data), 200
        
    except Exception as e:        
        db.session.rollback()
        return jsonify({
            'message': 'Hiba a termék törlésekor.',
            'error': str(e),
            'error_type': str(type(e))
        }), 400