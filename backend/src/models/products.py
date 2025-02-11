from datetime import datetime
from src.extensions.database import db

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    type = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    manufacturer = db.Column(db.String(80), nullable=False)
    purchase_price = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'purchase_date': self.purchase_date,
            'name': self.name,
            'type': self.type,
            'quantity': self.quantity,
            'manufacturer': self.manufacturer,
            'purchase_price': self.purchase_price
        }