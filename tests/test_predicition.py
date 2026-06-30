from src.predict import predict_medical_plan

def test_prediction():

    customer = {
        ...
    }

    result = predict_medical_plan(customer)

    assert "prediction" in result
    assert "probabilities" in result