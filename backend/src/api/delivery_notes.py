from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from src.extensions.database import db
from src.models.delivery_note import DeliveryNote, DeliveryNoteItem
from src.models.inventory import Inventory, InventoryMovement

delivery_notes_bp = Blueprint('delivery_notes', __name__)

def generate_delivery_number():
    """Szállítólevél sorszám generálása"""
    today = datetime.now()
    date_str = today.strftime('%Y%m%d')
    
    # Mai napon hány szállítólevél volt már
    count = DeliveryNote.query.filter(
        DeliveryNote.delivery_date == today.date()
    ).count()
    
    return f"SZ-{date_str}-{count + 1:03d}"

def update_inventory_average_price(inventory_item, new_quantity, new_unit_price, currency):
    """Súlyozott átlagár számítása"""
    if inventory_item.current_quantity == 0:
        # Ha nincs készleten, az új ár lesz az átlag
        inventory_item.average_purchase_price = new_unit_price
        inventory_item.currency = currency
    else:
        # Ha más pénznemben van, egyelőre nem keverjük (egyszerű megoldás)
        if inventory_item.currency == currency:
            # Súlyozott átlag számítás
            total_current_value = inventory_item.current_quantity * inventory_item.average_purchase_price
            total_new_value = new_quantity * new_unit_price
            total_quantity = inventory_item.current_quantity + new_quantity
            
            inventory_item.average_purchase_price = (total_current_value + total_new_value) / total_quantity
        # Ha más a pénznem, megtartjuk a régit (későbbi fejlesztés: átváltás)

@delivery_notes_bp.route('/get_delivery_notes', methods=['GET'])
def get_all_delivery_notes():
    try:
        delivery_notes = DeliveryNote.query.order_by(DeliveryNote.delivery_date.desc()).all()
        return jsonify([dn.to_dict() for dn in delivery_notes]), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba a szállítólevelek lekérdezésekor.',
            'error': str(e)
        }), 400

@delivery_notes_bp.route('/create_delivery_note', methods=['POST'])
def create_delivery_note():
    try:
        delivery_number = generate_delivery_number()
        
        new_delivery_note = DeliveryNote(
            delivery_number=delivery_number,
            delivery_date=datetime.now().date()
        )
        
        db.session.add(new_delivery_note)
        db.session.commit()
        
        return jsonify({
            'message': 'Szállítólevél sikeresen létrehozva.',
            'delivery_note': new_delivery_note.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Hiba a szállítólevél létrehozásakor.',
            'error': str(e)
        }), 400

@delivery_notes_bp.route('/<int:delivery_note_id>', methods=['GET'])
def get_delivery_note(delivery_note_id):
    try:
        delivery_note = DeliveryNote.query.get_or_404(delivery_note_id)
        return jsonify(delivery_note.to_dict()), 200
    except Exception as e:
        return jsonify({
            'message': 'Hiba a szállítólevél lekérdezésekor.',
            'error': str(e)
        }), 400

