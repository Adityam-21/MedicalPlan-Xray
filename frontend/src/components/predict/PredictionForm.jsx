import { predictMedicalPlan } from "../../services/api";
import { useForm } from "react-hook-form";

import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

import {
    GENDER_OPTIONS,
    STATE_TIER_OPTIONS,
    OCCUPATION_OPTIONS,
    SALARY_OPTIONS,
    SMOKER_OPTIONS,
} from "../../utils/formOptions";

function PredictionForm({ onPrediction }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            age: "",
            gender: "",
            state_tier: "",
            occupation_class: "",
            salary_bracket: "",
            total_income_inr: "",
            annual_expenditure_inr: "",
            is_smoker: "",
            family_members: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const result = await predictMedicalPlan(data);

            await new Promise((resolve) => setTimeout(resolve, 1200));

            onPrediction(result);
        } catch (error) {
            console.error(error);
            alert("Prediction failed. Please check that the FastAPI backend is running.");
        }
    };

    return (
        <Card>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                Customer Details
            </h2>

            <form

                autoComplete="off"

                onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Input
                        id="age"
                        label="Age"
                        type="number"
                        placeholder="Enter age"
                        error={errors.age?.message}
                        {...register("age", {
                            required: "Age is required",
                            valueAsNumber: true,
                            min: { value: 18, message: "Minimum age is 18" },
                            max: { value: 100, message: "Maximum age is 100" },
                        })}
                    />

                    <Select
                        id="gender"
                        label="Gender"
                        placeholder="Select gender"
                        options={GENDER_OPTIONS}
                        error={errors.gender?.message}
                        {...register("gender", {
                            required: "Gender is required",
                        })}
                    />

                    <Select
                        id="state_tier"
                        label="State Tier"
                        placeholder="Select state tier"
                        options={STATE_TIER_OPTIONS}
                        error={errors.state_tier?.message}
                        {...register("state_tier", {
                            required: "State tier is required",
                        })}
                    />

                    <Select
                        id="occupation_class"
                        label="Occupation Class"
                        placeholder="Select occupation"
                        options={OCCUPATION_OPTIONS}
                        error={errors.occupation_class?.message}
                        {...register("occupation_class", {
                            required: "Occupation class is required",
                        })}
                    />

                    <Select
                        id="salary_bracket"
                        label="Salary Bracket"
                        placeholder="Select salary bracket"
                        options={SALARY_OPTIONS}
                        error={errors.salary_bracket?.message}
                        {...register("salary_bracket", {
                            required: "Salary bracket is required",
                        })}
                    />

                    <Input
                        id="total_income_inr"
                        label="Total Income (₹)"
                        type="number"
                        placeholder="Enter annual income"
                        error={errors.total_income_inr?.message}
                        {...register("total_income_inr", {
                            required: "Income is required",
                            valueAsNumber: true,
                            min: {
                                value: 1,
                                message: "Income must be greater than 0",
                            },
                        })}
                    />

                    <Input
                        id="annual_expenditure_inr"
                        label="Annual Expenditure (₹)"
                        type="number"
                        placeholder="Enter annual expenditure"
                        error={errors.annual_expenditure_inr?.message}
                        {...register("annual_expenditure_inr", {
                            required: "Annual expenditure is required",
                            valueAsNumber: true,
                            min: {
                                value: 0,
                                message: "Cannot be negative",
                            },
                        })}
                    />

                    <Select
                        id="is_smoker"
                        label="Smoker"
                        placeholder="Select option"
                        options={SMOKER_OPTIONS}
                        error={errors.is_smoker?.message}
                        {...register("is_smoker", {
                            required: "Please select an option",
                            setValueAs: (value) => Number(value),
                        })}
                    />

                </div>

                <Input
                    id="family_members"
                    label="Family Members"
                    type="number"
                    placeholder="Enter family members"
                    error={errors.family_members?.message}
                    {...register("family_members", {
                        required: "Family members are required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum is 1" },
                        max: { value: 20, message: "Maximum is 20" },
                    })}
                />

                <div className="sticky bottom-0 mt-2 bg-white pt-4">

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isSubmitting}
                    >
                        Predict Plan
                    </Button>
                </div>
            </form>
        </Card >
    );
}

export default PredictionForm;