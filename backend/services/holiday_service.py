import holidays

from datetime import date

from backend.services.notification_service import create_notification


# Get Current Year Holidays
def get_indian_holidays():

    current_year = date.today().year

    india_holidays = holidays.India(
        years=current_year
    )

    holiday_list = []

    for holiday_date, holiday_name in (
        india_holidays.items()
    ):

        holiday_list.append({

            "date": str(holiday_date),

            "holiday": holiday_name
        })

    return holiday_list


# Auto Send Holiday Notifications
def send_holiday_notifications(
    db,
    employee_id
):

    current_year = date.today().year

    india_holidays = holidays.India(
        years=current_year
    )

    notifications = []

    for holiday_date, holiday_name in (
        india_holidays.items()
    ):

        create_notification(
            db,
            employee_id,
            "Holiday Notification",
            f"{holiday_name} holiday on {holiday_date}",
        )

    return {"message": "Holiday notifications sent"}