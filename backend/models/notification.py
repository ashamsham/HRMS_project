from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base

from backend.models.base_model import TimestampMixin


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    # target can be an employee external id (eg. EMP-...), a numeric id string,
    # a role name (eg. hr, manager) or the literal 'all'
    employee_id = Column(String(50), nullable=False)

    title = Column(String(255), nullable=False)

    message = Column(String(500), nullable=False)

    recipients = relationship(
        "NotificationRecipient",
        back_populates="notification",
        cascade="all, delete-orphan",
    )


class NotificationRecipient(Base, TimestampMixin):
    __tablename__ = "notification_recipients"

    id = Column(Integer, primary_key=True, index=True)

    notification_id = Column(Integer, ForeignKey("notifications.id"), nullable=False)

    # employee external id (eg. EMP-...)
    employee_id = Column(String(50), nullable=False)

    is_read = Column(Boolean, default=False)

    notification = relationship("Notification", back_populates="recipients")