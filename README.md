# MedicalPlan-Xray
### End-to-End Machine Learning System for Medical Insurance Plan Recommendation

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-orange)
![XGBoost](https://img.shields.io/badge/XGBoost-GradientBoosting-green)
![FastAPI](https://img.shields.io/badge/FastAPI-API-teal)
![Status](https://img.shields.io/badge/Status-Completed-success)

---

# Overview

MedicalPlan-Xray is an end-to-end Machine Learning project that predicts the most suitable medical insurance plan for a customer based on demographic, financial, and lifestyle information.

The project simulates a real-world insurance recommendation system where customer information is processed through a complete ML pipeline to recommend one of the following plans:

- 🟢 Low Plan
- 🟡 Medium Plan
- 🔴 High Plan

The project covers the entire machine learning lifecycle:

- Data Cleaning
- Exploratory Data Analysis
- Feature Engineering
- Data Preprocessing
- Model Training
- Hyperparameter Tuning
- Prediction Pipeline
- Deployment Preparation

---

# Business Problem

Insurance companies often need to recommend suitable medical plans to customers based on multiple factors such as:

- Age
- Income
- Occupation Risk
- Smoking Habits
- Family Size
- Expenditure Patterns

Manual recommendations can be:

- Inconsistent
- Time-consuming
- Subjective

The objective of this project is to build a machine learning system capable of automatically recommending an appropriate medical insurance plan with high accuracy.

---

# Dataset Information

| Property | Value |
|----------|--------|
| Number of Records | 980 |
| Target Classes | 3 |
| Features | 11 Original + 4 Engineered |
| Problem Type | Multi-Class Classification |

### Target Variable

```text
Low
Medium
High
```

---

# Project Structure

```text
MedicalPlan-Xray/
│
├── app/
├── data/
│   ├── raw/
│   ├── interim/
│   └── processed/
│
├── models/
│   ├── insurance_model.pkl
│   ├── class_mapping.pkl
│   ├── model_metrics.pkl
│   └── model_card.md
│
├── notebooks/
│   ├── 01_data_loading.ipynb
│   ├── 02_cleaning.ipynb
│   ├── 03_eda.ipynb
│   ├── 04_feature_engineering.ipynb
│   ├── 05_modeling.ipynb
│   ├── 06_feature_importance_and_interpretability.ipynb
│   ├── 07_model_optimization.ipynb
│   └── 08_final_pipeline_and_deployment.ipynb
│
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── feature_engineering.py
│   ├── predict.py
│   └── train.py
│
├── tests/
│   ├── test_prediction.py
│   └── test_db.py
│
├── visuals/
├── requirements.txt
├── README.md
└── .gitignore
```

---

# Machine Learning Workflow

```text
Data Loading
      ↓
Data Cleaning
      ↓
Exploratory Data Analysis
      ↓
Feature Engineering
      ↓
Preprocessing Pipeline
      ↓
Model Training
      ↓
Hyperparameter Tuning
      ↓
Prediction Pipeline
      ↓
Deployment
```

---

# Exploratory Data Analysis Highlights

Some major findings from the dataset:

- Smokers tend to opt for higher medical plans.
- High-risk occupations show greater preference for higher coverage.
- Customers with larger family sizes prefer higher plans.
- Higher expenditure generally correlates with higher insurance plans.
- State tiers and salary brackets influence plan selection.

---

# Feature Engineering

The following features were engineered:

### Expense Ratio

```python
annual_expenditure_inr / total_income_inr
```

### Savings

```python
total_income_inr - annual_expenditure_inr
```

### Income Per Member

```python
total_income_inr / family_members
```

### Expenditure Per Member

```python
annual_expenditure_inr / family_members
```

---

# Models Evaluated

- Logistic Regression
- Decision Tree
- Random Forest
- XGBoost
- SMOTE Pipelines

---

# Final Model

### XGBoost + SMOTE Pipeline

The final production model uses:

- ColumnTransformer
- StandardScaler
- OneHotEncoder
- XGBoost Classifier
- SMOTE for class balancing

---

# Final Model Performance

| Metric | Score |
|--------|--------|
| Accuracy | 82% |
| Precision | 82% |
| Recall | 93% |
| F1 Score | 87% |
| Macro f1 | 80% |

> Update the above metrics with your final scores.

---

# Prediction Pipeline

The prediction pipeline performs:

1. Input Validation
2. Out-of-Distribution Detection
3. Feature Engineering
4. Preprocessing
5. Prediction
6. Probability Generation

Example response:

```json
{
  "prediction": "High",
  "probabilities": {
    "Low": 0.1185,
    "Medium": 0.1307,
    "High": 0.7508
  }
}
```

---

# Tech Stack

### Programming

- Python

### Data Analysis

- Pandas
- NumPy

### Visualization

- Matplotlib
- Seaborn

### Machine Learning

- Scikit-Learn
- XGBoost
- Imbalanced-Learn

### Deployment

- FastAPI
- Docker

### Database

- Supabase PostgreSQL

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Adityam-21/MedicalPlan-Xray.git
cd MedicalPlan-Xray
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Running the Project

```bash
jupyter notebook
```

For API deployment:

```bash
uvicorn app.main:app --reload
```

---

# Future Improvements

- Model Monitoring
- Data Drift Detection
- CI/CD Pipeline
- Cloud Deployment
- Automated Retraining
- User Interface for Predictions

---

# Author

### Kumar Adityam
B.Tech Information Technology  
Machine Learning Engineer | Backend Developer

- GitHub: https://github.com/Adityam-21
- LinkedIn: https://linkedin.com/in/kumar-adityam-4b2b7b1b4

---