@delivery_notes_bp.route('/<int:delivery_note_id>/add_item', methods=['POST'])
def add_item_to_delivery_note(delivery_note_id):
    delivery_note = DeliveryNote.query.get_or_404(delivery_note_id)
    data = request.get_json()
    
    try:
        total_price = data['quantity'] * data['unit_price']
        
        new_item = DeliveryNoteItem(
            delivery_note_id=delivery_note_id,
            product_name=data['product_name'],
            product_type=data['product_type'],
            manufacturer=data['manufacturer'],
            unit_of_measure=data.get('unit_of_measure', 'db'),
            quantity=data['quantity'],
            unit_price=data['unit_price'],
            total_price=total_price,
            currency=data.get('currency', 'HUF')
        )
        
        db.session.add(new_item)
        
        # Készlet frissítése vagy létrehozása
        inventory_item = Inventory.query.filter_by(
            product_name=data['product_name'],
            product_type=data['product_type'],
            manufacturer=data['manufacturer']
        ).first()
        
        if inventory_item:
            # Átlagár frissítése
            update_inventory_average_price(
                inventory_item, 
                data['quantity'], 
                data['unit_price'], 
                data.get('currency', 'HUF')
            )
            inventory_item.current_quantity += data['quantity']
            inventory_item.available_quantity += data['quantity']
            inventory_item.last_updated = datetime.utcnow()
            inventory_item.calculate_total_value()
        else:
            inventory_item = Inventory(
                product_name=data['product_name'],
                product_type=data['product_type'],
                manufacturer=data['manufacturer'],
                unit_of_measure=data.get('unit_of_measure', 'db'),
                current_quantity=data['quantity'],
                available_quantity=data['quantity'],
                average_purchase_price=data['unit_price'],
                currency=data.get('currency', 'HUF')
            )
            inventory_item.calculate_total_value()
            db.session.add(inventory_item)
            db.session.flush()  # ID-t kapjunk
        
        # Mozgás rögzítése
        movement = InventoryMovement(
            inventory_id=inventory_item.id,
            movement_type='IN',
            quantity=data['quantity'],
            unit_price=data['unit_price'],
            currency=data.get('currency', 'HUF'),
            reference_type='DELIVERY_NOTE',
            reference_id=delivery_note_id,
            notes=f"Szállítólevél: {delivery_note.delivery_number}"
        )
        db.session.add(movement)
        
        # Szállítólevél összérték frissítése
        delivery_note.total_value += total_price
        delivery_note.currency = data.get('currency', 'HUF')  # Utolsó tétel pénzneme
        
        db.session.commit()
        
        return jsonify({
            'message': 'Tétel sikeresen hozzáadva.',
            'item': new_item.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Hiba a tétel hozzáadásakor.',
            'error': str(e)
        }), 400

@delivery_notes_bp.route('/<int:delivery_note_id>/items/<int:item_id>', methods=['PUT'])
def update_delivery_note_item(delivery_note_id, item_id):
    """Szállítólevél tétel módosítása"""
    delivery_note = DeliveryNote.query.get_or_404(delivery_note_id)
    item = DeliveryNoteItem.query.filter_by(
        id=item_id, 
        delivery_note_id=delivery_note_id
    ).first_or_404()
    
    data = request.get_json()

    try:
        if not data:
            return jsonify({
                'message': 'Nincs megadva adat a tétel módosításához.'
            }), 400
        
        old_quantity = item.quantity
        old_unit_price = item.unit_price
        old_total_price = item.total_price
        
        # Új adatok
        new_quantity = data.get('quantity', item.quantity)
        new_unit_price = data.get('unit_price', item.unit_price)
        new_total_price = new_quantity * new_unit_price
        
        # Tétel frissítése 
        item.product_name = data.get('product_name', item.product_name)
        item.product_type = data.get('product_type', item.product_type)
        item.manufacturer = data.get('manufacturer', item.manufacturer)
        item.unit_of_measure = data.get('unit_of_measure', item.unit_of_measure)
        item.quantity = new_quantity
        item.unit_price = new_unit_price
        item.total_price = new_total_price
        item.currency = data.get('currency', item.currency)
        
        # Készlet korrekció
        inventory_item = Inventory.query.filter_by(
            product_name=item.product_name,
            product_type=item.product_type,
            manufacturer=item.manufacturer
        ).first()
        
        if inventory_item:
            print("Creating movement record...")
            movement = InventoryMovement(
                inventory_id=inventory_item.id,  # Most már biztos nem None
                movement_type='ADJUSTMENT',
                quantity=new_quantity - old_quantity,
                unit_price=new_unit_price,
                currency=item.currency,
                reference_type='DELIVERY_NOTE_UPDATE',
                reference_id=delivery_note_id,
                notes=f"Szállítólevél tétel módosítás: {delivery_note.delivery_number}"
            )
            db.session.add(movement)
            print("Movement added to session")
        else:
            print("No inventory item found, skipping movement creation")
        
        # Szállítólevél összérték korrekció
        delivery_note.total_value = delivery_note.total_value - old_total_price + new_total_price        
        db.session.commit()
        
        return jsonify({
            'message': 'Tétel sikeresen módosítva.',
            'item': item.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Hiba a tétel módosításakor.',
            'error': str(e)
        }), 400

