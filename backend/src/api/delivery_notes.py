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
    """Tétel hozzáadása szállítólevélhez - INTELLIGENS MERGE LOGIKÁVAL"""
    delivery_note = DeliveryNote.query.get_or_404(delivery_note_id)
    data = request.get_json()
    
    try:
        total_price = data['quantity'] * data['unit_price']
        
        # DELIVERY NOT E ITEM LÉTREHOZÁSA
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
        
        # INTELLIGENT INVENTORY MANAGEMENT
        item_data = {
            'product_name': data['product_name'],
            'product_type': data['product_type'],
            'manufacturer': data['manufacturer'],
            'unit_of_measure': data.get('unit_of_measure', 'db'),
            'quantity': data['quantity'],
            'unit_price': data['unit_price'],
            'currency': data.get('currency', 'HUF')
        }
        
        inventory_item = smart_add_item_logic(item_data, delivery_note_id)
        
        # INVENTORY MOVEMENT RÖGZÍTÉSE
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
        
        # SZÁLLÍTÓLEVÉL ÖSSZÉRTÉK FRISSÍTÉSE
        delivery_note.total_value += total_price
        delivery_note.currency = data.get('currency', 'HUF')
        
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
    """Szállítólevél tétel módosítása - INTELLIGENS INVENTORY SYNC"""
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
        
        # RÉGI ADATOK MENTÉSE
        old_item_data = {
            'product_name': item.product_name,
            'product_type': item.product_type,
            'manufacturer': item.manufacturer,
            'unit_of_measure': item.unit_of_measure,
            'quantity': item.quantity,
            'unit_price': item.unit_price,
            'currency': item.currency,
            'total_price': item.total_price
        }
        
        # ÚJ ADATOK
        new_item_data = {
            'product_name': data.get('product_name', item.product_name),
            'product_type': data.get('product_type', item.product_type),
            'manufacturer': data.get('manufacturer', item.manufacturer),
            'unit_of_measure': data.get('unit_of_measure', item.unit_of_measure),
            'quantity': data.get('quantity', item.quantity),
            'unit_price': data.get('unit_price', item.unit_price),
            'currency': data.get('currency', item.currency)
        }
        new_item_data['total_price'] = new_item_data['quantity'] * new_item_data['unit_price']
        
        # INTELLIGENT INVENTORY FRISSÍTÉS
        quantity_change = new_item_data['quantity'] - old_item_data['quantity']
        smart_inventory_update(old_item_data, new_item_data, quantity_change, delivery_note_id)
        
        # DELIVERY NOTE ITEM FRISSÍTÉSE
        item.product_name = new_item_data['product_name']
        item.product_type = new_item_data['product_type']
        item.manufacturer = new_item_data['manufacturer']
        item.unit_of_measure = new_item_data['unit_of_measure']
        item.quantity = new_item_data['quantity']
        item.unit_price = new_item_data['unit_price']
        item.total_price = new_item_data['total_price']
        item.currency = new_item_data['currency']
        
        # SZÁLLÍTÓLEVÉL ÖSSZÉRTÉK KORREKCIÓ
        delivery_note.total_value = delivery_note.total_value - old_item_data['total_price'] + new_item_data['total_price']
        
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
    
# INTELLIGENT INVENTORY MANAGEMENT SZOLGÁLTATÁSOK

def get_product_identity_key(product_name, product_type, manufacturer, unit_of_measure, currency):
    """Termék azonosító kulcs generálása"""
    return f"{product_name}|{product_type}|{manufacturer}|{unit_of_measure}|{currency}"

def find_matching_inventory_item(product_name, product_type, manufacturer, unit_of_measure, currency):
    """Azonos termék keresése inventory-ban"""
    return Inventory.query.filter_by(
        product_name=product_name,
        product_type=product_type,
        manufacturer=manufacturer,
        unit_of_measure=unit_of_measure,
        currency=currency
    ).first()

