from datetime import datetime
from src.extensions.database import db

class SoldProducts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    purchase_date = db.Column(db.Date, default=datetime.utcnow().date(), nullable=False)
    sell_date = db.Column(db.Date, default=datetime.utcnow().date(), nullable=False)
    in_receipt = db.Column(db.String(256), default=None)
    out_receipt = db.Column(db.String(256), default=None)
    type = db.Column(db.String(80), nullable=False)
    customer_name = db.Column(db.String(80), default=None)
    manufacturer = db.Column(db.String(80), nullable=False)
    in_price = db.Column(db.Float, nullable=False)
    out_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'purchase_date': self.purchase_date,
            'sell_date': self.sell_date,
            'in_receipt': self.in_receipt,
            'out_receipt': self.out_receipt,
            'type': self.type,
            'customer_name': self.customer_name,
            'manufacturer': self.manufacturer,
            'in_price': self.in_price,
            'out_price': self.out_price,
            'quantity': self.quantity,
        }