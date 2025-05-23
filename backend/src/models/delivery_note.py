from datetime import datetime
from src.extensions.database import db

class DeliveryNote(db.Model):
    __tablename__ = 'delivery_notes'
    
    id = db.Column(db.Integer, primary_key=True)
    delivery_number = db.Column(db.String(20), unique=True, nullable=False)
    delivery_date = db.Column(db.Date, default=datetime.utcnow().date(), nullable=False)
    supplier_name = db.Column(db.String(100), nullable=True)
    total_value = db.Column(db.Float, default=0.0, nullable=False)
    currency = db.Column(db.String(3), default="HUF", nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    items = db.relationship('DeliveryNoteItem', backref='delivery_note', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'delivery_number': self.delivery_number,
            'delivery_date': self.delivery_date.strftime('%Y-%m-%d'),
            'supplier_name': self.supplier_name,
            'total_value': self.total_value,
            'currency': self.currency,
            'notes': self.notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'items': [item.to_dict() for item in self.items]
        }

class DeliveryNoteItem(db.Model):
    __tablename__ = 'delivery_note_items'
    
    id = db.Column(db.Integer, primary_key=True)
    delivery_note_id = db.Column(db.Integer, db.ForeignKey('delivery_notes.id'), nullable=False)
    product_name = db.Column(db.String(100), nullable=False)
    product_type = db.Column(db.String(80), nullable=False)
    manufacturer = db.Column(db.String(80), nullable=False)
    unit_of_measure = db.Column(db.String(10), default="db", nullable=False)  # ← ÚJ mező
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default="HUF", nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'delivery_note_id': self.delivery_note_id,
            'product_name': self.product_name,
            'product_type': self.product_type,
            'manufacturer': self.manufacturer,
            'unit_of_measure': self.unit_of_measure,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price,
            'currency': self.currency
        }
