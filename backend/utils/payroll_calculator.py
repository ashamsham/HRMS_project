def calculate_net_salary(
    basic_salary,
    allowances,
    deductions,
    tax,
    pf
):

    return (
        basic_salary
        + allowances
        - deductions
        - tax
        - pf
    )