def smart_inventory_update(old_item_data, new_item_data, quantity_change, delivery_note_id):
    """Intelligens inventory frissítés merge/split logikával"""
    
    # Régi termék azonosító
    old_key = get_product_identity_key(
        old_item_data['product_name'],
        old_item_data['product_type'], 
        old_item_data['manufacturer'],
        old_item_data['unit_of_measure'],
        old_item_data['currency']
    )
    
    # Új termék azonosító
    new_key = get_product_identity_key(
        new_item_data['product_name'],
        new_item_data['product_type'],
        new_item_data['manufacturer'], 
        new_item_data['unit_of_measure'],
        new_item_data['currency']
    )

    if old_key == new_key:
        # ✅ UGYANAZ A TERMÉK → CSAK MENNYISÉG FRISSÍTÉS        
        inventory_item = find_matching_inventory_item(
            new_item_data['product_name'],
            new_item_data['product_type'],
            new_item_data['manufacturer'],
            new_item_data['unit_of_measure'],
            new_item_data['currency']
        )
        
        if inventory_item:
            # Mennyiség korrekció
            inventory_item.current_quantity += quantity_change
            inventory_item.available_quantity += quantity_change
            inventory_item.last_updated = datetime.utcnow()
            
            # Átlagár újraszámítás ha ár változott
            if new_item_data['unit_price'] != old_item_data['unit_price']:
                print("Komplex átlagár számítás implementálása todo.")
                # TODO: Komplex átlagár számítás implementálása
            
            inventory_item.calculate_total_value()
            
            # Movement rögzítése
            if quantity_change != 0:
                movement = InventoryMovement(
                    inventory_id=inventory_item.id,
                    movement_type='ADJUSTMENT',
                    quantity=quantity_change,
                    unit_price=new_item_data['unit_price'],
                    currency=new_item_data['currency'],
                    reference_type='DELIVERY_NOTE_UPDATE',
                    reference_id=delivery_note_id,
                    notes=f"Szállítólevél tétel módosítás - mennyiség változás: {quantity_change}"
                )
                db.session.add(movement)
        
    else:
        # SPLIT LOGIKA
        
        # 1. RÉGI TERMÉKBŐL KIVONJUK
        old_inventory = find_matching_inventory_item(
            old_item_data['product_name'],
            old_item_data['product_type'],
            old_item_data['manufacturer'],
            old_item_data['unit_of_measure'],
            old_item_data['currency']
        )
        
        if old_inventory:
            old_inventory.current_quantity -= old_item_data['quantity']
            old_inventory.available_quantity -= old_item_data['quantity']
            old_inventory.last_updated = datetime.utcnow()
            old_inventory.calculate_total_value()
            
            # OUT movement a régi termékhez
            movement_out = InventoryMovement(
                inventory_id=old_inventory.id,
                movement_type='OUT',
                quantity=old_item_data['quantity'],
                unit_price=old_item_data['unit_price'],
                currency=old_item_data['currency'],
                reference_type='DELIVERY_NOTE_UPDATE',
                reference_id=delivery_note_id,
                notes=f"Tétel módosítás - régi termék eltávolítása"
            )
            db.session.add(movement_out)
        
        # 2. ÚJ TERMÉKHEZ HOZZÁADJUK VAGY LÉTREHOZZUK
        new_inventory = find_matching_inventory_item(
            new_item_data['product_name'],
            new_item_data['product_type'],
            new_item_data['manufacturer'],
            new_item_data['unit_of_measure'],
            new_item_data['currency']
        )
        
        if new_inventory:
            # Meglévő termékhez hozzáadás
            update_inventory_average_price(
                new_inventory,
                new_item_data['quantity'],
                new_item_data['unit_price'],
                new_item_data['currency']
            )
            new_inventory.current_quantity += new_item_data['quantity']
            new_inventory.available_quantity += new_item_data['quantity']
            new_inventory.last_updated = datetime.utcnow()
            new_inventory.calculate_total_value()
            
        else:
            # Új inventory item létrehozás
            new_inventory = Inventory(
                product_name=new_item_data['product_name'],
                product_type=new_item_data['product_type'],
                manufacturer=new_item_data['manufacturer'],
                unit_of_measure=new_item_data['unit_of_measure'],
                current_quantity=new_item_data['quantity'],
                available_quantity=new_item_data['quantity'],
                average_purchase_price=new_item_data['unit_price'],
                currency=new_item_data['currency']
            )
            new_inventory.calculate_total_value()
            db.session.add(new_inventory)
            db.session.flush()  # ID generáláshoz
        
        # IN movement az új termékhez
        movement_in = InventoryMovement(
            inventory_id=new_inventory.id,
            movement_type='IN',
            quantity=new_item_data['quantity'],
            unit_price=new_item_data['unit_price'],
            currency=new_item_data['currency'],
            reference_type='DELIVERY_NOTE_UPDATE',
            reference_id=delivery_note_id,
            notes=f"Tétel módosítás - új termék hozzáadása"
        )
        db.session.add(movement_in)

