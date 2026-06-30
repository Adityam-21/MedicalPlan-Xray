import numpy as np

def create_features(df):

    df = df.copy()

    df['expense_ratio'] = (
        df['annual_expenditure_inr'] /
        df['total_income_inr']
    )

    df['savings'] = (
        df['total_income_inr'] -
        df['annual_expenditure_inr']
    )

    df['income_per_member'] = (
        df['total_income_inr'] /
        df['family_members']
    )

    df['expenditure_per_member'] = (
        df['annual_expenditure_inr'] /
        df['family_members']
    )

    return df