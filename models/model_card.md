# MedicalPlan-Xray Model Card

---

# 1. Model Information

| Attribute | Value |
|-----------|--------|
| Project Name | MedicalPlan-Xray |
| Version | v1.0.0 |
| Model Type | XGBoost + SMOTE |
| Task | Multiclass Classification |
| Target Variable | medical_plan |
| Classes | Low, Medium, High |
| Author | Adityam Kumar |

---

# 2. Problem Statement

MedicalPlan-Xray aims to predict the most suitable medical insurance plan (Low, Medium, or High) for customers based on demographic, financial, and lifestyle characteristics.

The objective is to assist insurance providers in understanding customer needs and recommending appropriate medical plans through data-driven decision making.

---

# 3. Dataset Information

| Attribute | Value |
|-----------|--------|
| Dataset Size | 980 Records |
| Number of Features | 12 |
| Target Classes | 3 |
| Data Type | Structured Tabular Data |
| Dataset Source | Synthetic Healthcare Dataset for Educational Purposes |

### Target Distribution

- Low: 15.816327%
- Medium: 41.530612%
- High: 42.653061%

---

# 4. Input Features

### Demographic Features
- age
- gender
- state_tier
- family_members

### Occupational Features
- occupation_class

### Financial Features
- salary_bracket
- total_income_inr
- annual_expenditure_inr

### Lifestyle Features
- is_smoker

### Engineered Features
- expense_ratio
- savings
- income_per_member
- expenditure_per_member

---

# 5. Data Preprocessing

The following preprocessing steps were performed:

- Missing value handling
- Duplicate checks
- Data cleaning and standardization
- Category normalization
- Label Encoding
- Feature Engineering
- Train-Test Split
- Class imbalance treatment using SMOTE

---

# 6. Feature Engineering

The following features were created to improve predictive performance:

### Expense Ratio
```
annual_expenditure_inr / total_income_inr
```

### Savings
```
total_income_inr - annual_expenditure_inr
```

### Income Per Member
```
total_income_inr / family_members
```

### Expenditure Per Member
```
annual_expenditure_inr / family_members
```

---

# 7. Class Imbalance Handling

### Technique Used
SMOTE (Synthetic Minority Oversampling Technique)

### Reason
The target classes were imbalanced, with the minority class being underrepresented. SMOTE was used to generate synthetic samples and improve model generalization and minority class recall.

---

# 8. Model Performance

| Metric | Score |
|--------|--------|
| Accuracy | 82% |
| Precision | 82% |
| Recall | 93% |
| F1 Score | 87% |
| Macro f1 | 80% |

### Additional Evaluation

- Classification Report
- Confusion Matrix
- Cross Validation
- Feature Importance Analysis

Visualizations are available inside the `visuals/` directory.

---

# 9. Top Important Features

The model identified the following features as highly influential:

1. salary_bracket
2. expense_ratio
3. occupation_class
4. is_smoker
5. family_members
6. total_income_inr
7. savings

---

# 10. Model Limitations

- Dataset size is relatively small.
- Dataset is synthetic and may not fully represent real-world insurance customers.
- External economic and medical factors were not considered.
- Predictions should not be used as the sole basis for insurance decisions.

---

# 11. Ethical Considerations

This model is intended to support decision-making and should be used as an assistive recommendation system only.

The model should not be used to:
- Deny insurance coverage.
- Make fully automated decisions without human review.
- Introduce unfair discrimination against any group of users.

---

# 12. Future Improvements

- Hyperparameter optimization using Optuna.
- Explainable AI using SHAP values.
- Real-world healthcare dataset integration.
- Deployment using FastAPI and Streamlit.
- Cloud deployment and monitoring.
- Continuous retraining pipeline.

---

# 13. Repository Structure

```
models/
├── insurance_model.pkl
├── class_mapping.pkl
├── model_metrics.pkl
└── model_card.md
```

---

# 14. Usage

```python
import joblib

model = joblib.load("models/insurance_model.pkl")

prediction = model.predict(input_data)
```

---

# 15. License

This project is developed for educational and portfolio purposes.

---

**Project:** MedicalPlan-Xray  
**Version:** v1.0.0  
**Author:** Adityam Kumar  
**Repository:** https://github.com/Adityam-21/MedicalPlan-Xray