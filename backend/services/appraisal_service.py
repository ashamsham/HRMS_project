from app.models.appraisal import Appraisal

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