def smart_add_item_logic(item_data, delivery_note_id):
    """Intelligens termék hozzáadás merge logikával"""
    
    # Keresés meglévő inventory-ban
    existing_inventory = find_matching_inventory_item(
        item_data['product_name'],
        item_data['product_type'],
        item_data['manufacturer'],
        item_data['unit_of_measure'],
        item_data['currency']
    )
    
    if existing_inventory:
        # Merge
        update_inventory_average_price(
            existing_inventory,
            item_data['quantity'],
            item_data['unit_price'],
            item_data['currency']
        )
        existing_inventory.current_quantity += item_data['quantity']
        existing_inventory.available_quantity += item_data['quantity']
        existing_inventory.last_updated = datetime.utcnow()
        existing_inventory.calculate_total_value()
        
        return existing_inventory
    else:
        # Új termék létrehozás
        new_inventory = Inventory(
            product_name=item_data['product_name'],
            product_type=item_data['product_type'],
            manufacturer=item_data['manufacturer'],
            unit_of_measure=item_data['unit_of_measure'],
            current_quantity=item_data['quantity'],
            available_quantity=item_data['quantity'],
            average_purchase_price=item_data['unit_price'],
            currency=item_data['currency']
        )
        new_inventory.calculate_total_value()
        db.session.add(new_inventory)
        db.session.flush()
        
        return new_inventory
    
# AUTOCOMPLETE API
@delivery_notes_bp.route('/autocomplete/products', methods=['GET'])
def autocomplete_products():
    """Termék autocomplete API"""
    query = request.args.get('q', '').strip()
    
    if len(query) < 2:
        return jsonify([]), 200
    
    try:
        # Terméknevek keresése
        products = db.session.query(
            Inventory.product_name,
            Inventory.product_type, 
            Inventory.manufacturer,
            Inventory.unit_of_measure,
            Inventory.currency,
            Inventory.average_purchase_price,
            Inventory.current_quantity
        ).filter(
            db.or_(
                Inventory.product_name.ilike(f'%{query}%'),
                Inventory.product_type.ilike(f'%{query}%'),
                Inventory.manufacturer.ilike(f'%{query}%')
            )
        ).distinct().limit(10).all()
        
        results = []
        for product in products:
            results.append({
                'product_name': product.product_name,
                'product_type': product.product_type,
                'manufacturer': product.manufacturer,
                'unit_of_measure': product.unit_of_measure,
                'currency': product.currency,
                'last_price': product.average_purchase_price,
                'current_stock': product.current_quantity,
                'display_text': f"{product.product_name} - {product.product_type} ({product.manufacturer})"
            })
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({
            'message': 'Hiba az autocomplete lekérdezésekor.',
            'error': str(e)
        }), 400

