from datetime import datetime
from src.extensions.database import db
from sqlalchemy import func

class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    product_type = db.Column(db.String(80), nullable=False)
    manufacturer = db.Column(db.String(80), nullable=False)
    unit_of_measure = db.Column(db.String(10), default="db", nullable=False)  # ← ÚJ mező
    current_quantity = db.Column(db.Integer, default=0, nullable=False)
    reserved_quantity = db.Column(db.Integer, default=0, nullable=False)
    available_quantity = db.Column(db.Integer, default=0, nullable=False)
    average_purchase_price = db.Column(db.Float, default=0.0, nullable=False)
    currency = db.Column(db.String(3), default="HUF", nullable=False)
    total_value = db.Column(db.Float, default=0.0, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    movements = db.relationship('InventoryMovement', backref='inventory', lazy=True)
    
    def calculate_total_value(self):
        """Kiszámolja a készlet teljes értékét"""
        self.total_value = self.current_quantity * self.average_purchase_price
        return self.total_value
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product_name,
            'product_type': self.product_type,
            'manufacturer': self.manufacturer,
            'unit_of_measure': self.unit_of_measure,
            'current_quantity': self.current_quantity,
            'reserved_quantity': self.reserved_quantity,
            'available_quantity': self.available_quantity,
            'average_purchase_price': self.average_purchase_price,
            'currency': self.currency,
            'total_value': self.total_value,
            'last_updated': self.last_updated.strftime('%Y-%m-%d %H:%M:%S')
        }

class InventoryMovement(db.Model):
    __tablename__ = 'inventory_movements'
    
    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    movement_type = db.Column(db.String(20), nullable=False)  # 'IN', 'OUT', 'RESERVE', 'UNRESERVE'
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=True)  # Egységár a mozgás idején
    currency = db.Column(db.String(3), nullable=True)  # Pénznem
    reference_type = db.Column(db.String(20), nullable=False)  # 'DELIVERY_NOTE', 'SALE', 'ADJUSTMENT'
    reference_id = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'inventory_id': self.inventory_id,
            'movement_type': self.movement_type,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'currency': self.currency,
            'reference_type': self.reference_type,
            'reference_id': self.reference_id,
            'notes': self.notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
