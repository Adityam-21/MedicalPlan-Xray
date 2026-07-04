# MedicalPlan-Xray

### End-to-End Machine Learning System for Medical Insurance Plan Recommendation

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-API-teal)
![XGBoost](https://img.shields.io/badge/XGBoost-Classifier-green)
![Status](https://img.shields.io/badge/Status-Production--Ready-success)
![Tests](https://img.shields.io/badge/Tests-2%20Passing-success)

------------------------------------------------------------------------

## Overview

MedicalPlan-Xray is an end-to-end machine learning project that
recommends an appropriate medical insurance plan (Low, Medium or High)
using demographic, financial and lifestyle information.

The project demonstrates a complete ML lifecycle, from data preparation
and feature engineering to model training, a production-style FastAPI
backend, prediction logging with Supabase, automated validation and
reproducible deployment.

## Features

-   XGBoost + SMOTE classification pipeline
-   Serialized preprocessing + model in a single artifact
-   Feature engineering at inference
-   FastAPI REST API
-   Supabase prediction logging
-   Pydantic request validation
-   Out-of-distribution warnings
-   Reproducible environment with pinned dependencies
-   Unit tests with pytest

------------------------------------------------------------------------

## Business Problem

Insurance providers often need to recommend plans consistently and
quickly. This project automates that decision using historical customer
information while exposing predictions through an API suitable for
integration into other applications.

------------------------------------------------------------------------

## Dataset

  Property                                     Value
  --------------------- ----------------------------
  Records                                        980
  Target Classes                                   3
  Original Features                               11
  Engineered Features                              4
  Problem Type            Multi-class Classification

Target classes:

-   Low
-   Medium
-   High

------------------------------------------------------------------------

## Repository Structure

``` text
MedicalPlan-Xray/
├── backend/
│   └── app/
├── data/
├── docs/
├── frontend/
├── models/
├── notebooks/
├── src/
├── tests/
├── visuals/
├── .env.example
├── README.md
└── requirements.txt
```

------------------------------------------------------------------------

## Machine Learning Workflow

1.  Data Cleaning
2.  Exploratory Data Analysis
3.  Feature Engineering
4.  Data Preprocessing
5.  Model Training
6.  Hyperparameter Tuning
7.  Model Selection
8.  FastAPI Integration
9.  Prediction Logging

------------------------------------------------------------------------

## Feature Engineering

Engineered features include:

-   Expense Ratio
-   Savings
-   Income per Family Member
-   Expenditure per Family Member

------------------------------------------------------------------------

## Model

The deployed model is an **XGBoost classifier** trained inside an
**imbalanced-learn Pipeline** containing:

-   ColumnTransformer
-   StandardScaler
-   OneHotEncoder
-   SMOTE
-   XGBoost Classifier

This ensures training and inference use identical preprocessing.

------------------------------------------------------------------------

## Backend Architecture

``` text
Client
  │
FastAPI
  │
Prediction Service
  │
Feature Engineering
  │
Serialized Pipeline
  │
Prediction
  │
Supabase Logging (non-blocking)
```

------------------------------------------------------------------------

## API

### POST /predict

Returns:

-   Recommended plan
-   Confidence
-   Class probabilities
-   Model metadata

Example response:

``` json
{
  "status": "success",
  "prediction": {
    "recommended_plan": "Medium",
    "confidence": 89.62
  }
}
```

------------------------------------------------------------------------

## Installation

``` bash
git clone https://github.com/Adityam-21/MedicalPlan-Xray.git
cd MedicalPlan-Xray

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

Copy the example environment file:

``` bash
cp .env.example .env
```

Populate:

-   SUPABASE_URL
-   SUPABASE_KEY

Run the API:

``` bash
python -m uvicorn backend.app.main:app --reload
```

Swagger:

    http://127.0.0.1:8000/docs

------------------------------------------------------------------------

## Running Tests

``` bash
python -m pytest
```

Current status:

    2 passed

------------------------------------------------------------------------

## Technology Stack

-   Python
-   Pandas
-   NumPy
-   Scikit-learn
-   Imbalanced-Learn
-   XGBoost
-   FastAPI
-   Supabase
-   SQLAlchemy
-   Pytest

------------------------------------------------------------------------

# 📸 Application Preview

A quick overview of the **MedicalPlan-Xray** web application and its FastAPI backend.

| 🏠 Home | 📝 Prediction |
|:--------:|:-------------:|
| ![Home](visuals/home.png) | ![Prediction](visuals/predict.png) |

| 🤖 Prediction Result | ℹ️ About |
|:--------------------:|:--------:|
| ![Prediction Result](visuals/prediction-result.png) | ![About](visuals/about.png) |

### ⚡ Interactive API Documentation

Explore and test the REST API directly through the automatically generated Swagger UI.

| API Overview | Prediction Endpoint |
|:------------:|:------------------:|
| ![Swagger UI](visuals/swagger-api.png) | ![Prediction Endpoint](visuals/swagger-api-prediction.png) |

------------------------------------------------------------------------

## Current Limitations

-   Local deployment only
-   No CI/CD pipeline yet
-   No authentication
-   Monitoring not yet implemented

------------------------------------------------------------------------

## Future Roadmap

-   Docker support
-   Cloud deployment
-   CI/CD
-   Model monitoring
-   Drift detection
-   Retraining pipeline
-   Authentication
-   Dashboard analytics

------------------------------------------------------------------------

## Author

**Kumar Adityam**

Machine Learning Engineer • Backend Developer

-   GitHub: https://github.com/Adityam-21
-   LinkedIn: https://linkedin.com/in/kumar-adityam-4b2b7b1b4

------------------------------------------------------------------------

## License

This project is released under the MIT License.
