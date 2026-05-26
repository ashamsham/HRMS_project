from backend.models.appraisal import Appraisal
from sqlalchemy import func

def create_appraisal(db, appraisal_data):

    new_appraisal = Appraisal(
        employee_id=appraisal_data.employee_id,
        review_period=appraisal_data.review_period,
        goals=appraisal_data.goals,
        self_review=appraisal_data.self_review,
        manager_review=appraisal_data.manager_review,
        rating=appraisal_data.rating,
        comments=appraisal_data.comments,
        promotion_recommendation=appraisal_data.promotion_recommendation,
        review_date=appraisal_data.review_date
    )

    db.add(new_appraisal)
    db.commit()
    db.refresh(new_appraisal)

    return new_appraisal


def get_all_appraisals(db):

    return db.query(Appraisal).all()


def get_employee_appraisals(db, employee_id):

    return db.query(Appraisal).filter(
        Appraisal.employee_id == employee_id
    ).all()


def update_appraisal(db, appraisal_id, appraisal_data):
    """Update an existing appraisal"""
    appraisal = db.query(Appraisal).filter(Appraisal.id == appraisal_id).first()

    if not appraisal:
        return {"error": "Appraisal not found"}

    update_data = appraisal_data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(appraisal, key, value)

    db.commit()
    db.refresh(appraisal)

    return appraisal


def get_appraisal_analytics(db):
    """Get appraisal analytics for dashboard"""
    total_appraisals = db.query(func.count(Appraisal.id)).scalar()

    rating_distribution = db.query(
        Appraisal.rating,
        func.count(Appraisal.id)
    ).group_by(Appraisal.rating).all()

    promotion_recommendations = db.query(
        func.count(Appraisal.id)
    ).filter(func.lower(Appraisal.promotion_recommendation) == 'yes').scalar()

    avg_rating = db.query(func.avg(Appraisal.rating)).scalar()

    return {
        "total_appraisals": total_appraisals,
        "rating_distribution": dict(rating_distribution),
        # show yes/no instead of numeric count
        "promotion_recommendations": "yes" if promotion_recommendations and promotion_recommendations > 0 else "no",
        "average_rating": round(avg_rating, 2) if avg_rating else 0
    }


def get_pending_appraisals(db):
    """Get appraisals that need manager review"""
    return db.query(Appraisal).filter(
        Appraisal.self_review.isnot(None),
        Appraisal.manager_review.is_(None)
    ).all()


def submit_self_review(db, appraisal_id, self_review_data):
    """Employee submits self review"""
    appraisal = db.query(Appraisal).filter(Appraisal.id == appraisal_id).first()

    if not appraisal:
        return {"error": "Appraisal not found"}

    appraisal.self_review = self_review_data.self_review
    appraisal.goals = getattr(self_review_data, 'goals_achieved', None)

    db.commit()
    db.refresh(appraisal)

    return appraisal


def submit_manager_review(db, appraisal_id, manager_review_data):
    """Manager submits review"""
    appraisal = db.query(Appraisal).filter(Appraisal.id == appraisal_id).first()

    if not appraisal:
        return {"error": "Appraisal not found"}

    appraisal.manager_review = manager_review_data.manager_review
    appraisal.rating = manager_review_data.rating
    appraisal.comments = manager_review_data.comments
    appraisal.promotion_recommendation = manager_review_data.promotion_recommendation

    db.commit()
    db.refresh(appraisal)

    return appraisal