@delivery_notes_bp.route('/<int:delivery_note_id>/items/<int:item_id>', methods=['DELETE'])
def delete_delivery_note_item(delivery_note_id, item_id):
    """Szállítólevél tétel törlése"""
    delivery_note = DeliveryNote.query.get_or_404(delivery_note_id)
    item = DeliveryNoteItem.query.filter_by(
        id=item_id, 
        delivery_note_id=delivery_note_id
    ).first_or_404()
    
    try:
        # Készlet korrekció
        inventory_item = Inventory.query.filter_by(
            product_name=item.product_name,
            product_type=item.product_type,
            manufacturer=item.manufacturer
        ).first()
        
        if inventory_item:
            inventory_item.current_quantity -= item.quantity
            inventory_item.available_quantity -= item.quantity
            inventory_item.last_updated = datetime.utcnow()
            inventory_item.calculate_total_value()
            
            # Ha 0 alatt menne, 0-ra állítjuk
            if inventory_item.current_quantity < 0:
                inventory_item.current_quantity = 0
            if inventory_item.available_quantity < 0:
                inventory_item.available_quantity = 0
        
        # Szállítólevél összérték korrekció
        delivery_note.total_value -= item.total_price
        
        # Mozgás rögzítése
        if inventory_item:
            movement = InventoryMovement(
                inventory_id=inventory_item.id,
                movement_type='OUT',
                quantity=item.quantity,
                unit_price=item.unit_price,
                currency=item.currency,
                reference_type='DELIVERY_NOTE_DELETE',
                reference_id=delivery_note_id,
                notes=f"Szállítólevél tétel törlés: {delivery_note.delivery_number}"
            )
            db.session.add(movement)
        
        # Tétel törlése
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({
            'message': 'Tétel sikeresen törölve.'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Hiba a tétel törlésekor.',
            'error': str(e)
        }), 400

@delivery_notes_bp.route('/<int:delivery_note_id>', methods=['PUT'])
def update_delivery_note(delivery_note_id):
    delivery_note = DeliveryNote.query.get_or_404(delivery_note_id)
    data = request.get_json()
    
    try:
        delivery_note.supplier_name = data.get('supplier_name', delivery_note.supplier_name)
        delivery_note.notes = data.get('notes', delivery_note.notes)
        
        db.session.commit()
        return jsonify(delivery_note.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Hiba a szállítólevél frissítésekor.',
            'error': str(e)
        }), 400

@delivery_notes_bp.route('/<int:delivery_note_id>', methods=['DELETE'])
def delete_delivery_note(delivery_note_id):
    """Szállítólevél törlése (minden tételével együtt)"""
    delivery_note = DeliveryNote.query.get_or_404(delivery_note_id)
    
    try:
        # Tételek mentése (mielőtt törlődnének)
        items_to_process = []
        for item in delivery_note.items:
            items_to_process.append({
                'product_name': item.product_name,
                'product_type': item.product_type,
                'manufacturer': item.manufacturer,
                'quantity': item.quantity,
                'unit_price': item.unit_price,
                'currency': item.currency
            })
        
        # Készlet korrekciók
        for item_data in items_to_process:
            inventory_item = Inventory.query.filter_by(
                product_name=item_data['product_name'],
                product_type=item_data['product_type'],
                manufacturer=item_data['manufacturer']
            ).first()
            
            if inventory_item:
                inventory_item.current_quantity -= item_data['quantity']
                inventory_item.available_quantity -= item_data['quantity']
                inventory_item.last_updated = datetime.utcnow()
                inventory_item.calculate_total_value()
                
                # Ha 0 alatt menne, 0-ra állítjuk
                if inventory_item.current_quantity < 0:
                    inventory_item.current_quantity = 0
                if inventory_item.available_quantity < 0:
                    inventory_item.available_quantity = 0
                
                # Mozgás rögzítése
                movement = InventoryMovement(
                    inventory_id=inventory_item.id,
                    movement_type='OUT',
                    quantity=item_data['quantity'],
                    unit_price=item_data['unit_price'],
                    currency=item_data['currency'],
                    reference_type='DELIVERY_NOTE_DELETE',
                    reference_id=delivery_note_id,
                    notes=f"Szállítólevél törlés: {delivery_note.delivery_number}"
                )
                db.session.add(movement)
        
        # Szállítólevél törlése
        db.session.delete(delivery_note)
        db.session.commit()
        
        return jsonify({
            'message': 'Szállítólevél sikeresen törölve.'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Hiba a szállítólevél törlésekor.',
            'error': str(e)
        }), 400